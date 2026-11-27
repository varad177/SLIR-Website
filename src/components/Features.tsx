import React from 'react';

const features = [
  {
    icon: 'swap',
    title: 'Runtime model switching',
    body: 'Send model: "active-model" globally or pin specific models per app. Swap between local Ollama and cloud APIs in 1 click without restarts.',
    detail: 'model: "active-model"',
  },
  {
    icon: 'gauge',
    title: 'Latency X-ray profiler',
    body: 'Separates cold VRAM weight load, prompt evaluation (TTFT), and generation throughput (tok/s), plus live temperature and num_ctx tuning.',
    detail: 'L · PE · G · tok/s',
  },
  {
    icon: 'plug',
    title: 'OpenAI & Anthropic APIs',
    body: 'Exposes POST /v1/chat/completions and native POST /v1/messages with full bidirectional streaming SSE, tool calling, vision, and json_schema.',
    detail: '/v1/chat/completions · /v1/messages',
  },
  {
    icon: 'shuffle',
    title: 'Automatic failover traces',
    body: 'Ordered chains of up to 5 fallback models recover from 429, 5xx, timeouts, and network errors, logging every attempt HTTP code and error.',
    detail: 'step-by-step error log',
  },
  {
    icon: 'coins',
    title: 'Cost rules, budgets & alerts',
    body: 'Versioned pricing rules plus custom-model per-1M rates, daily/monthly hard 429 caps, spend projection, and Slack or Discord webhooks.',
    detail: 'block at 100% · webhooks',
  },
  {
    icon: 'list',
    title: 'Filterable request logs',
    body: 'Filter by app, model, status, stream, or routing outcome (Failover only/succeeded/failed), inspect cURL/JSON, and export CSV.',
    detail: 'X-SLIR-Telemetry header',
  },
  {
    icon: 'flask',
    title: 'Live streaming playground',
    body: 'Test system and user prompts with live SSE token streaming, attribute runs to an app key, and benchmark models side by side.',
    detail: 'live SSE · side-by-side',
  },
  {
    icon: 'lock',
    title: 'SQLite WAL privacy-first',
    body: 'Embedded SQLite in WAL mode stays on your machine. Prompts and completions are never saved—only anonymous telemetry and cost metadata.',
    detail: '0 prompts stored · /api/metrics',
  },
];

export function Features() {
  return (
    <section id="features" className="section scroll-mt-20">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow">02 — Capabilities</p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-[2.6rem] md:leading-[1.1]">
            A complete local AI control plane.
          </h2>
          <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ink-dim">
            Everything developers end up duct-taping together around local and cloud LLMs—packaged
            into a single zero-config container.
          </p>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="card card-hover flex flex-col p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-line-strong bg-night/50 text-accent">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {feature.icon === 'swap' && (<><path d="M8 3 4 7l4 4" /><path d="M4 7h16" /><path d="m16 21 4-4-4-4" /><path d="M20 17H4" /></>)}
                  {feature.icon === 'gauge' && (<><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></>)}
                  {feature.icon === 'plug' && (<><path d="M12 22v-5" /><path d="M9 8V2M15 8V2" /><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" /></>)}
                  {feature.icon === 'shuffle' && <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />}
                  {feature.icon === 'coins' && (<><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4M16.71 13.88l.7.71-2.82 2.82" /></>)}
                  {feature.icon === 'list' && (<><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></>)}
                  {feature.icon === 'flask' && <path d="M10 2v7.5L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 9.5V2M8.5 2h7M7 16h10" />}
                  {feature.icon === 'lock' && (<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>)}
                </svg>
              </span>
              <h3 className="mt-4 text-[14px] font-semibold tracking-tight">{feature.title}</h3>
              <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-ink-dim">{feature.body}</p>
              <p className="mt-4 border-t border-line/70 pt-2.5 font-mono text-[10px] text-ink-faint">
                {feature.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
