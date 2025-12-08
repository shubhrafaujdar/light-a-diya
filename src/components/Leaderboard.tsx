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

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setIsLoading(true);
            try {
                const data = await db.getLeaderboard(categoryId, 10);
                setAttempts(data);
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, [categoryId, refreshTrigger]);

    if (isLoading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (attempts.length === 0) {
        return (
            <div className="text-center p-6 text-gray-500 italic">
                {language === 'hindi' ? 'अभी तक कोई रिकॉर्ड नहीं है। पहले बनें!' : 'No records yet. Be the first!'}
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-xl shadow-md border border-orange-100 overflow-hidden">
            <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex justify-between items-center">
                <h3 className={`text-lg font-bold text-orange-800 ${language === 'hindi' ? 'heading-font' : ''}`}>
                    {language === 'hindi' ? 'शीर्ष १० भक्त' : 'Top 10 Devotees'}
                </h3>
                <span className="text-2xl">🏆</span>
            </div>

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
        </div>
    );
};
