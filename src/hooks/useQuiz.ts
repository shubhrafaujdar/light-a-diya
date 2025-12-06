
import { useState, useEffect, useCallback } from 'react'
import { QuizSession, QuizQuestion, QuizCategory } from '@/types/database'

interface UseQuizReturn {
    session: QuizSession | null
    isLoading: boolean
    error: Error | null
    selectAnswer: (index: number) => void
    nextQuestion: () => void
    isQuizComplete: boolean
}

interface QuizApiResponse {
    data?: {
        category: QuizCategory
        questions: QuizQuestion[]
    }
    error?: string
}

export function useQuiz(categoryId: string): UseQuizReturn {
    const [session, setSession] = useState<QuizSession | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        let isMounted = true

        async function fetchQuizData() {
            try {
                setIsLoading(true)
                setError(null)

                const response = await fetch(`/api/quiz/${categoryId}`)
                const data: QuizApiResponse = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch quiz data')
                }

                if (!data.data) {
                    throw new Error('Invalid data received')
                }

                if (isMounted) {
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
                        completedQuestions: 0
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
    }, [categoryId])

    const selectAnswer = useCallback((index: number) => {
        setSession(prev => {
            // Prevent changing answer ONLY if we already have a correct answer
            if (!prev || (prev.selectedAnswer !== null && prev.isAnswerCorrect === true)) return prev

            const currentQuestion = prev.questions[prev.currentQuestionIndex]
            const isCorrect = index === currentQuestion.correct_answer_index

            return {
                ...prev,
                selectedAnswer: index,
                isAnswerCorrect: isCorrect
            }
        })
    }, [])

    const nextQuestion = useCallback(() => {
        setSession(prev => {
            if (!prev) return null

            const isLastQuestion = prev.currentQuestionIndex >= prev.questions.length - 1

            // If completed, just return prev (or handle completion differently if needed)
            if (prev.completedQuestions === prev.questions.length) return prev;

            return {
                ...prev,
                currentQuestionIndex: isLastQuestion ? prev.currentQuestionIndex + 1 : prev.currentQuestionIndex + 1,
                selectedAnswer: null,
                isAnswerCorrect: null,
                completedQuestions: prev.completedQuestions + 1
            }
        })
    }, [])

    const isQuizComplete = session
        ? session.completedQuestions === session.questions.length
        : false

    return {
        session,
        isLoading,
        error,
        selectAnswer,
        nextQuestion,
        isQuizComplete
    }
}
