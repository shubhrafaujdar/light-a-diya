import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getDeityById, getAartisByDeityId, getAllDeities } from '@/lib/aarti-data';
import DeityAartisClient from './DeityAartisClient';

interface PageParams {
  deitySlug: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

// Generate static params for all deities
export async function generateStaticParams() {
  const deities = await getAllDeities();
  return deities.map((deity) => ({
    deitySlug: deity.slug,
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { deitySlug } = await params;
  const deity = await getDeityById(deitySlug);

  if (!deity) {
    return {
      title: 'Deity Not Found | Parambhakti.com',
    };
  }

  const deityName = deity.name_english;
  return {
    title: `${deityName} Aartis - Hindu Devotional Prayers | Parambhakti.com`,
    description: `Read and explore sacred aartis and devotional prayers dedicated to ${deityName}. Available in Hindi and English with transliteration.`,
    keywords: [`${deityName} Aarti`, deityName, 'Hinduism', 'Prayer', 'Devotional'],
    openGraph: {
      title: `${deityName} Aartis | Parambhakti.com`,
      description: `Explore sacred aartis and devotional prayers dedicated to ${deityName}.`,
      images: [deity.image_url],
    },
    twitter: {
      card: "summary_large_image",
      title: `${deityName} Aartis | Parambhakti.com`,
      description: `Explore sacred aartis and devotional prayers dedicated to ${deityName}.`,
      images: [deity.image_url],
    },
    alternates: {
      canonical: `https://parambhakti.com/aartis/${deity.slug}`,
    }
  };
}

export default async function DeityAartisPage({ params }: PageProps) {
  const { deitySlug } = await params;

  const deity = await getDeityById(deitySlug);
  if (!deity) {
    notFound();
  }

  // Canonical redirect: If the URL uses UUID, redirect to the canonical slug URL
  if (deitySlug !== deity.slug) {
    redirect(`/aartis/${deity.slug}`);
  }

  const aartis = await getAartisByDeityId(deity.id);

  return <DeityAartisClient deity={deity} aartis={aartis} deitySlug={deitySlug} />;
}