import React from 'react';

const faqs = [
  {
    q: 'Is SLIR really self-hosted?',
    a: 'Yes. It ships as one Docker container (varad177/slir-app:latest) with an embedded SQLite database. No account, no license key, and no telemetry leaves your machine. It runs offline on laptops, workstations, and on-prem servers.',
  },
  {
    q: 'Do my prompts or completions leave the machine?',
    a: 'SLIR stores operational metadata only: latency decomposition, token counts, routed model, HTTP status, failover trace errors, and calculated cost. Prompts and responses are never written to SQLite.',
  },
  {
    q: 'Which SDKs, protocols, and providers are supported?',
    a: 'Use OpenAI SDKs at /v1/chat/completions or official Anthropic SDKs at /v1/messages (x-api-key). Route to Ollama, LM Studio, vLLM, LocalAI, OpenAI, Anthropic, Groq, DeepSeek, or any /v1 endpoint—with automatic OpenAI ↔ Anthropic translation for streaming, tool calling, vision, cache_control, and json_schema.',
  },
  {
    q: 'How does runtime model switching work?',
    a: 'Send model: "active-model" from your app. SLIR resolves the alias against the active model (or per-application pinned model) in SQLite on every call. Change models in the browser and your very next request routes there without restarting your code.',
  },
  {
    q: 'How do automatic failover and failover logs work?',
    a: 'Each application can configure up to five ordered fallback models. On HTTP 429, 5xx, timeout, network failure, or open circuit breaker, SLIR switches to the next healthy candidate and records a step-by-step attempt log (model, provider, HTTP status, duration, and error message) inspectable on both the Failover and Request Logs pages.',
  },
  {
    q: 'How do application keys and telemetry headers work?',
    a: 'Create applications in the dashboard to generate mp_live_... virtual keys. Requests authenticated with an mp_live_ key are attributed to that app for analytics, budgets, and failover (returning X-SLIR-Telemetry: recorded). Unknown mp_live_ keys return 401; keyless local requests are proxied without recording telemetry (X-SLIR-Telemetry: skipped).',
  },
  {
    q: 'How are costs, budgets, and alerts tracked?',
    a: 'Configure versioned pricing rules or custom-model per-1M token rates, set daily or monthly notify/hard-block budgets per global, application, or model scope, and receive Slack/Discord webhook alerts or automatic HTTP 429 budget blocks at 100%.',
  },
  {
    q: 'What is the license?',
    a: 'MIT. Use it internally, self-host on-prem, fork it, or embed it in your stack. Source code is open on GitHub and images are public on Docker Hub.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
};

export function FAQ() {
  return (
    <section id="faq" className="section scroll-mt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">08 — FAQ</p>
            <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-[2.6rem] md:leading-[1.1]">
              Questions developers actually ask.
            </h2>
            <p className="mt-4 text-pretty text-[14px] leading-relaxed text-ink-dim">
              Built developer-first for fast local iteration and clean on-prem deployments. Open an
              issue on GitHub anytime.
            </p>
          </div>

          <div className="faq border-t border-line/70">
            {faqs.map((faq) => (
              <details key={faq.q} className="group border-b border-line/70 py-4">
                <summary className="flex items-center justify-between gap-4 text-[14px] font-semibold text-ink">
                  {faq.q}
                  <svg className="h-4 w-4 shrink-0 text-ink-faint transition-transform duration-200 group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-ink-dim">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
