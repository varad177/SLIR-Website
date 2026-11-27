'use client';

import React, { useState } from 'react';

const bullets = [
  {
    title: 'Model load',
    body: 'VRAM weight and KV cache initialization. The badge tells you cold load versus resident warm.',
  },
  {
    title: 'Prompt eval',
    body: 'Time to first token. The real cost of a large context window, measured before generation starts.',
  },
  {
    title: 'Eval',
    body: 'Token generation speed in tokens per second, taken from the provider’s own counters.',
  },
];

const contextLabels = ['2K', '4K', '8K', '16K'];

export function ProfilerSim() {
  const [ctx, setCtx] = useState(1);
  const [temp, setTemp] = useState(0.3);
  const [cold, setCold] = useState(true);

  const load = cold ? 380 + ctx * 90 : 0;
  const ttft = 120 + ctx * 45 + temp * 30;
  const speed = 58 + (1 - temp) * 14;
  const evalMs = (160 / speed) * 1000;
  const total = load + ttft + evalMs;

  const formatMs = (ms: number) =>
    ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${Math.round(ms)}ms`;
  const widthPct = (value: number) => `${(value / total) * 100}%`;

  return (
    <section id="profiler" className="section scroll-mt-20">
      <div className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <div>
            <p className="eyebrow">04 — Latency X-ray</p>
            <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-[2.6rem] md:leading-[1.1]">
              See exactly where the milliseconds go.
            </h2>
            <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ink-dim">
              Most tools tell you a request took three seconds. SLIR breaks it into the three
              phases that actually explain why.
            </p>

            <ul className="mt-8 space-y-5">
              {bullets.map((bullet) => (
                <li key={bullet.title} className="flex gap-3.5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-accent/25 bg-accent/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  <div>
                    <h3 className="text-[14px] font-semibold">{bullet.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink-dim">{bullet.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-8 border-l-2 border-line-strong pl-4 font-mono text-[11px] leading-relaxed text-ink-faint">
              Real timings come from Ollama’s own counters on your hardware. The panel on the right
              is an interactive estimate.
            </p>
          </div>

          <div className="card p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-line/70 pb-4">
              <span className="label-mono">Probe result</span>
              {cold ? (
                <span className="chip border-warn/30 bg-warn/10 text-warn">
                  <span className="h-1 w-1 rounded-full bg-warn" />
                  cold load
                </span>
              ) : (
                <span className="chip border-good/30 bg-good/10 text-good">
                  <span className="h-1 w-1 rounded-full bg-good" />
                  resident warm
                </span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-[2rem] font-bold leading-none tracking-tight">
                {formatMs(total)}
              </span>
              <span className="font-mono text-[10.5px] text-ink-faint">
                qwen2.5:7b · {contextLabels[ctx]} ctx · temp {temp.toFixed(1)}
              </span>
            </div>

            <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-raised" aria-hidden="true">
              <div className="bar-seg h-full bg-accent" style={{ width: widthPct(load) }} />
              <div className="bar-seg h-full bg-cyan" style={{ width: widthPct(ttft) }} />
              <div className="bar-seg h-full bg-good" style={{ width: widthPct(evalMs) }} />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-line bg-night/40 p-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span className="label-xs">Model load</span>
                </div>
                <div className="mt-1.5 font-mono text-[13px] font-semibold">
                  {cold ? formatMs(load) : '0ms'}
                </div>
              </div>
              <div className="rounded-lg border border-line bg-night/40 p-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                  <span className="label-xs">TTFT</span>
                </div>
                <div className="mt-1.5 font-mono text-[13px] font-semibold">
                  {formatMs(ttft)}
                </div>
              </div>
              <div className="rounded-lg border border-line bg-night/40 p-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-good" />
                  <span className="label-xs">Generation</span>
                </div>
                <div className="mt-1.5 font-mono text-[13px] font-semibold">
                  {speed.toFixed(1)} tok/s
                </div>
              </div>
            </div>

            <p className="mt-3 font-mono text-[10px] text-ink-faint">
              Eval time <span className="text-ink-dim">{formatMs(evalMs)}</span> · 160 tokens out
            </p>

            <div className="mt-6 space-y-5 border-t border-line/70 pt-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="label-mono">Context window</span>
                  <span className="font-mono text-[10px] text-ink-faint">num_ctx</span>
                </div>
                <div
                  className="mt-2 grid grid-cols-4 gap-1 rounded-md border border-line bg-night/40 p-1"
                  role="group"
                  aria-label="Context window"
                >
                  {contextLabels.map((label, idx) => (
                    <button
                      key={label}
                      type="button"
                      aria-pressed={ctx === idx}
                      onClick={() => setCtx(idx)}
                      className="cursor-pointer rounded px-2 py-1 font-mono text-[11px] text-ink-faint transition-colors hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="temp-slider" className="label-mono">
                    Temperature
                  </label>
                  <span className="font-mono text-[11px] text-ink-dim">{temp.toFixed(1)}</span>
                </div>
                <input
                  id="temp-slider"
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  style={{ '--pct': `${temp * 100}%` } as React.CSSProperties}
                  className="mt-3"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="label-mono">Cache state</span>
                  <span className="font-mono text-[10px] text-ink-faint">cold vs warm</span>
                </div>
                <div
                  className="mt-2 grid grid-cols-2 gap-1 rounded-md border border-line bg-night/40 p-1"
                  role="group"
                  aria-label="Cache state"
                >
                  <button
                    type="button"
                    aria-pressed={cold}
                    onClick={() => setCold(true)}
                    className="cursor-pointer rounded px-2 py-1 font-mono text-[11px] text-ink-faint transition-colors hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
                  >
                    Cold load
                  </button>
                  <button
                    type="button"
                    aria-pressed={!cold}
                    onClick={() => setCold(false)}
                    className="cursor-pointer rounded px-2 py-1 font-mono text-[11px] text-ink-faint transition-colors hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
                  >
                    Warm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
