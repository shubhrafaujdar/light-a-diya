
"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useQuiz } from '@/hooks/useQuiz';
import { QuizDisplay } from '@/components/QuizDisplay';
import { SignInPrompt } from '@/components/SignInPrompt';
import { useParams } from 'next/navigation';
import { analytics } from '@/lib/analytics';
import { db } from '@/lib/database';
import { authService } from '@/lib/auth';
import { Leaderboard } from '@/components/Leaderboard';
import { useAuth } from '@/components/AuthProvider';

export default function QuizSessionPage() {
    const { language } = useLanguage();
    const { user } = useAuth();
    const params = useParams();
    const categoryId = params.categoryId as string;

    const {
        session,
        isLoading,
        error,
        selectAnswer,
        submitAnswer,
        nextQuestion,
        isQuizComplete,
        isAnonymous,
        questionsRemaining,
        timerSeconds,
        showSignInPrompt,
        signInReason,
        dismissSignInPrompt,
        stopTimer,
    } = useQuiz(categoryId);

    const [submissionStatus, setSubmissionStatus] = React.useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');
    const [currentAttemptId, setCurrentAttemptId] = React.useState<string | undefined>(undefined);
    const [anonName, setAnonName] = React.useState('');
    const [leaderboardRefresh, setLeaderboardRefresh] = React.useState(0);

    // Track quiz start
    useEffect(() => {
        if (session && !isQuizComplete) {
            const categoryName = language === 'hindi' ? session.categoryName.hindi : session.categoryName.english;
            analytics.startQuiz(categoryName);
        }
    }, [session, isQuizComplete, language]);

    const handleTimerExpire = () => {
        // Timer expiration is handled in useQuiz hook
    };

    const handleStopTimer = () => {
        stopTimer();
    };

    const submitScore = async (name: string, userId?: string) => {
        if (!session || submissionStatus === 'submitting' || submissionStatus === 'submitted') return;

        setSubmissionStatus('submitting');
        try {
            const timeTaken = session.timerStartTime
                ? Math.floor((Date.now() - session.timerStartTime) / 1000)
                : 0;
            const safeTime = timeTaken > 0 ? timeTaken : (session.timerRemainingSeconds > 0 ? (600 - session.timerRemainingSeconds) : 0);

            const attempt = await db.submitQuizAttempt({
                category_id: categoryId,
                user_id: userId,
                user_name: name,
                score: session.score,
                total_questions: session.questions.length,
                time_taken_seconds: safeTime > 0 ? safeTime : 0,
            });

            setCurrentAttemptId(attempt.id);
            setSubmissionStatus('submitted');
            setLeaderboardRefresh(prev => prev + 1);
        } catch (error) {
            console.error('Submission error', error);
            setSubmissionStatus('error');
        }
    };

    // Auto-submit for logged in users
    useEffect(() => {
        if (isQuizComplete && session?.isAuthenticated && submissionStatus === 'idle') {
            if (user) {
                submitScore(user.displayName || (language === 'hindi' ? 'भक्त' : 'Devotee'), user.id);
            }
        }
    }, [isQuizComplete, session?.isAuthenticated, submissionStatus, language, submitScore, user]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-200 border-t-spiritual-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 animate-pulse">
                        {language === 'hindi' ? 'प्रश्नोत्तरी लोड हो रही है...' : 'Loading quiz...'}
                    </p>
                </div>
            </div>
        );
    }

    if (error || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-red-500 max-w-md w-full">
                    <h3 className="text-xl font-bold text-red-600 mb-2">
                        {language === 'hindi' ? 'त्रुटि' : 'Error'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {error?.message || (language === 'hindi' ? 'प्रश्नोत्तरी लोड करने में विफल' : 'Failed to load quiz')}
                    </p>
                    <Link
                        href="/quiz"
                        className="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-center rounded-lg transition-colors"
                    >
                        {language === 'hindi' ? 'श्रेणियों पर वापस जाएं' : 'Back to Categories'}
                    </Link>
                </div>
            </div>
        );
    }

    if (isQuizComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-blue-50 py-12">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full text-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-sm">
                        🎉
                    </div>

                    <h2 className={`text-2xl md:text-3xl font-bold text-gray-800 mb-2 ${language === 'hindi' ? 'heading-font' : ''}`}>
                        {language === 'hindi' ? 'बधाई हो!' : 'Congratulations!'}
                    </h2>

                    <p className="text-gray-600 mb-2">
                        {language === 'hindi'
                            ? `आपने '${session.categoryName.hindi}' क्विज़ पूरा कर लिया है।`
                            : `You have completed the '${session.categoryName.english}' quiz.`}
                    </p>

                    <div className="text-3xl font-bold text-orange-600 mb-8">
                        {language === 'hindi' ? 'आपका स्कोर:' : 'Your Score:'} {session.score}/{session.hasReachedLimit ? 10 : session.questions.length}
                    </div>

                    {/* Anonymous User Login CTA */}
                    {!session.isAuthenticated && submissionStatus !== 'submitted' && (
                        <div className="mb-8 p-6 bg-orange-50 rounded-xl border border-orange-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {language === 'hindi' ? 'लीडरबोर्ड में शामिल हों 🏆' : 'Join the Leaderboard 🏆'}
                            </h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                {language === 'hindi'
                                    ? `अपना स्कोर (${session.score}/${session.questions.length}) सुरक्षित करने और लीडरबोर्ड पर अपनी रैंक देखने के लिए साइन इन करें।`
                                    : `Sign in to save your score of ${session.score}/${session.questions.length} and see where you rank!`}
                            </p>

                            <button
                                onClick={() => {
                                    setSubmissionStatus('submitting'); // Show loading state
                                    authService.signInWithGoogle(window.location.pathname);
                                }}
                                disabled={submissionStatus === 'submitting'}
                                className="w-full sm:w-auto px-8 py-3 bg-white border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-700 font-medium rounded-lg transition-all flex items-center justify-center gap-3 mx-auto shadow-sm"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                {language === 'hindi' ? 'Google से साइन इन करें' : 'Sign in with Google'}
                            </button>
                        </div>
                    )}

                    {/* Leaderboard Section */}
                    <div className="mb-8 flex flex-col items-center">
                        <Leaderboard
                            categoryId={categoryId}
                            currentAttemptId={currentAttemptId}
                            refreshTrigger={leaderboardRefresh}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/quiz"
                            className="px-6 py-3 bg-spiritual-primary text-white rounded-lg hover:bg-spiritual-primary-light transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            {language === 'hindi' ? 'अन्य क्विज़ चुनें' : 'Choose Another Quiz'}
                        </Link>

                        <Link
                            href="/"
                            className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {language === 'hindi' ? 'होम पर जाएं' : 'Go to Home'}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-20 pb-12 px-4 sm:px-6 bg-gradient-to-br from-orange-50 via-white to-blue-50">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/quiz"
                    className="inline-flex items-center text-gray-500 hover:text-spiritual-primary mb-6 transition-colors group"
                >
                    <svg className="w-5 h-5 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {language === 'hindi' ? 'श्रेणियाँ' : 'Categories'}
                </Link>

                <QuizDisplay
                    session={session}
                    selectAnswer={selectAnswer}
                    submitAnswer={submitAnswer}
                    nextQuestion={nextQuestion}
                    isAnonymous={isAnonymous}
                    questionsRemaining={questionsRemaining}
                    timerSeconds={timerSeconds}
                    onTimerExpire={handleTimerExpire}
                    onStopTimer={handleStopTimer}
                />

                {/* Sign-in prompt modal */}
                {showSignInPrompt && signInReason && session && (
                    <SignInPrompt
                        reason={signInReason}
                        categoryName={session.categoryName.english}
                        onDismiss={dismissSignInPrompt}
                    />
                )}
            </div>
        </main>
    );
}
