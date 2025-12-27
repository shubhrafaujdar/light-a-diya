import { MetadataRoute } from 'next';
import { getAllDeities, getAllAartis } from '@/lib/aarti-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://parambhakti.com';

    // Static routes
    const routes = [
        '',
        '/aartis',
        '/quiz',
        '/gita',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Deity routes
    const deities = await getAllDeities();
    const deityRoutes = deities.map((deity) => ({
        url: `${baseUrl}/aartis/${deity.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Aarti routes
    const aartis = await getAllAartis();
    // We need deities to get the deity slug for the aarti URL
    const deitiesMap = new Map(deities.map(d => [d.id, d.slug]));

    const aartiRoutes = aartis.map((aarti) => {
        const deitySlug = deitiesMap.get(aarti.deity_id) || aarti.deity_id;
        return {
            url: `${baseUrl}/aartis/${deitySlug}/${aarti.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        };
    });

    return [...routes, ...deityRoutes, ...aartiRoutes];
}
