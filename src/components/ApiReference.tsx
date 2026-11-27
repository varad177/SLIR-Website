import React from 'react';

const endpoints = [
  {
    method: 'POST',
    path: '/v1/chat/completions',
    desc: 'OpenAI-compatible chat endpoint (SSE streaming, tools, vision, response_format). Resolves active-model, app pins, and failover chains.',
  },
  {
    method: 'POST',
    path: '/v1/messages',
    desc: 'Native Anthropic Messages ingress (x-api-key header). Translates requests, SSE deltas, tool use, and error shapes automatically.',
  },
  {
    method: 'GET',
    path: '/v1/models',
    desc: 'Lists local Ollama inventory plus registered cloud custom endpoints with provider and format metadata.',
  },
  {
    method: 'GET',
    path: '/api/health?deep=1',
    desc: 'Returns gateway and SQLite status; pass ?deep=1 to probe local Ollama dependency reachability.',
  },
  {
    method: 'GET',
    path: '/api/metrics',
    desc: 'Prometheus scrape endpoint exporting request counters, tokens, latency, spend, and failover metrics.',
  },
];

const envVars = [
  {
    name: 'PORT',
    defaultVal: '4101',
    desc: 'Internal Express listener serving the UI, management API, and /v1 gateway.',
  },
  {
    name: 'OLLAMA_URL',
    defaultVal: 'http://host.docker.internal:11434',
    desc: 'Local Ollama endpoint(s); comma-separated values are probed in order with health caching.',
  },
  {
    name: 'DATABASE_PATH',
    defaultVal: '/app/data/monitor.db',
    desc: 'Embedded SQLite WAL database path persisted across restarts via Docker volume.',
  },
  {
    name: 'RETENTION_DAYS',
    defaultVal: '0',
    desc: 'Automatic usage_events pruning window in days (0 keeps all telemetry forever).',
  },
  {
    name: 'SLIR_PUBLIC_BASE_URL',
    defaultVal: '(auto-detected)',
    desc: 'Override snippet base URL when hosting SLIR behind a reverse proxy or domain.',
  },
  {
    name: 'FAILOVER_CIRCUIT_FAILURES',
    defaultVal: '5',
    desc: 'Consecutive network/timeout/5xx errors before opening the per-model circuit breaker cooldown.',
  },
];

export function ApiReference() {
  return (
    <section id="reference" className="section scroll-mt-20">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow">07 — Developer Reference</p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-[2.6rem] md:leading-[1.1]">
            Every endpoint &amp; flag in one view.
          </h2>
          <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ink-dim">
            Every proxied response emits <code className="font-mono text-ink">X-Request-ID</code> and{' '}
            <code className="font-mono text-ink">X-SLIR-Telemetry: recorded | skipped</code> so you
            can verify attribution straight from your terminal.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="card min-w-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <h3 className="text-[14px] font-semibold">HTTP Endpoints</h3>
              <span className="font-mono text-[10px] text-ink-faint">:4101</span>
            </div>
            <div className="divide-y divide-line/60">
              {endpoints.map((ep) => (
                <div key={ep.path} className="px-4 py-3.5 sm:px-5">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[11.5px]">
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[9.5px] font-bold ${
                        ep.method === 'POST'
                          ? 'bg-accent/15 text-accent'
                          : 'bg-good/15 text-good'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="break-all font-semibold text-ink sm:break-normal">{ep.path}</span>
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-dim">{ep.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card min-w-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <h3 className="text-[14px] font-semibold">Environment Variables (Optional)</h3>
              <span className="font-mono text-[10px] text-ink-faint">zero-config defaults</span>
            </div>
            <div className="divide-y divide-line/60">
              {envVars.map((env) => (
                <div key={env.name} className="px-4 py-3.5 sm:px-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[11.5px]">
                    <span className="break-all font-semibold text-ink sm:break-normal">{env.name}</span>
                    <span className="break-all text-[10.5px] text-ink-faint sm:break-normal">{env.defaultVal}</span>
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-dim">{env.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
