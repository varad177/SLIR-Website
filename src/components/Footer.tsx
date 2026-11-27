import React from 'react';
import { site } from '@/data/site';
import { SlirPulseMark } from './SlirLogo';

const productLinks = [
  { href: '/#why', label: 'Why SLIR' },
  { href: '/#features', label: 'Capabilities' },
  { href: '/#code', label: 'SDK Examples' },
  { href: '/#profiler', label: 'Latency Profiler' },
  { href: '/#install', label: 'Deploy' },
  { href: '/#reference', label: 'API & Env' },
  { href: '/#faq', label: 'FAQ' },
];

const resourceLinks = [
  { href: site.docker, label: 'Docker Hub (slir-app)', external: true },
  { href: site.github, label: 'GitHub Repository', external: true },
  { href: `${site.github}/issues`, label: 'Issue Tracker', external: true },
  { href: site.license, label: 'MIT License', external: true },
  { href: '/llms.txt', label: 'llms.txt', external: false },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line/60 py-12">
      <div className="container-site">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <a href="/#top" className="flex items-center gap-2.5" aria-label="SLIR home">
              <SlirPulseMark size={20} />
              <span className="text-[17px] font-extrabold tracking-[0.02em]">SLIR</span>
              <span className="rounded border border-good/30 bg-good/15 px-1.5 py-0.5 font-mono text-[9.5px] font-bold text-good">
                SWITCH RUNTIME
              </span>
              <span className="rounded border border-line-strong px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
                {site.version}
              </span>
            </a>
            <p className="mt-3 max-w-xs text-[12.5px] leading-relaxed text-ink-dim">
              Switch LLM In Runtime — self-hosted AI gateway and model monitor for developers. One
              endpoint, any local or cloud model, full latency &amp; failover visibility.
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
              Built for developers building local &amp; on-prem AI systems.
            </p>
          </div>

          <nav aria-label="Product">
            <h3 className="label-mono">Product</h3>
            <ul className="mt-3 space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-[12.5px] text-ink-dim transition-colors hover:text-ink">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h3 className="label-mono">Resources</h3>
            <ul className="mt-3 space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noreferrer' : undefined}
                    className="text-[12.5px] text-ink-dim transition-colors hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-line/60 pt-6 text-[11px] text-ink-faint sm:flex-row">
          <p>© {year} Varad Dhumale · SLIR ({site.fullName}) {site.version}</p>
          <p className="font-mono">Prompts never touch SQLite.</p>
        </div>
      </div>
    </footer>
  );
}
