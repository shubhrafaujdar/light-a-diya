"use client";

import React, { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
// import { analytics } from '@/lib/analytics'; // TODO: Re-enable when Turbopack cache clears
import { authService } from '@/lib/auth';

interface SignInPromptProps {
    reason: 'timer' | 'question_limit' | 'timer_stopped';
    categoryName: string;
    onDismiss?: () => void;
}

export const SignInPrompt: React.FC<SignInPromptProps> = ({
    reason,
    categoryName,
    onDismiss,
}) => {
    const { language } = useLanguage();

    // Track when prompt is shown
    // TODO: Re-enable once Turbopack cache clears
    // useEffect(() => {
    //     if (analytics?.promptSignIn) {
    //         analytics.promptSignIn(reason, categoryName);
    //     }
    // }, [reason, categoryName]);

    const handleSignIn = async () => {
        await authService.signInWithGoogle();
        // analytics.login('google'); // TODO: Re-enable when Turbopack cache clears
    };

    const getTitle = () => {
        if (reason === 'timer') {
            return language === 'hindi' ? 'समय समाप्त!' : 'Time\'s Up!';
        }
        if (reason === 'timer_stopped') {
            return language === 'hindi' ? 'टाइमर रोका गया' : 'Timer Stopped';
        }
        return language === 'hindi' ? 'प्रश्न सीमा पूर्ण!' : 'Question Limit Reached!';
    };

    const getMessage = () => {
        if (reason === 'timer') {
            return language === 'hindi'
                ? 'आपका 2 मिनट का समय समाप्त हो गया है। जारी रखने के लिए साइन इन करें।'
                : 'Your 2-minute timer has expired. Sign in to continue without time limits.';
        }
        if (reason === 'timer_stopped') {
            return language === 'hindi'
                ? 'आपने टाइमर रोक दिया है। असीमित समय के लिए साइन इन करें।'
                : 'You stopped the timer. Sign in to continue without time limits.';
        }
        return language === 'hindi'
            ? 'आपने अपने 10 प्रश्नों की सीमा पूरी कर ली है। असीमित प्रश्नों के लिए साइन इन करें।'
            : 'You\'ve completed your 10 question limit. Sign in for unlimited questions.';
    };

    const benefits = [
        {
            icon: '🔓',
            hindi: 'सभी प्रश्न',
            english: 'Access all questions',
        },
        {
            icon: '⏱️',
            hindi: 'कोई टाइमर नहीं',
            english: 'No timer',
        },
        {
            icon: '📊',
            hindi: 'प्रगति ट्रैकिंग',
            english: 'Progress tracking',
        },
        {
            icon: '🏆',
            hindi: 'उपलब्धियां अनलॉक करें',
            english: 'Unlock achievements',
        },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
                {/* Icon */}
                <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                    {reason === 'timer' ? '⏱️' : '🎯'}
                </div>

                {/* Title */}
                <h2 className={`text-2xl md:text-3xl font-bold text-gray-800 mb-3 text-center ${language === 'hindi' ? 'heading-font' : ''}`}>
                    {getTitle()}
                </h2>

                {/* Message */}
                <p className="text-gray-600 mb-6 text-center leading-relaxed">
                    {getMessage()}
                </p>

                {/* Benefits */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 mb-6 border border-orange-100">
                    <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
                        {language === 'hindi' ? 'साइन इन करने पर मिलेगा:' : 'Sign in to get:'}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span className="text-xl">{benefit.icon}</span>
                                <span className="text-sm text-gray-700">
                                    {language === 'hindi' ? benefit.hindi : benefit.english}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sign In Button */}
                <button
                    onClick={handleSignIn}
                    className="w-full py-3 px-6 bg-spiritual-primary text-white rounded-lg hover:bg-spiritual-primary-light transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium mb-3 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className={language === 'hindi' ? 'hindi-text' : ''}>
                        {language === 'hindi' ? 'Google से साइन इन करें' : 'Sign in with Google'}
                    </span>
                </button>

                {/* Dismiss option */}
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="w-full py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                    >
                        {language === 'hindi' ? 'बाद में' : 'Maybe Later'}
                    </button>
                )}
            </div>
        </div>
    );
};
