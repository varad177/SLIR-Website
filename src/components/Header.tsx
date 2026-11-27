'use client';

import React, { useEffect, useState } from 'react';
import { site } from '@/data/site';
import { SlirPulseMark } from './SlirLogo';

const links = [
  { href: '/#why', label: 'Why SLIR' },
  { href: '/#features', label: 'Capabilities' },
  { href: '/#code', label: 'SDKs' },
  { href: '/#profiler', label: 'Profiler' },
  { href: '/#install', label: 'Deploy' },
  { href: '/#reference', label: 'API & Env' },
  { href: '/#faq', label: 'FAQ' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(doc.scrollTop / max, 1) : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/80 bg-night/85 backdrop-blur-md">
      <div
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-accent"
        style={{ transform: `scaleX(${progress})` }}
      />
      <div className="container-site flex h-14 items-center gap-4">
        <a href="/#top" className="flex shrink-0 items-center gap-2.5" aria-label="SLIR home">
          <SlirPulseMark size={20} />
          <span className="text-[17px] font-extrabold tracking-[0.02em]">SLIR</span>
          <span className="hidden rounded border border-good/30 bg-good/15 px-1.5 py-0.5 font-mono text-[9.5px] font-bold tracking-wide text-good sm:inline">
            SWITCH RUNTIME
          </span>
          <span className="hidden rounded border border-line-strong px-1.5 py-0.5 font-mono text-[10px] text-ink-faint md:inline">
            {site.version}
          </span>
        </a>

        <nav className="ml-2 hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-2.5 py-1.5 text-[13px] font-medium text-ink-dim transition-colors hover:bg-raised/60 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-line-strong text-ink-dim transition-colors hover:text-ink lg:hidden"
          >
            {menuOpen ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>

          <a
            href={site.docker}
            target="_blank"
            rel="noreferrer"
            aria-label="Docker Hub"
            title="Docker Hub — varad177/slir-app"
            className="hidden h-8 w-8 items-center justify-center rounded-md border border-line-strong text-ink-dim transition-colors hover:border-accent/40 hover:text-ink sm:flex"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M22.1 9.6c-.6-.4-1.9-.6-2.9-.4-.1-.9-.6-1.7-1.4-2.4l-.5-.3-.3.5c-.4.6-.5 1.6-.2 2.3.1.3.3.6.5.8-.4.2-1 .4-1.9.4H1.5l-.1.5c-.2 1.4 0 2.8.6 4 .7 1.3 1.8 2.2 3.3 2.7 1.7.6 3.6.7 5.4.4 2.1-.3 3.9-1.1 5.3-2.4.9-.8 1.6-1.8 2.1-2.9 1.4 0 2.3-.1 2.8-.2 1-.2 1.7-.6 2.2-1.2l.2-.3-.5-.5ZM6.2 8.6H3.8v2.3h2.4V8.6Zm3.1 0H6.9v2.3h2.4V8.6Zm3.1 0h-2.4v2.3h2.4V8.6Zm3.1 0h-2.4v2.3h2.4V8.6Zm-9.3-3H6.9v2.3h2.4V5.6Zm3.1 0h-2.4v2.3h2.4V5.6Zm3.1 0h-2.4v2.3h2.4V5.6Zm0-3h-2.4v2.3h2.4V2.6Z" />
            </svg>
          </a>

          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            title="GitHub Repository"
            className="hidden h-8 w-8 items-center justify-center rounded-md border border-line-strong text-ink-dim transition-colors hover:border-accent/40 hover:text-ink sm:flex"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12v3.14c0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </a>

          <a
            href="/#install"
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-[13px] font-semibold text-night transition-colors hover:bg-accent-bright"
          >
            Deploy
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-line bg-night/95 backdrop-blur-md lg:hidden">
          <nav className="container-site grid grid-cols-2 gap-1 py-3" aria-label="Mobile">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 text-[13.5px] font-medium text-ink-dim transition-colors hover:bg-raised/60 hover:text-ink"
              >
                {link.label}
              </a>
            ))}
            <a
              href={site.docker}
              target="_blank"
              rel="noreferrer"
              className="rounded-md px-3 py-2 text-[13.5px] font-medium text-ink-dim transition-colors hover:bg-raised/60 hover:text-ink"
            >
              Docker Hub ↗
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-md px-3 py-2 text-[13.5px] font-medium text-ink-dim transition-colors hover:bg-raised/60 hover:text-ink"
            >
              GitHub ↗
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
