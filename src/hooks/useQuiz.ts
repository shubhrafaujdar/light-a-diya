
import { useState, useEffect, useCallback } from 'react'
import { QuizSession, QuizQuestion, QuizCategory } from '@/types/database'
import { useAuth } from '@/components/AuthProvider'
import {
    saveQuizProgress,
    loadQuizProgress,
    clearQuizProgress,
    QUIZ_CONSTANTS
} from '@/utils/quiz-utils'
import { analytics } from '@/lib/analytics'

interface UseQuizReturn {
    session: QuizSession | null
    isLoading: boolean
    error: Error | null
    selectAnswer: (index: number) => void
    nextQuestion: () => void
    isQuizComplete: boolean
    // New returns for anonymous user features
    isAnonymous: boolean
    questionsRemaining: number | null
    timerSeconds: number | null
    showSignInPrompt: boolean
    signInReason: 'timer' | 'question_limit' | 'timer_stopped' | null
    dismissSignInPrompt: () => void
    stopTimer: () => void
}

interface QuizApiResponse {
    data?: {
        category: QuizCategory
        questions: QuizQuestion[]
    }
    error?: string
}

export function useQuiz(categoryId: string): UseQuizReturn {
    const { user } = useAuth()
    const [session, setSession] = useState<QuizSession | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [showSignInPrompt, setShowSignInPrompt] = useState(false)
    const [signInReason, setSignInReason] = useState<'timer' | 'question_limit' | 'timer_stopped' | null>(null)
    const [quizStartTime] = useState(Date.now())

    const isAnonymous = !user

    // Timer effect - runs every second for anonymous users
    useEffect(() => {
        if (!session || !isAnonymous || session.timerRemainingSeconds <= 0) {
            return
        }

        const interval = setInterval(() => {
            setSession(prev => {
                if (!prev || prev.timerRemainingSeconds <= 0) {
                    return prev
                }

                const newRemaining = prev.timerRemainingSeconds - 1

                // Check if timer expired
                if (newRemaining <= 0) {
                    setShowSignInPrompt(true)
                    setSignInReason('timer')
                    return { ...prev, timerRemainingSeconds: 0 }
                }

                return { ...prev, timerRemainingSeconds: newRemaining }
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [session?.timerRemainingSeconds, isAnonymous])

    // Save progress to sessionStorage whenever session changes
    useEffect(() => {
        if (session && !session.hasReachedLimit) {
            saveQuizProgress(categoryId, session)
        }
    }, [session, categoryId])

    // Handle authentication state changes
    useEffect(() => {
        if (user && session && session.isAuthenticated === false) {
            // User just signed in during quiz - upgrade session
            setSession(prev => {
                if (!prev) return null

                return {
                    ...prev,
                    isAuthenticated: true,
                    timerStartTime: null,
                    timerRemainingSeconds: 0,
                    hasReachedLimit: false,
                }
            })

            // Close sign-in prompt if open
            setShowSignInPrompt(false)
            setSignInReason(null)
        }
    }, [user, session?.isAuthenticated])

    // Fetch quiz data
    useEffect(() => {
        let isMounted = true

        async function fetchQuizData() {
            try {
                setIsLoading(true)
                setError(null)

                // Try to load saved progress first
                const savedProgress = loadQuizProgress(categoryId)

                if (savedProgress && isMounted) {
                    // Restore saved session
                    setSession(savedProgress)
                    setIsLoading(false)
                    return
                }

                const response = await fetch(`/api/quiz/${categoryId}`)
                const data: QuizApiResponse = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch quiz data')
                }

                if (!data.data) {
                    throw new Error('Invalid data received')
                }

                if (isMounted) {
                    const isAuth = !!user

                    setSession({
                        categoryId,
                        categoryName: {
                            hindi: data.data.category.name_hindi,
                            english: data.data.category.name_english
                        },
                        questions: data.data.questions,
                        currentQuestionIndex: 0,
                        selectedAnswer: null,
                        isAnswerCorrect: null,
                        completedQuestions: 0,
                        answeredQuestionIds: [],
                        isAuthenticated: isAuth,
                        timerStartTime: isAuth ? null : Date.now(),
                        timerRemainingSeconds: isAuth ? 0 : QUIZ_CONSTANTS.ANONYMOUS_TIMER_SECONDS,
                        hasReachedLimit: false,
                    })
                }
            } catch (err: unknown) {
                if (isMounted) {
                    setError(err instanceof Error ? err : new Error('An unknown error occurred'))
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        if (categoryId) {
            fetchQuizData()
        }

        return () => {
            isMounted = false
        }
    }, [categoryId, user])

    const selectAnswer = useCallback((index: number) => {
        if (showSignInPrompt) return

        if (session && !session.isAuthenticated && session.timerRemainingSeconds <= 0) {
            setShowSignInPrompt(true)
            setSignInReason('timer')
            return
        }

        setSession(prev => {
            // Prevent changing answer ONLY if we already have a correct answer
            if (!prev || (prev.selectedAnswer !== null && prev.isAnswerCorrect === true)) return prev

            const currentQuestion = prev.questions[prev.currentQuestionIndex]
            const isCorrect = index === currentQuestion.correct_answer_index

            // Track analytics
            const categoryName = prev.categoryName.english
            analytics.answerQuestion(categoryName, isCorrect, prev.currentQuestionIndex + 1)

            return {
                ...prev,
                selectedAnswer: index,
                isAnswerCorrect: isCorrect
            }
        })
    }, [showSignInPrompt, session])

    const nextQuestion = useCallback(() => {
        setSession(prev => {
            if (!prev) return null

            const isLastQuestion = prev.currentQuestionIndex >= prev.questions.length - 1

            // If completed, just return prev
            if (prev.completedQuestions === prev.questions.length) return prev

            const currentQuestion = prev.questions[prev.currentQuestionIndex]
            const newAnsweredIds = [...prev.answeredQuestionIds, currentQuestion.id]
            const newCompletedCount = prev.completedQuestions + 1

            // Check if anonymous user has reached limit
            if (!prev.isAuthenticated && newCompletedCount >= QUIZ_CONSTANTS.ANONYMOUS_QUESTION_LIMIT) {
                analytics.reachQuestionLimit(prev.categoryName.english)
                setShowSignInPrompt(true)
                setSignInReason('question_limit')

                return {
                    ...prev,
                    currentQuestionIndex: isLastQuestion ? prev.currentQuestionIndex + 1 : prev.currentQuestionIndex + 1,
                    selectedAnswer: null,
                    isAnswerCorrect: null,
                    completedQuestions: newCompletedCount,
                    answeredQuestionIds: newAnsweredIds,
                    hasReachedLimit: true,
                }
            }

            return {
                ...prev,
                currentQuestionIndex: isLastQuestion ? prev.currentQuestionIndex + 1 : prev.currentQuestionIndex + 1,
                selectedAnswer: null,
                isAnswerCorrect: null,
                completedQuestions: newCompletedCount,
                answeredQuestionIds: newAnsweredIds,
            }
        })
    }, [])

    const dismissSignInPrompt = useCallback(() => {
        setShowSignInPrompt(false)
        setSignInReason(null)
    }, [])



    const isQuizComplete = session
        ? session.completedQuestions === session.questions.length
        : false

    // Clear progress when quiz is complete
    useEffect(() => {
        if (isQuizComplete && session) {
            clearQuizProgress(categoryId)

            // Track completion with enhanced analytics
            const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000)
            const categoryName = session.categoryName.english
            analytics.completeQuiz(
                categoryName,
                session.completedQuestions,
                session.isAuthenticated,
                timeSpent
            )
        }
    }, [isQuizComplete, categoryId, session, quizStartTime])

    const questionsRemaining = session && !session.isAuthenticated
        ? Math.max(0, QUIZ_CONSTANTS.ANONYMOUS_QUESTION_LIMIT - session.completedQuestions)
        : null

    const timerSeconds = session && !session.isAuthenticated
        ? session.timerRemainingSeconds
        : null

    const stopTimer = useCallback(() => {
        if (session) {
            // analytics.stopTimer(session.categoryName.english, timerSeconds || 0) // Re-enable later
            setShowSignInPrompt(true)
            setSignInReason('timer_stopped')
        }
    }, [session, timerSeconds])

    return {
        session,
        isLoading,
        error,
        selectAnswer,
        nextQuestion,
        isQuizComplete,
        isAnonymous,
        questionsRemaining,
        timerSeconds,
        showSignInPrompt,
        signInReason,
        dismissSignInPrompt,
        stopTimer
    }
}

