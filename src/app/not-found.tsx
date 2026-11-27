import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: '404 — Page not found',
  description: 'The requested page does not exist on SLIR.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="relative overflow-hidden pb-24 pt-28">
        <div className="bg-blueprint absolute inset-0" aria-hidden="true" />
        <div className="hero-glow absolute inset-x-0 top-0 h-[420px]" aria-hidden="true" />

        <div className="container-site relative">
          <div className="mx-auto max-w-xl rounded-xl border border-line-strong bg-surface p-8 text-center shadow-2xl shadow-black/40">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">HTTP 404</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Route not found
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-dim">
              That URL is not routed on{' '}
              <span className="font-mono text-ink">{site.domain.replace('https://', '')}</span>.
              Head back to the landing page or view the source on GitHub.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/" className="btn-primary">
                Back to SLIR home
              </Link>
              <a href={site.github} target="_blank" rel="noreferrer" className="btn-ghost">
                View source on GitHub
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
