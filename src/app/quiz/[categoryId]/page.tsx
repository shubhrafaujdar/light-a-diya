
"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useQuiz } from '@/hooks/useQuiz';
import { QuizDisplay } from '@/components/QuizDisplay';
import { SignInPrompt } from '@/components/SignInPrompt';
import { useParams } from 'next/navigation';
import { analytics } from '@/lib/analytics';

export default function QuizSessionPage() {
    const { language } = useLanguage();
    const params = useParams();
    const categoryId = params.categoryId as string;

    const {
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
        stopTimer,
    } = useQuiz(categoryId);

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
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-blue-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-sm">
                        🎉
                    </div>

                    <h2 className={`text-2xl md:text-3xl font-bold text-gray-800 mb-2 ${language === 'hindi' ? 'heading-font' : ''}`}>
                        {language === 'hindi' ? 'बधाई हो!' : 'Congratulations!'}
                    </h2>

                    <p className="text-gray-600 mb-8">
                        {language === 'hindi'
                            ? `आपने '${session.categoryName.hindi}' क्विज़ पूरा कर लिया है।`
                            : `You have completed the '${session.categoryName.english}' quiz.`}
                    </p>

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
