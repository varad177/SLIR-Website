import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { site } from '@/data/site';
import './globals.css';

const pageTitle = 'SLIR — Self-Hosted AI Gateway, Runtime LLM Switcher & Monitor';
const pageDescription =
  'SLIR (Switch LLM In Runtime) is a self-hosted AI gateway and model monitor for developers. Point apps to one OpenAI & Anthropic compatible URL, hot-swap Ollama, LM Studio, vLLM and cloud LLMs without restarts, profile latency, and inspect automatic failover traces.';

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: pageTitle,
    template: '%s | SLIR',
  },
  description: pageDescription,
  keywords: [...site.keywords],
  authors: [{ name: site.author, url: site.github }],
  creator: site.author,
  publisher: site.author,
  applicationName: site.name,
  category: 'Developer Tools',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: site.domain,
    siteName: `${site.name} — ${site.fullName}`,
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'SLIR — Self-hosted AI gateway and runtime LLM switcher preview card',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#090b10',
  colorScheme: 'dark',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${site.domain}/#website`,
      name: `${site.name} — ${site.fullName}`,
      alternateName: site.name,
      url: site.domain,
      description: site.description,
      inLanguage: 'en-US',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${site.domain}/#software`,
      name: site.name,
      alternateName: site.fullName,
      applicationCategory: 'DeveloperApplication',
      applicationSubCategory: 'AI Gateway & Model Observability',
      operatingSystem: 'Docker, Linux, macOS, Windows',
      softwareVersion: site.version.replace(/^v/, ''),
      description: pageDescription,
      url: site.domain,
      downloadUrl: site.docker,
      installUrl: `${site.domain}/#install`,
      codeRepository: site.github,
      license: site.license,
      isAccessibleForFree: true,
      sameAs: [site.github, site.docker],
      featureList: [
        '1-click runtime LLM model switching via active-model alias',
        'OpenAI /v1/chat/completions & native Anthropic /v1/messages translation',
        'Per-request latency X-ray (model load VRAM, TTFT prompt eval, tokens/sec)',
        'Automatic per-application failover chains with detailed error traces',
        'Token & spend attribution via mp_live_ virtual keys',
        'Daily/monthly budgets, hard block enforcement, and webhook alerts',
        'Streaming playground, Prometheus metrics, and SQLite WAL zero-prompt telemetry',
      ],
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      author: {
        '@type': 'Person',
        name: site.author,
        url: site.github,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_ID;

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        {umamiSrc && umamiId && (
          <Script src={umamiSrc} data-website-id={umamiId} strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
