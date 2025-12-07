"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
// import { analytics } from '@/lib/analytics'; // TODO: Re-enable when Turbopack cache clears

interface QuizTimerProps {
    categoryName: string;
    remainingSeconds: number;
    onTimerExpire: () => void;
    onStopTimer: () => void;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({
    categoryName,
    remainingSeconds,
    onTimerExpire,
    onStopTimer,
}) => {
    const { language } = useLanguage();
    const [hasTrackedStart, setHasTrackedStart] = useState(false);

    // Track timer start (once)
    // TODO: Re-enable once Turbopack cache clears
    // useEffect(() => {
    //     if (!hasTrackedStart && analytics?.startTimer) {
    //         analytics.startTimer(categoryName);
    //         setHasTrackedStart(true);
    //     }
    // }, [hasTrackedStart, categoryName]);

    // Check for timer expiration
    useEffect(() => {
        if (remainingSeconds <= 0) {
            onTimerExpire();
        }
    }, [remainingSeconds, onTimerExpire]);

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const progressPercentage = (remainingSeconds / 120) * 100;

    // Color coding based on time remaining
    const getTimerColor = () => {
        if (remainingSeconds > 60) return 'text-green-600';
        if (remainingSeconds > 30) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getProgressColor = () => {
        if (remainingSeconds > 60) return 'bg-green-500';
        if (remainingSeconds > 30) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const handleStopTimer = () => {
        // TODO: Re-enable once Turbopack cache clears
        // if (analytics?.stopTimer) {
        //   analytics.stopTimer(categoryName, remainingSeconds);
        // }
        onStopTimer();
    };

    return (
        <div className="flex items-center gap-3 bg-orange-50/50 px-3 py-1.5 rounded-full border border-orange-100">
            <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${remainingSeconds < 30 ? 'bg-red-400' : 'bg-green-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${remainingSeconds < 30 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                </span>
                <span className={`font-mono font-bold text-sm ${getTimerColor()} tabular-nums`}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
            </div>

            <div className="w-px h-4 bg-orange-200"></div>

            <button
                onClick={handleStopTimer}
                className="text-xs text-orange-600 hover:text-orange-800 font-medium hover:underline transition-colors"
                title={language === 'hindi' ? 'टाइमर रोकें' : 'Stop Timer'}
            >
                {language === 'hindi' ? 'रोकें' : 'Stop'}
            </button>
        </div>
    );
};
