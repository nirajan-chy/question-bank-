import type { Metadata } from "next";

export const siteConfig = {
  name: "PrashnaHub",
  fullName: "PrashnaHub",
  description:
    "Nepal's premium education platform — Notes, books, question banks, past papers, mock tests and resources for NEB Class 12, CTEVT, Bachelor & Master across TU, KU, PU, Pokhara University and more.",
  url: "https://prashnahub.com",
  keywords: [
    "Nepal education",
    "NEB Class 12",
    "Class 12 notes",
    "CTEVT",
    "Tribhuvan University",
    "Kathmandu University",
    "Pokhara University",
    "Purbanchal University",
    "mock test Nepal",
    "past papers",
    "scholarships Nepal",
  ],
  og: {
    title: "PrashnaHub — Nepal's Education Platform",
    description:
      "Everything you need to ace NEB, CTEVT, Bachelor & Master. Notes, books, question banks, past papers & mock tests.",
  },
};

type SeoArgs = {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
};

export function seo({
  title,
  description,
  path = "/",
  ogImage = "/og.png",
  noIndex,
}: SeoArgs = {}): Metadata {
  const finalTitle = title
    ? `${title} · ${siteConfig.name}`
    : siteConfig.name;

  return {
    title: finalTitle,
    description: description ?? siteConfig.description,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: `${siteConfig.url}${path}` },
    keywords: siteConfig.keywords,
    openGraph: {
      title: finalTitle,
      description: description ?? siteConfig.description,
      url: `${siteConfig.url}${path}`,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: finalTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: description ?? siteConfig.description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    },
  };
}
