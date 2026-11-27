import React from 'react';

const problems = [
  {
    index: '01',
    title: 'The restart cycle',
    before: 'Swap a model → edit .env or config → restart the server → lose your debugging state.',
    afterTitle: 'Set active-model once.',
    after: 'Click any model in the dashboard or pin per app. The next request routes immediately.',
  },
  {
    index: '02',
    title: 'The latency mystery',
    before: 'A local call took 3 seconds. Was it VRAM loading, a huge prompt context, or slow generation?',
    afterTitle: 'X-ray every request.',
    after: 'Inspect Load (L), Prompt Eval / TTFT (PE), and Generation speed (G) on every log row.',
  },
  {
    index: '03',
    title: 'The cost & token blind spot',
    before: 'Multiple bots and scripts hit different keys with zero per-app token or dollar tracking.',
    afterTitle: 'Attribute & enforce budgets.',
    after: 'Issue mp_live_ app keys with pricing rules, daily/monthly caps, webhooks, and 429 hard blocks.',
  },
  {
    index: '04',
    title: 'The single point of failure',
    before: 'One upstream 429 rate limit or crashed container breaks your agent workflow silently.',
    afterTitle: 'Fail over with full traces.',
    after: 'Per-app fallback chains retry on 429, 5xx, timeout or network error and log every attempt message.',
  },
];

export function Problem() {
  return (
    <section id="why" className="section scroll-mt-20">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow">01 — Why SLIR</p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-[2.6rem] md:leading-[1.1]">
            Stop restarting your backend to test a model.
          </h2>
          <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ink-dim">
            Four everyday bottlenecks when building AI apps locally or on-prem. SLIR removes all
            four without changing how your code calls OpenAI or Anthropic SDKs.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {problems.map((problem) => (
            <article key={problem.index} className="card card-hover p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-ink-faint">{problem.index}</span>
                <span className="chip border-bad/25 bg-bad/[0.07] text-bad/90">before</span>
              </div>
              <h3 className="mt-4 text-[17px] font-bold tracking-tight">{problem.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-dim">{problem.before}</p>
              <div className="mt-4 flex gap-3 rounded-lg border border-good/20 bg-good/[0.05] p-3.5">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-good" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <p className="text-[13px] leading-relaxed text-ink-dim">
                  <span className="font-semibold text-ink">{problem.afterTitle}</span>{' '}
                  {problem.after}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
          {['Zero .env required', 'Single Docker container', 'OpenAI + Anthropic SDKs', 'Prompts never stored'].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <svg className="h-3 w-3 text-good" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
