import type { Metadata } from "next";

export const siteConfig = {
  name: "Sandarbh",
  fullName: "Sandarbh Nepal",
  description:
    "Nepal's premium education platform — Notes, books, question banks, past papers, mock tests and resources for Class 8–12 (SEE), CTEVT, Bachelor & Master across TU, KU, PU, Pokhara University and more.",
  url: "https://sandarbh.edu.np",
  keywords: [
    "Nepal education",
    "SEE question bank",
    "Class 10 notes",
    "Class 11 notes",
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
    title: "Sandarbh — Nepal's Education Platform",
    description:
      "Everything you need to ace SEE, +2, CTEVT, Bachelor & Master. Notes, books, question banks, past papers & mock tests.",
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
