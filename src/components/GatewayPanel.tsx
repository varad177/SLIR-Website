'use client';

import React, { useState } from 'react';
import { SlirPulseMark } from './SlirLogo';

interface GatewayRoute {
  id: string;
  provider: string;
  label: string;
  pinned: boolean;
  load: string;
  ttft: string;
  speed: string;
  total: string;
  loadW: string;
  ttftW: string;
  evalW: string;
  tokens: number;
  cost: string;
  sample: string;
}

const routes: GatewayRoute[] = [
  {
    id: 'nomic-embed-text:latest',
    provider: 'ollama',
    label: 'local ollama',
    pinned: true,
    load: '0ms',
    ttft: '42ms',
    speed: '148.2 tok/s',
    total: '0.32s',
    loadW: '4%',
    ttftW: '16%',
    evalW: '80%',
    tokens: 612,
    cost: '$0.0000',
    sample: 'Indexed 612 prompt tokens locally at $0 cost.',
  },
  {
    id: 'google/gemma-4-31b-it',
    provider: 'google',
    label: 'global fallback',
    pinned: false,
    load: '0ms',
    ttft: '195ms',
    speed: '96.4 tok/s',
    total: '1.14s',
    loadW: '0%',
    ttftW: '17%',
    evalW: '83%',
    tokens: 940,
    cost: '$0.0002',
    sample: 'Global fallback answered via OpenAI-compatible route.',
  },
  {
    id: 'gpt-4o-mini',
    provider: 'openai',
    label: 'cloud openai',
    pinned: true,
    load: '0ms',
    ttft: '160ms',
    speed: '112.0 tok/s',
    total: '0.88s',
    loadW: '0%',
    ttftW: '18%',
    evalW: '82%',
    tokens: 820,
    cost: '$0.0004',
    sample: 'Routed to OpenAI cloud without restarting client code.',
  },
  {
    id: 'claude-sonnet-4',
    provider: 'anthropic',
    label: 'messages api',
    pinned: true,
    load: '0ms',
    ttft: '285ms',
    speed: '84.1 tok/s',
    total: '1.46s',
    loadW: '0%',
    ttftW: '20%',
    evalW: '80%',
    tokens: 1080,
    cost: '$0.0036',
    sample: 'Translated OpenAI /v1/chat/completions to Anthropic /v1/messages.',
  },
];

export function GatewayPanel() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [failoverDemo, setFailoverDemo] = useState(false);

  const activeRoute = routes[selectedIndex] || routes[0];

  const selectRoute = (idx: number) => {
    const route = routes[idx] || routes[0];
    setSelectedIndex(idx);
    setFailoverDemo(false);
    window.dispatchEvent(
      new CustomEvent('slir:route-preview', {
        detail: { model: route.id, provider: route.provider, isPinned: route.pinned, isFailover: false },
      })
    );
  };

  const emitRequest = (isFailover: boolean) => {
    const route = isFailover ? routes[2] : activeRoute;
    if (isFailover) {
      setSelectedIndex(2);
      setFailoverDemo(true);
    } else {
      setFailoverDemo(false);
    }

    window.dispatchEvent(
      new CustomEvent('slir:live-request', {
        detail: {
          app: 'Your App',
          model: isFailover ? 'gpt-4o-mini' : route.id,
          provider: isFailover ? 'openai' : route.provider,
          tokens: isFailover ? 412 : route.tokens,
          cost: isFailover ? 0.0004 : Number(route.cost.replace('$', '')),
          latency: isFailover ? '980 ms' : route.total,
          isFailover,
        },
      })
    );
  };

  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[540px] lg:mx-0">
      <div
        className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-accent/[0.06] blur-2xl"
        aria-hidden="true"
      />

      <div className="overflow-hidden rounded-xl border border-line-strong bg-surface shadow-2xl shadow-black/60">
        <div className="flex items-center justify-between border-b border-line bg-night/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <SlirPulseMark size={16} />
            <span className="text-[13px] font-extrabold tracking-[0.02em]">SLIR</span>
            <span className="rounded border border-good/30 bg-good/15 px-1.5 py-0.5 font-mono text-[8.5px] font-bold text-good">
              LIVE DEMO
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-good">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-good opacity-45" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-good" />
            </span>
            GATEWAY :4101
          </div>
        </div>

        <div className="space-y-3.5 p-4">
          <div className="rounded-lg border border-line bg-night/60 px-3 py-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint">
                1 · Client app (unchanged)
              </span>
              <span className="font-mono text-[9px] text-good">0 restarts</span>
            </div>
            <div className="mt-1.5 break-all font-mono text-[10px] text-ink-dim sm:break-words sm:text-[10.5px]">
              client.chat.completions.create(<span className="font-semibold text-accent-bright">model=&quot;active-model&quot;</span>)
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint">
                2 · Switch route target at runtime
              </span>
              <span
                className={
                  activeRoute.pinned
                    ? 'rounded border border-accent/40 bg-accent/15 px-1.5 py-0.5 font-mono text-[8.5px] font-semibold text-accent-bright'
                    : 'rounded border border-good/30 bg-good/15 px-1.5 py-0.5 font-mono text-[8.5px] font-semibold text-good'
                }
              >
                {activeRoute.pinned ? 'Pinned model' : 'Follow global'}
              </span>
            </div>

            <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2" role="group" aria-label="Select active route model">
              {routes.map((route, idx) => {
                const selected = idx === selectedIndex;
                return (
                  <button
                    key={route.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => selectRoute(idx)}
                    className="flex cursor-pointer items-center justify-between gap-2 rounded-md border border-line/80 bg-night/40 px-2.5 py-2 text-left transition-colors hover:border-line-strong aria-pressed:border-accent/55 aria-pressed:bg-accent/[0.08]"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-mono text-[10.5px] font-semibold text-ink">{route.id}</div>
                      <div className="font-mono text-[8.5px] text-ink-faint">{route.label}</div>
                    </div>
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${selected ? 'bg-accent' : 'bg-line-strong'}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => emitRequest(false)}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md bg-accent px-3 py-2 font-mono text-[11px] font-bold text-night transition-colors hover:bg-accent-bright sm:flex-1"
            >
              <span>▶</span> Send live request
            </button>
            <button
              type="button"
              onClick={() => emitRequest(true)}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-line-strong bg-raised px-3 py-2 font-mono text-[11px] font-semibold text-ink transition-colors hover:border-accent/50 hover:text-accent-bright sm:w-auto"
            >
              <span>⚡</span> Test 429 failover
            </button>
          </div>

          <div className="rounded-lg border border-line bg-night/70 p-3">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <span className="label-xs">3 · Live gateway trace</span>
              <span className="max-w-full break-words rounded bg-good/15 px-1.5 py-0.5 font-mono text-[8.5px] font-semibold text-good">
                {failoverDemo
                  ? 'HTTP 200 (Failover recovered) · X-SLIR-Telemetry: recorded'
                  : 'HTTP 200 · X-SLIR-Telemetry: recorded'}
              </span>
            </div>

            <div className="mt-2 space-y-1 font-mono text-[9.5px]">
              <div className="flex flex-wrap items-center justify-between gap-1.5 rounded bg-surface px-2 py-1 text-ink-dim">
                <span>1. Client request</span>
                <span className="min-w-0 break-all text-ink sm:break-normal">
                  model: &quot;active-model&quot; →{' '}
                  <strong className="text-accent-bright">
                    {failoverDemo ? 'claude-sonnet-4' : activeRoute.id}
                  </strong>
                </span>
              </div>

              {failoverDemo && (
                <div className="flex flex-wrap items-center justify-between gap-1.5 rounded border border-bad/30 bg-bad/10 px-2 py-1 text-bad">
                  <span>2. Primary returned HTTP 429 (Quota exceeded · 110ms)</span>
                  <span>failover → gpt-4o-mini</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-1.5 rounded bg-surface px-2 py-1 text-ink-dim">
                <span>{failoverDemo ? '3. Fallback succeeded' : '2. Response delivered'}</span>
                <span className="text-good">
                  {failoverDemo
                    ? '200 OK · gpt-4o-mini · 980ms · 412 tokens'
                    : `200 OK · ${activeRoute.total} · ${activeRoute.tokens} tokens`}
                </span>
              </div>
            </div>

            <p className="mt-2 font-mono text-[9px] text-ink-faint">
              {failoverDemo
                ? 'Primary returned HTTP 429; SLIR automatically switched to gpt-4o-mini mid-flight and logged both attempts.'
                : activeRoute.sample}
            </p>

            <div className="mt-3 border-t border-line/70 pt-2.5">
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px] sm:flex sm:items-center sm:justify-between">
                <span className="text-ink-faint">
                  L:<strong className="text-ink">{failoverDemo ? '0ms' : activeRoute.load}</strong>
                </span>
                <span className="text-ink-faint">
                  PE:<strong className="text-ink">{failoverDemo ? '180ms' : activeRoute.ttft}</strong>
                </span>
                <span className="text-ink-faint">
                  G:<strong className="text-ink">{failoverDemo ? '94.0 tok/s' : activeRoute.speed}</strong>
                </span>
                <span className="text-ink-faint">
                  Cost:<strong className="text-good">{failoverDemo ? '$0.0004' : activeRoute.cost}</strong>
                </span>
              </div>
              <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full bg-raised" aria-hidden="true">
                <div
                  className="bar-seg h-full bg-accent"
                  style={{ width: failoverDemo ? '0%' : activeRoute.loadW }}
                />
                <div
                  className="bar-seg h-full bg-cyan"
                  style={{ width: failoverDemo ? '22%' : activeRoute.ttftW }}
                />
                <div
                  className="bar-seg h-full bg-good"
                  style={{ width: failoverDemo ? '78%' : activeRoute.evalW }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
