"use client";

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface ChapterNavigationProps {
    currentChapter: number;
    currentVerse: number;
    onChapterChange: (chapter: number) => void;
    onNext: () => void;
    onPrev: () => void;
}

const CHAPTER_VERSE_COUNTS: Record<number, number> = {
    1: 47, 2: 72, 3: 43, 4: 42, 5: 29, 6: 47,
    7: 30, 8: 28, 9: 34, 10: 42, 11: 55, 12: 20,
    13: 35, 14: 27, 15: 20, 16: 24, 17: 28, 18: 78
};

export function ChapterNavigation({
    currentChapter,
    currentVerse,
    onChapterChange,
    onNext,
    onPrev
}: ChapterNavigationProps) {
    const { language } = useLanguage();

    const totalVerses = CHAPTER_VERSE_COUNTS[currentChapter] || 0;

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 p-4 rounded-lg shadow-sm backdrop-blur border border-orange-100">

            {/* Chapter Selection */}
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600">
                    {language === 'hindi' ? 'अध्याय' : 'Chapter'}:
                </label>
                <select
                    value={currentChapter}
                    onChange={(e) => onChapterChange(Number(e.target.value))}
                    className="p-2 rounded border border-orange-200 bg-white focus:ring-2 focus:ring-orange-400 outline-none"
                >
                    {Object.keys(CHAPTER_VERSE_COUNTS).map(num => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-center">
                <button
                    onClick={onPrev}
                    disabled={currentChapter === 1 && currentVerse === 1}
                    className="px-4 py-2 rounded-lg bg-orange-100 text-orange-800 font-medium hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    ← {language === 'hindi' ? 'पिछला' : 'Prev'}
                </button>

                <div className="text-center min-w-[100px]">
                    <span className="text-sm text-gray-500 block uppercase tracking-wider">
                        {language === 'hindi' ? 'श्लोक' : 'Verse'}
                    </span>
                    <span className="text-xl font-bold text-orange-900">
                        {currentVerse} <span className="text-gray-400 text-base font-normal">/ {totalVerses}</span>
                    </span>
                </div>

                <button
                    onClick={onNext}
                    disabled={currentChapter === 18 && currentVerse === 78}
                    className="px-4 py-2 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
                >
                    {language === 'hindi' ? 'अगला' : 'Next'} →
                </button>
            </div>

        </div>
    );
}
