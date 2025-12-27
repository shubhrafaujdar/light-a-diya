import type { Metadata } from 'next';
import ScriptureReader from '@/components/scripture/ScriptureReader';

export const metadata: Metadata = {
    title: 'Shrimad Bhagavad Gita - Parambhakti.com',
    description: 'Read the Shrimad Bhagavad Gita chapter by chapter with meanings and translations.',
};

export default function GitaPage() {
    return (
        <main id="main-content" className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-orange-900 mb-4 font-serif">
                    Shrimad Bhagavad Gita
                </h1>
                <p className="text-lg text-orange-800/80 max-w-2xl mx-auto">
                    Experience the divine wisdom of Lord Krishna. Set your daily reading goals and track your spiritual progress.
                </p>
            </div>

            <ScriptureReader />
        </main>
    );
}
