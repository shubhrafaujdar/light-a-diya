'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import AartiDisplay from '@/components/AartiDisplay';
import { Aarti, Deity } from '@/types/database';

interface AartiClientWrapperProps {
    aarti: Aarti;
    deity: Deity;
}

export default function AartiClientWrapper({ aarti, deity }: AartiClientWrapperProps) {
    const { language } = useLanguage();
    const deityName = language === 'hindi' ? deity.name_hindi : deity.name_english;

    return (
        <>
            {/* Breadcrumb Navigation */}
            <nav className="bg-white shadow-sm border-b" aria-label="Breadcrumb">
                <div className="container mx-auto px-4 py-4">
                    <ol className="flex items-center space-x-2 text-sm">
                        <li>
                            <Link
                                href="/aartis"
                                className="text-spiritual-primary hover:text-spiritual-primary-light spiritual-transition"
                            >
                                {language === 'hindi' ? 'आरती संग्रह' : 'Aarti Collection'}
                            </Link>
                        </li>
                        <li aria-hidden="true">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </li>
                        <li>
                            <Link
                                href={`/aartis/${deity.slug}`}
                                className={`text-spiritual-primary hover:text-spiritual-primary-light spiritual-transition ${language === 'hindi' ? 'devanagari' : ''
                                    }`}
                            >
                                {deityName}
                            </Link>
                        </li>
                        <li aria-hidden="true">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </li>
                        <li>
                            <span className={`text-gray-600 ${language === 'hindi' ? 'devanagari' : ''}`} aria-current="page">
                                {language === 'hindi' ? aarti.title_hindi : aarti.title_english}
                            </span>
                        </li>
                    </ol>
                </div>
            </nav>

            {/* Aarti Display Component */}
            <AartiDisplay aarti={aarti} deity={deity} />
        </>
    );
}
