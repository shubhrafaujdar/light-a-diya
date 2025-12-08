
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { QuizCategory } from '@/types/database';

export default function QuizCategoriesPage() {
    const { language } = useLanguage();
    const [categories, setCategories] = useState<QuizCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch('/api/quiz/categories');
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch categories');
                }

                if (data.data) {
                    setCategories(data.data);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        }

        fetchCategories();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
                <div className="text-center p-8 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-spiritual-primary hover:underline"
                    >
                        {language === 'hindi' ? 'पुनः प्रयास करें' : 'Try Again'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50/50 to-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className={`text-3xl md:text-4xl font-bold text-spiritual-primary mb-4 ${language === 'hindi' ? 'heading-font' : ''}`}>
                        {language === 'hindi' ? 'आध्यात्मिक प्रश्नोत्तरी' : 'Spiritual Quizzes'}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {language === 'hindi'
                            ? 'हमारे प्राचीन ग्रंथों और संस्कृति के बारे में अपने ज्ञान का परीक्षण करें।'
                            : 'Test your knowledge about our ancient texts and culture.'}
                    </p>
                </div>

                {categories.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">
                            {language === 'hindi' ? 'कोई क्विज़ उपलब्ध नहीं है।' : 'No quizzes available at the moment.'}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-6">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="w-full max-w-sm md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-orange-100 overflow-hidden transform hover:-translate-y-1"
                            >
                                {/* Main Click Area (Stretched Link) */}
                                <Link
                                    href={`/quiz/${category.id}`}
                                    className="absolute inset-0 z-0"
                                    aria-label={`${category.name_english} - Start Quiz`}
                                />

                                <div className="p-6 relative z-1 pointer-events-none">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-4xl">{category.icon || '🕉️'}</span>
                                        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-orange-200">
                                            {category.question_count} {language === 'hindi' ? 'प्रश्न' : 'Questions'}
                                        </span>
                                    </div>

                                    <h3 className={`text-xl font-bold text-gray-800 mb-2 group-hover:text-spiritual-primary transition-colors ${language === 'hindi' ? 'heading-font' : ''}`}>
                                        {language === 'hindi' ? category.name_hindi : category.name_english}
                                    </h3>

                                    <p className="text-gray-600 line-clamp-2 text-sm mb-4">
                                        {language === 'hindi'
                                            ? (category.description_hindi || '')
                                            : (category.description_english || '')}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-spiritual-primary text-sm font-medium group-hover:text-spiritual-primary-light transition-colors">
                                            <span>
                                                {language === 'hindi' ? 'क्विज़ शुरू करें' : 'Start Quiz'}
                                            </span>
                                            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>

                                        <Link
                                            href={`/quiz/${category.id}/leaderboard`}
                                            className="p-2 text-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors relative z-20 pointer-events-auto"
                                            title={language === 'hindi' ? 'लीडरबोर्ड देखें' : 'View Leaderboard'}
                                        >
                                            <span className="text-xl">🏆</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
