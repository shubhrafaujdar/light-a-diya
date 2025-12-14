import { Deity, Aarti } from '@/types/database';
import deitiesData from '@/data/deities.json';
import aartisData from '@/data/aartis.json';

// Constants for dates to satisfy the type definition
const STATIC_DATE = new Date('2024-01-01').toISOString();

/**
 * Returns all deities from the local JSON data
 */
export async function getAllDeities(): Promise<Deity[]> {
    // Simulate network delay if needed, but for now return immediately
    // console.log(`[Data] Returning ${deitiesData.length} deities`);
    return deitiesData.map(deity => ({
        ...deity,
        created_at: STATIC_DATE,
        updated_at: STATIC_DATE
    }));
}

/**
 * Returns a specific deity by ID or Slug
 */
export async function getDeityById(idOrSlug: string): Promise<Deity | null> {
    const deity = deitiesData.find(d => d.id === idOrSlug || d.slug === idOrSlug);
    if (!deity) return null;

    return {
        ...deity,
        created_at: STATIC_DATE,
        updated_at: STATIC_DATE
    };
}

/**
 * Returns all aartis
 */
export async function getAllAartis(): Promise<Aarti[]> {
    return aartisData.map(aarti => ({
        ...aarti,
        audio_url: undefined,
        created_at: STATIC_DATE,
        updated_at: STATIC_DATE
    }));
}

/**
 * Returns all aartis for a specific deity
 */
export async function getAartisByDeityId(deityIdOrSlug: string): Promise<Aarti[]> {
    // resolve deity first to get the ID
    const deity = deitiesData.find(d => d.id === deityIdOrSlug || d.slug === deityIdOrSlug);

    if (!deity) return [];

    const aartis = aartisData.filter(a => a.deity_id === deity.id);

    return aartis.map(aarti => ({
        ...aarti,
        audio_url: undefined, // Add if present in JSON or leave undefined
        created_at: STATIC_DATE,
        updated_at: STATIC_DATE
    }));
}

/**
 * Returns a specific aarti by ID or Slug
 */
export async function getAartiById(idOrSlug: string): Promise<Aarti | null> {
    const aarti = aartisData.find(a => a.id === idOrSlug || a.slug === idOrSlug);
    if (!aarti) return null;

    return {
        ...aarti,
        audio_url: undefined,
        created_at: STATIC_DATE,
        updated_at: STATIC_DATE
    };
}
