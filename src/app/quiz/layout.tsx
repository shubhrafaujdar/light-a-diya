import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Spiritual Quizzes - Test Your Knowledge | Parambhakti.com",
    description: "Challenge yourself with quizzes on Hindu ancient texts, culture, and traditions. Learn more about Sanatan Dharma through interactive quizzes.",
    keywords: ["Hindu Quiz", "Spiritual Quiz", "Gita Quiz", "Ramayana Quiz", "Dharma Knowledge"],
    openGraph: {
        title: "Spiritual Quizzes | Parambhakti.com",
        description: "Test your knowledge about Hindu ancient texts and culture.",
        url: "https://parambhakti.com/quiz",
    },
};

export default function QuizLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
