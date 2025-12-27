import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Aarti Sangrah - Hindu Prayer Collection | Parambhakti.com",
    description: "Explore our collection of sacred Hindu aartis, prayers, and devotional songs for various deities. Available in Hindi and English.",
    keywords: ["Aarti", "Hindi Prayers", "Devotional Songs", "Hinduism", "Bhajans", "Spiritual"],
    openGraph: {
        title: "Aarti Sangrah - Hindu Prayer Collection | Parambhakti.com",
        description: "Explore our collection of sacred Hindu aartis, prayers, and devotional songs.",
        url: "https://parambhakti.com/aartis",
        images: ["/images/og-image.png"],
    },
    twitter: {
        title: "Aarti Sangrah - Hindu Prayer Collection | Parambhakti.com",
        description: "Explore our collection of sacred Hindu aartis, prayers, and devotional songs.",
    },
};

export default function AartisLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
