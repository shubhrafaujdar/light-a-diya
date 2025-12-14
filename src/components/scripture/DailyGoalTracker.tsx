"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface DailyGoalTrackerProps {
    goal: number;
    completed: number;
    isAuthenticated: boolean;
    onGoalChange: (newGoal: number) => void;
    onSignInClick: () => void;
}

export function DailyGoalTracker({
    goal,
    completed,
    isAuthenticated,
    onGoalChange,
    onSignInClick
}: DailyGoalTrackerProps) {
    const { language } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);

    const percentage = Math.min(100, Math.round((completed / goal) * 100));
    const isGoalMet = completed >= goal;

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        {language === 'hindi' ? 'दैनिक लक्ष्य' : 'Daily Goal'}
                        {isGoalMet && (
                            <span className="text-green-500 bg-green-50 p-1 rounded-full">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                        )}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {isGoalMet
                            ? (language === 'hindi' ? 'अद्भुत! आपने अपना लक्ष्य पूरा कर लिया।' : 'Amazing! You reached your goal.')
                            : (language === 'hindi' ? 'अपनी आध्यात्मिक यात्रा जारी रखें' : 'Keep up your spiritual journey')
                        }
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <select
                                value={goal}
                                onChange={(e) => {
                                    onGoalChange(Number(e.target.value));
                                    setIsEditing(false);
                                }}
                                className="p-1 rounded border border-gray-300 text-sm"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                    <option key={n} value={n}>{n} {language === 'hindi' ? 'श्लोक' : 'Verses'}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-sm text-orange-600 font-medium hover:text-orange-700 underline decoration-dotted"
                        >
                            {language === 'hindi' ? 'लक्ष्य बदलें' : 'Change Goal'}: {goal}
                        </button>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${isGoalMet ? 'bg-green-500' : 'bg-orange-500'}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-600">
                    {completed} {language === 'hindi' ? 'पूरा हुआ' : 'Completed'}
                </span>
                <span className="text-gray-400">
                    {goal} {language === 'hindi' ? 'लक्ष्य' : 'Target'}
                </span>
            </div>

            {!isAuthenticated && completed > 0 && (
                <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-md flex justify-between items-center mt-2 animate-in fade-in slide-in-from-bottom-2">
                    <span>
                        {language === 'hindi'
                            ? 'अपनी प्रगति को सुरक्षित करने के लिए साइन इन करें।'
                            : 'Sign in to save your daily streak forever.'}
                    </span>
                    <button
                        onClick={onSignInClick}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition"
                    >
                        {language === 'hindi' ? 'साइन इन' : 'Sign In'}
                    </button>
                </div>
            )}
        </div>
    );
}
