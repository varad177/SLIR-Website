import React from 'react';
import { site } from '@/data/site';
import { CopyButton } from './CopyButton';

const dockerRunCmd =
  'docker run -d --name slir -p 4100:4101 -p 4101:4101 --add-host=host.docker.internal:host-gateway -e OLLAMA_URL=http://host.docker.internal:11434 -v slir_data:/app/data varad177/slir-app:latest';

const composeCmd = `git clone ${site.github}.git && cd SLIR\ndocker compose up -d`;

const specs = [
  { label: 'Dashboard UI', value: 'http://localhost:4100' },
  { label: 'AI Gateway', value: 'http://localhost:4101/v1' },
  { label: 'Docker Image', value: site.dockerImage },
  { label: 'SQLite Volume', value: 'ai_monitor_sqlite_data' },
];

export function Install() {
  return (
    <section id="install" className="section scroll-mt-20">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">05 — Deploy</p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-[2.6rem] md:leading-[1.1]">
            Running in under a minute.
          </h2>
          <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ink-dim">
            Zero-config single container serving both the React UI and Express gateway. No account,
            no database container, and no <code className="font-mono text-ink">.env</code> file
            required.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <span className="chip-neutral">Docker 24+</span>
            <span className="chip-neutral">amd64 &amp; arm64 multi-arch</span>
            <span className="chip-neutral">Node 22+ for source builds</span>
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <article className="card relative flex flex-col border-accent/35 p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-ink-faint">01</span>
              <span className="chip border-accent/30 bg-accent/10 text-accent">fastest</span>
            </div>
            <h3 className="mt-3 text-[15px] font-bold">Single Docker container</h3>
            <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-ink-dim">
              Run the unified image anywhere without cloning the repository. Reaches host Ollama
              on port <code className="font-mono text-ink">11434</code> out of the box.
            </p>
            <div className="mt-4 overflow-hidden rounded-lg border border-line bg-night/50">
              <div className="flex items-center justify-between border-b border-line/70 px-3 py-1.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">shell</span>
                <CopyButton text={dockerRunCmd} />
              </div>
              <pre className="overflow-x-auto px-3 py-2.5 font-mono text-[11px] leading-relaxed">
                <span className="select-none text-ink-faint">$ </span>
                <span className="text-ink">docker run -d --name slir \</span>
                {'\n'}
                <span className="text-ink">  -p 4100:4101 -p 4101:4101 \</span>
                {'\n'}
                <span className="text-ink">  --add-host=host.docker.internal:host-gateway \</span>
                {'\n'}
                <span className="text-ink">  -e OLLAMA_URL=http://host.docker.internal:11434 \</span>
                {'\n'}
                <span className="text-ink">  -v slir_data:/app/data {site.dockerImage}</span>
              </pre>
            </div>
            <div className="mt-3 text-[11px]">
              <a href={site.docker} target="_blank" rel="noreferrer" className="text-accent hover:text-accent-bright">
                varad177/slir-app on Docker Hub →
              </a>
            </div>
          </article>

          <article className="card flex flex-col p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-ink-faint">02</span>
              <span className="chip-neutral">compose</span>
            </div>
            <h3 className="mt-3 text-[15px] font-bold">Docker Compose</h3>
            <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-ink-dim">
              Includes persistent SQLite volume, healthcheck, log rotation, and optional{' '}
              <code className="font-mono text-ink">SLIR_PUBLIC_BASE_URL</code> / port overrides.
            </p>
            <div className="mt-4 overflow-hidden rounded-lg border border-line bg-night/50">
              <div className="flex items-center justify-between border-b border-line/70 px-3 py-1.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">shell</span>
                <CopyButton text={composeCmd} />
              </div>
              <pre className="overflow-x-auto px-3 py-2.5 font-mono text-[11px] leading-relaxed">
                <span className="select-none text-ink-faint">$ </span>
                <span className="text-ink">git clone {site.github}.git &amp;&amp; cd SLIR</span>
                {'\n'}
                <span className="select-none text-ink-faint">$ </span>
                <span className="text-ink">docker compose up -d</span>
              </pre>
            </div>
            <p className="mt-3 font-mono text-[10px] leading-relaxed text-ink-faint">
              Or build locally: <span className="text-ink-dim">docker compose up -d --build</span>
            </p>
          </article>

          <article className="card flex flex-col p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-ink-faint">03</span>
              <span className="chip-neutral">Node 22+</span>
            </div>
            <h3 className="mt-3 text-[15px] font-bold">From source</h3>
            <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-ink-dim">
              Run the Express gateway (<code className="font-mono text-ink">:4101</code>) and Vite
              dashboard (<code className="font-mono text-ink">:4100</code>) locally with hot
              reload.
            </p>
            <div className="mt-4 space-y-2">
              <div className="overflow-hidden rounded-lg border border-line bg-night/50">
                <div className="flex items-center justify-between border-b border-line/70 px-3 py-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">backend/</span>
                  <CopyButton text="npm install && npm run dev" />
                </div>
                <pre className="overflow-x-auto px-3 py-2 font-mono text-[11px] leading-relaxed">
                  <span className="select-none text-ink-faint">$ </span>
                  <span className="text-ink">npm install &amp;&amp; npm run dev</span>
                </pre>
              </div>
              <div className="overflow-hidden rounded-lg border border-line bg-night/50">
                <div className="flex items-center justify-between border-b border-line/70 px-3 py-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">frontend/</span>
                  <CopyButton text="npm install && npm run dev" />
                </div>
                <pre className="overflow-x-auto px-3 py-2 font-mono text-[11px] leading-relaxed">
                  <span className="select-none text-ink-faint">$ </span>
                  <span className="text-ink">npm install &amp;&amp; npm run dev</span>
                </pre>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {specs.map((spec) => (
            <div key={spec.label} className="rounded-lg border border-line bg-surface/60 px-4 py-3">
              <div className="label-mono">{spec.label}</div>
              <div className="mt-1.5 truncate font-mono text-[11.5px] text-ink-dim">{spec.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
