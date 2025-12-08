
import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/database';
import { Leaderboard } from '@/components/Leaderboard';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{
        categoryId: string;
    }>;
}

export default async function QuizLeaderboardPage({ params }: Props) {
    const { categoryId } = await params;
    const category = await db.getQuizCategoryById(categoryId);

    if (!category) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 bg-gradient-to-br from-orange-50 via-white to-blue-50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4 text-3xl">
                        {category.icon || '🏆'}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        {category.name_english} Leaderboard
                    </h1>
                    <p className="text-lg text-gray-600">
                        Top devotees who have mastered this knowledge
                    </p>
                </div>

                {/* Leaderboard Component */}
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <Leaderboard categoryId={categoryId} />
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-4">
                    <Link
                        href={`/quiz/${categoryId}`}
                        className="px-8 py-3 bg-spiritual-primary text-white font-medium rounded-lg hover:bg-spiritual-primary-dark transition-colors shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Play Quiz
                    </Link>
                    <Link
                        href="/quiz"
                        className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Back to Categories
                    </Link>
                </div>
            </div>
        </main>
    );
}
