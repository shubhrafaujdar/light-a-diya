import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Bhagavad Gita - Sacred Wisdom & Daily Shlokas | Parambhakti.com",
    description: "Read and reflect on the divine teachings of the Bhagavad Gita. Access daily shlokas, translations, and insights to guide your spiritual journey.",
    keywords: ["Bhagavad Gita", "Gita Shlokas", "Krishna", "Spiritual Wisdom", "Hindu Scriptures"],
    openGraph: {
        title: "Bhagavad Gita - Sacred Wisdom | Parambhakti.com",
        description: "Access divine teachings of the Bhagavad Gita and daily shlokas.",
        url: "https://parambhakti.com/gita",
    },
};

export default function GitaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
