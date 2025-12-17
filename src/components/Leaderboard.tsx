"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/database';
import { QuizAttempt } from '@/lib/database';
import { useLanguage } from '@/context/LanguageContext';

interface LeaderboardProps {
    categoryId: string;
    currentAttemptId?: string;
    refreshTrigger?: number; // Simple way to trigger re-fetch
}


export const Leaderboard: React.FC<LeaderboardProps> = ({
    categoryId,
    currentAttemptId,
    refreshTrigger = 0
}) => {
    const { language } = useLanguage();
    const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('all-time');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setIsLoading(true);
            try {
                const data = await db.getLeaderboard(categoryId, 10, timeframe);
                setAttempts(data);
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, [categoryId, refreshTrigger, timeframe]);

    const tabs = [
        { id: 'daily', label: { hindi: 'आज', english: 'Today' } },
        { id: 'weekly', label: { hindi: 'इस सप्ताह', english: 'This Week' } },
        { id: 'monthly', label: { hindi: 'इस महीने', english: 'This Month' } },
        { id: 'all-time', label: { hindi: 'सभी समय', english: 'All Time' } },
    ] as const;

    return (
        <div className="w-full bg-white rounded-xl shadow-md border border-orange-100 overflow-hidden">
            <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h3 className={`text-lg font-bold text-orange-800 ${language === 'hindi' ? 'heading-font' : ''}`}>
                        {language === 'hindi' ? 'शीर्ष १० भक्त' : 'Top 10 Devotees'}
                    </h3>
                    <span className="text-2xl">🏆</span>
                </div>

                {/* Timeframe Tabs */}
                <div className="flex p-1 bg-orange-100/50 rounded-lg overflow-x-auto gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setTimeframe(tab.id)}
                            className={`
                                flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap
                                ${timeframe === tab.id
                                    ? 'bg-white text-orange-600 shadow-sm'
                                    : 'text-gray-500 hover:text-orange-600 hover:bg-white/50'}
                            `}
                        >
                            {language === 'hindi' ? tab.label.hindi : tab.label.english}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="w-full h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
            ) : attempts.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                    <p className="mb-2 text-xl">📭</p>
                    <p>{language === 'hindi' ? 'इस समय अवधि में कोई रिकॉर्ड नहीं है।' : 'No records for this time period.'}</p>
                    <p className="text-sm mt-1 text-orange-600 font-medium">
                        {language === 'hindi' ? 'पहले बनें!' : 'Be the first!'}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-orange-50/50 text-gray-600 text-sm font-medium">
                            <tr>
                                <th className="px-4 py-3 text-center">#</th>
                                <th className="px-4 py-3">{language === 'hindi' ? 'नाम' : 'Name'}</th>
                                <th className="px-4 py-3 text-center">{language === 'hindi' ? 'स्कोर' : 'Score'}</th>
                                <th className="px-4 py-3 text-right">{language === 'hindi' ? 'समय' : 'Time'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-orange-50">
                            {attempts.map((attempt, index) => {
                                const isCurrentUser = currentAttemptId === attempt.id;
                                const rank = index + 1;

                                return (
                                    <tr
                                        key={attempt.id}
                                        className={`
                                            transition-colors
                                            ${isCurrentUser ? 'bg-orange-100 font-medium' : 'hover:bg-gray-50'}
                                        `}
                                    >
                                        <td className="px-4 py-3 text-center text-gray-500 w-12">
                                            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                                        </td>
                                        <td className="px-4 py-3 text-gray-800">
                                            {attempt.user_name}
                                            {isCurrentUser && (
                                                <span className="ml-2 text-xs bg-orange-200 text-orange-800 px-1.5 py-0.5 rounded">
                                                    {language === 'hindi' ? 'आप' : 'You'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-700">
                                            <span className="font-bold text-orange-700">{attempt.score}</span>
                                            <span className="text-gray-400 text-xs ml-1">/{attempt.total_questions}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-600 font-mono text-sm">
                                            {Math.floor(attempt.time_taken_seconds / 60)}m {attempt.time_taken_seconds % 60}s
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

