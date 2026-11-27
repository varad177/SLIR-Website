import React from 'react';

const gatewayFeatures = [
  'Dynamic model resolver (active-model / pinned)',
  'OpenAI ↔ Anthropic bidirectional translation',
  'Latency + usage + failover trace writer',
  'Per-app budget hard-block & webhooks',
];

const captions = [
  'Single Node.js + SQLite process',
  'Zero prompt or completion retention',
  'Buffered & full SSE streaming telemetry',
];

export function Architecture() {
  return (
    <section id="architecture" className="section scroll-mt-20">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow">06 — Architecture</p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-[2.6rem] md:leading-[1.1]">
            One process between your app and every model.
          </h2>
          <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ink-dim">
            A single Express gateway serves the built React dashboard, authenticates virtual
            application keys, translates OpenAI &amp; Anthropic protocols, and writes metadata to
            SQLite.
          </p>
        </div>

        <div className="mt-10 rounded-xl border border-line-strong bg-surface p-5 md:p-8">
          <div className="grid items-stretch gap-2 lg:grid-cols-[1fr_auto_1.2fr_auto_1fr]">
            <div className="flex flex-col rounded-lg border border-line bg-night/40 p-4">
              <div className="label-mono">Client apps</div>
              <div className="mt-1 text-[13px] font-semibold">OpenAI or Anthropic SDK</div>
              <p className="mt-1 text-[11.5px] leading-relaxed text-ink-dim">
                Python, Node.js, .NET, Go, LangChain, cURL.
              </p>
              <div className="mt-auto space-y-1.5 border-t border-line/60 pt-3 font-mono text-[10px]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ink-faint">base_url</span>
                  <span className="text-ink-dim">:4101/v1</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ink-faint">api_key</span>
                  <span className="text-ink-dim">mp_live_...</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ink-faint">model</span>
                  <span className="text-ink-dim">active-model</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center py-1 lg:py-0">
              <svg className="h-4 w-4 rotate-90 text-ink-faint lg:rotate-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>

            <div className="rounded-lg border border-accent/35 bg-accent/[0.04] p-4 shadow-[0_0_40px_-18px_rgba(249,115,22,0.45)]">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-accent">Unified Container</div>
                <span className="font-mono text-[10px] text-ink-faint">:4100 / :4101</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-[13px] font-semibold">
                SLIR Gateway + UI
                <span className="rounded bg-accent/15 px-1.5 py-px font-mono text-[8.5px] uppercase tracking-wider text-accent">
                  node 22
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 border-t border-accent/15 pt-3 text-[11px] text-ink-dim">
                {gatewayFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-center py-1 lg:py-0">
              <svg className="h-4 w-4 rotate-90 text-ink-faint lg:rotate-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>

            <div className="rounded-lg border border-line bg-night/40 p-4">
              <div className="label-mono">Upstreams</div>
              <div className="mt-1 text-[13px] font-semibold">Local + cloud runtimes</div>
              <div className="mt-3 space-y-3 border-t border-line/60 pt-3">
                <div>
                  <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-good">
                    <span className="h-1 w-1 rounded-full bg-good" /> local
                  </div>
                  <p className="mt-1 font-mono text-[10px] leading-relaxed text-ink-dim">
                    Ollama :11434 (native /api/chat + /v1)
                    <br />
                    LM Studio :1234 · vLLM :8000
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cloud">
                    <span className="h-1 w-1 rounded-full bg-cloud" /> cloud
                  </div>
                  <p className="mt-1 font-mono text-[10px] leading-relaxed text-ink-dim">
                    OpenAI · Anthropic Messages
                    <br />
                    Groq · DeepSeek · custom /v1
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-dashed border-line-strong bg-night/30 px-4 py-3 text-center">
            <p className="font-mono text-[10.5px] leading-relaxed text-ink-dim">
              <span className="text-ink">SQLite (WAL · schema v5)</span> — usage_events · custom_models · model_pricing · budgets · failover_trace
              <span className="text-ink-faint"> · prompts never persisted</span>
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
            {captions.map((caption) => (
              <span key={caption} className="flex items-center gap-2">
                <svg className="h-3 w-3 text-good" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {caption}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
