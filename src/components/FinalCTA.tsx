import React from 'react';
import { site } from '@/data/site';
import { CopyButton } from './CopyButton';

const ctaCmd = `docker run -d --name slir -p 4100:4101 -p 4101:4101 --add-host=host.docker.internal:host-gateway -v slir_data:/app/data ${site.dockerImage}`;

export function FinalCTA() {
  return (
    <section className="section">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-2xl border border-line-strong bg-surface px-6 py-14 text-center md:px-12 md:py-16">
          <div className="bg-blueprint absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="hero-glow absolute inset-0" aria-hidden="true" />

          <div className="relative">
            <p className="eyebrow justify-center">Ready when you are</p>
            <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-[2.75rem] md:leading-[1.08]">
              Your stack. Your models. Your telemetry.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-dim">
              One container. No account. No prompts leaving your network. Run SLIR in seconds and
              point your OpenAI or Anthropic client at port{' '}
              <code className="font-mono text-ink">4101</code>.
            </p>

            <div className="mx-auto mt-8 max-w-xl overflow-hidden rounded-lg border border-line-strong bg-night/70 text-left">
              <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">terminal</span>
                <CopyButton text={ctaCmd} />
              </div>
              <pre className="overflow-x-auto px-4 py-3 font-mono text-[11.5px] leading-relaxed">
                <span className="select-none text-ink-faint">$ </span>
                <span className="text-ink">{ctaCmd}</span>
              </pre>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href={site.docker} target="_blank" rel="noreferrer" className="btn-primary">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22.1 9.6c-.6-.4-1.9-.6-2.9-.4-.1-.9-.6-1.7-1.4-2.4l-.5-.3-.3.5c-.4.6-.5 1.6-.2 2.3.1.3.3.6.5.8-.4.2-1 .4-1.9.4H1.5l-.1.5c-.2 1.4 0 2.8.6 4 .7 1.3 1.8 2.2 3.3 2.7 1.7.6 3.6.7 5.4.4 2.1-.3 3.9-1.1 5.3-2.4.9-.8 1.6-1.8 2.1-2.9 1.4 0 2.3-.1 2.8-.2 1-.2 1.7-.6 2.2-1.2l.2-.3-.5-.5ZM6.2 8.6H3.8v2.3h2.4V8.6Zm3.1 0H6.9v2.3h2.4V8.6Zm3.1 0h-2.4v2.3h2.4V8.6Zm3.1 0h-2.4v2.3h2.4V8.6Zm-9.3-3H6.9v2.3h2.4V5.6Zm3.1 0h-2.4v2.3h2.4V5.6Zm3.1 0h-2.4v2.3h2.4V5.6Zm0-3h-2.4v2.3h2.4V2.6Z" />
                </svg>
                Docker Hub
              </a>
              <a href={site.github} target="_blank" rel="noreferrer" className="btn-ghost">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12v3.14c0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
                View source
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
