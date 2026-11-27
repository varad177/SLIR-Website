import React from 'react';
import { site } from '@/data/site';
import { CopyButton } from './CopyButton';
import { LiveProductFlow } from './LiveProductFlow';
import { DashboardMock } from './DashboardMock';

const heroDockerCmd =
  'docker run -d --name slir -p 4100:4101 -p 4101:4101 --add-host=host.docker.internal:host-gateway -v slir_data:/app/data varad177/slir-app:latest';

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-14">
      <div className="bg-blueprint absolute inset-0" aria-hidden="true" />
      <div className="hero-glow absolute inset-x-0 top-0 h-[540px]" aria-hidden="true" />

      <div className="container-site relative pb-10 pt-10 md:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.03fr_0.97fr] lg:gap-14">
          <div className="min-w-0 text-center lg:text-left">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-accent sm:text-[11px] sm:tracking-[0.2em]">
              <span>SLIR · Switch LLM In Runtime</span>
              <span className="mx-1.5 text-ink-faint">·</span>
              <span className="whitespace-nowrap">Self-Hosted AI Gateway</span>
            </p>

            <h1 className="mx-auto mt-4 max-w-2xl text-balance text-[1.95rem] font-extrabold leading-[1.08] tracking-[-0.035em] sm:text-5xl lg:mx-0 lg:text-[3.2rem] xl:text-[3.4rem]">
              One local AI gateway.
              <span className="block text-ink-dim">Switch LLMs at runtime.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-pretty text-[14.5px] leading-relaxed text-ink-dim md:text-[15.5px] lg:mx-0">
              Stop editing config files and restarting servers to test another LLM. Point your
              app once at{' '}
              <code className="rounded bg-raised/70 px-1.5 py-0.5 font-mono text-[12.5px] text-ink">
                http://localhost:4101
              </code>{' '}
              with{' '}
              <code className="rounded bg-raised/70 px-1.5 py-0.5 font-mono text-[12.5px] text-ink">
                model: &quot;active-model&quot;
              </code>
              , hot-swap between Ollama, LM Studio, vLLM, OpenAI, Anthropic, and Groq in one
              click, and trace every millisecond, token, and automatic failover.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="chip border-good/30 bg-good/10 text-good">1-Click Hot-Swap</span>
              <span className="chip border-accent/30 bg-accent/10 text-accent">OpenAI + Anthropic API</span>
              <span className="chip border-cloud/30 bg-cloud/10 text-cloud">Auto Failover Traces</span>
              <span className="chip border-line-strong bg-raised/60 text-ink-dim">MIT · Zero Prompts Stored</span>
            </div>

            <div className="mx-auto mt-6 w-full max-w-xl overflow-hidden rounded-lg border border-line-strong bg-surface text-left shadow-xl shadow-black/40 lg:mx-0">
              <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
                <span className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-faint">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
                    <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
                    <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
                  </span>
                  run anywhere with docker (zero config)
                </span>
                <CopyButton text={heroDockerCmd} />
              </div>
              <pre className="overflow-x-auto px-4 py-3 font-mono text-[11px] leading-[1.85]">
                <span className="select-none text-ink-faint">$ </span>
                <span className="text-ink">docker run -d --name slir -p 4100:4101 -p 4101:4101 \</span>
                {'\n'}
                <span className="text-ink">    --add-host=host.docker.internal:host-gateway \</span>
                {'\n'}
                <span className="text-ink">    -v slir_data:/app/data {site.dockerImage}</span>
                {'\n'}
                <span className="text-ink-faint"># dashboard UI → http://localhost:4100</span>
                {'\n'}
                <span className="text-ink-faint"># AI gateway   → http://localhost:4101/v1  (or /v1/messages)</span>
              </pre>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[12.5px] lg:justify-start">
              <a href="#install" className="font-medium text-accent transition-colors hover:text-accent-bright">
                Docker Compose &amp; source install
              </a>
              <span className="text-line-strong">/</span>
              <a href="#code" className="text-ink-dim transition-colors hover:text-ink">
                OpenAI &amp; Anthropic snippets →
              </a>
              <span className="text-line-strong">/</span>
              <a href="#reference" className="text-ink-dim transition-colors hover:text-ink">
                Endpoints
              </a>
            </div>
          </div>

          <div className="relative min-w-0">
            <LiveProductFlow />
          </div>
        </div>
      </div>

      <div className="container-site relative pb-12">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-5 shrink-0 bg-line-strong sm:w-8" />
          <span className="label-mono text-center">Live interactive dashboard preview — try switching models &amp; testing failover</span>
          <span className="h-px w-5 shrink-0 bg-line-strong sm:w-8" />
        </div>
        <div className="mt-5">
          <DashboardMock />
        </div>
      </div>

      <div className="container-site relative border-t border-line/60 py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
          <span className="text-ink-faint">Works with</span>
          <span>Ollama</span>
          <span className="text-line-strong">·</span>
          <span>LM Studio</span>
          <span className="text-line-strong">·</span>
          <span>vLLM</span>
          <span className="text-line-strong">·</span>
          <span>LocalAI</span>
          <span className="text-line-strong">·</span>
          <span>OpenAI</span>
          <span className="text-line-strong">·</span>
          <span>Anthropic Claude</span>
          <span className="text-line-strong">·</span>
          <span>Groq</span>
          <span className="text-line-strong">·</span>
          <span>DeepSeek</span>
          <span className="text-line-strong">·</span>
          <span>any /v1 endpoint</span>
        </div>
      </div>
    </section>
  );
}
