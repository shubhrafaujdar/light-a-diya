import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getAartiById, getDeityById, getAllAartis } from '@/lib/aarti-data';
import AartiClientWrapper from './AartiClientWrapper';

// Define the params interface to match Next.js requirements exactly
interface PageParams {
  deitySlug: string;
  aartiSlug: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

// Generate static params for all aartis
export async function generateStaticParams() {
  const aartis = await getAllAartis();
  const deities = await Promise.all(aartis.map(a => getDeityById(a.deity_id)));

  return aartis.map((aarti, index) => {
    const deity = deities[index];
    return {
      deitySlug: deity?.slug || aarti.deity_id, // Fallback to ID if slug missing (shouldn't happen)
      aartiSlug: aarti.slug,
    };
  });
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { aartiSlug, deitySlug } = await params;
  const aarti = await getAartiById(aartiSlug);
  const deity = await getDeityById(deitySlug);

  if (!aarti || !deity || aarti.deity_id !== deity.id) {
    return {
      title: 'Aarti Not Found | Parambhakti.com',
    };
  }

  const title = `${aarti.title_english} - ${deity.name_english} | Aartis`;
  const description = `Read and explore ${aarti.title_english} for ${deity.name_english}. Available in Hindi and English with full transliteration and meanings.`;

  return {
    title,
    description,
    keywords: [`${aarti.title_english}`, `${deity.name_english} Aarti`, 'Hindu Prayers', 'Spiritual Content', 'Sanatan Dharma'],
    openGraph: {
      title,
      description,
      url: `https://parambhakti.com/aartis/${deity.slug}/${aarti.slug}`,
      siteName: "Parambhakti.com",
      images: [
        {
          url: deity.image_url,
          width: 800,
          height: 800,
          alt: `${aarti.title_english} for ${deity.name_english}`,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [deity.image_url],
    },
    alternates: {
      canonical: `https://parambhakti.com/aartis/${deity.slug}/${aarti.slug}`,
    }
  };
}

export default async function IndividualAartiPage({ params }: PageProps) {
  const { aartiSlug, deitySlug } = await params;

  const aarti = await getAartiById(aartiSlug);

  if (!aarti) {
    notFound();
  }

  const deity = await getDeityById(deitySlug);

  if (!deity) {
    notFound();
  }

  // Verify deity match
  if (aarti.deity_id !== deity.id) {
    // Redirect to the correct URL if deity doesn't match
    redirect(`/aartis/${deity.slug}/${aarti.slug}`);
  }

  // Canonical redirect: If the URL uses UUIDs or incorrect slugs, redirect to the canonical slug URL
  if (deitySlug !== deity.slug || aartiSlug !== aarti.slug) {
    redirect(`/aartis/${deity.slug}/${aarti.slug}`);
  }

  // Structured Data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    name: aarti.title_english,
    headline: `${aarti.title_english} - ${deity.name_english}`,
    description: `Sacred aarti for ${deity.name_english}`,
    image: deity.image_url,
    author: {
      '@type': 'Organization',
      name: 'Parambhakti.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Parambhakti.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://parambhakti.com/images/logo.png', // Assuming a logo exists
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://parambhakti.com/aartis/${deity.slug}/${aarti.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AartiClientWrapper aarti={aarti} deity={deity} />
    </>
  );
}