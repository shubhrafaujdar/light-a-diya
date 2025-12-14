"use client";

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

export interface VerseData {
    shlok_hindi: string[];
    shlok_hinglish: string[];
    shlok_english: string;
    defs: Array<{ def: string; meaning: string }>;
}

interface VerseDisplayProps {
    verseData: VerseData | null;
    isLoading: boolean;
}

export function VerseDisplay({ verseData, isLoading }: VerseDisplayProps) {
    // We can show both languages or switch based on preference. 
    // Typically Gita apps show Sanskrit/Hindi primarily, with toggle for English.
    // The user requirement didn't specify, but looking at "Aarti", it switches.
    // Let's show Hindi/Sanskrit always, and English translation below.

    const { language } = useLanguage();

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4 p-6 bg-white/50 rounded-xl">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                <div className="h-20 bg-gray-200 rounded mt-8"></div>
            </div>
        );
    }

    if (!verseData) return null;

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-10 text-center space-y-8 border border-orange-100">
            {/* Sanskrit / Hindi Shlok */}
            <div className="space-y-2">
                {verseData.shlok_hindi.map((line, idx) => (
                    <p key={idx} className="text-xl md:text-2xl font-bold text-orange-800 font-serif leading-relaxed">
                        {line}
                    </p>
                ))}
            </div>

            {/* Transliteration */}
            <div className="space-y-2 text-gray-600 italic">
                {verseData.shlok_hinglish.map((line, idx) => (
                    <p key={idx} className="text-lg">
                        {line}
                    </p>
                ))}
            </div>

            <div className="h-px bg-orange-200 w-1/2 mx-auto my-6" />

            {/* English Translation */}
            <div className="text-left md:text-center">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {language === 'hindi' ? 'अनुवाद' : 'Translation'}
                </h3>
                <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-medium">
                    {verseData.shlok_english}
                </p>
            </div>

            {/* Word meanings (optional, maybe toggleable) */}
            <details className="text-left mt-8 group">
                <summary className="cursor-pointer text-orange-600 font-medium hover:text-orange-700 list-none flex items-center justify-center gap-2">
                    <span>{language === 'hindi' ? 'शब्दार्थ देखें' : 'View Word Meanings'}</span>
                    <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm bg-orange-50/50 p-4 rounded-lg">
                    {verseData.defs.map((def, idx) => (
                        <div key={idx} className="flex gap-2 border-b border-orange-100/50 pb-1 last:border-0">
                            <span className="font-semibold text-gray-700">{def.def}:</span>
                            <span className="text-gray-600">{def.meaning}</span>
                        </div>
                    ))}
                </div>
            </details>
        </div>
    );
}
