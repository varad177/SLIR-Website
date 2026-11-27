'use client';

import React, { useEffect, useState } from 'react';
import { SlirPulseMark } from './SlirLogo';

interface FlowScene {
  id: 'local' | 'translate' | 'failover';
  step: string;
  title: string;
  tag: string;
  caption: string;
  activeTarget: 'ollama' | 'anthropic' | 'openai';
  failedTarget?: 'openai';
  telemetry: string;
  actionBadge: string;
  wireLabel: string;
  responseLabel: string;
}

const scenes: FlowScene[] = [
  {
    id: 'local',
    step: '01',
    title: 'Hot-Swap Local',
    tag: '0 restarts · $0',
    caption:
      'Keep model="active-model" unchanged in code. Select local Ollama in SLIR and the very next request runs locally at $0 cost.',
    activeTarget: 'ollama',
    telemetry: 'L:0ms · PE:42ms · 148 tok/s · $0',
    actionBadge: 'ROUTE: OLLAMA LOCAL',
    wireLabel: 'active-model → qwen2.5:7b',
    responseLabel: '200 OK · 148 tok/s',
  },
  {
    id: 'translate',
    step: '02',
    title: 'Cloud & Translate',
    tag: 'OpenAI → Messages',
    caption:
      'Hot-swap mid-session to Claude. SLIR translates OpenAI /v1/chat/completions into Anthropic /v1/messages with zero SDK edits.',
    activeTarget: 'anthropic',
    telemetry: 'OpenAI→Messages · 285ms · $0.003',
    actionBadge: 'TRANSLATING PROTOCOL',
    wireLabel: 'active-model → claude-sonnet-4',
    responseLabel: '200 OK · translated',
  },
  {
    id: 'failover',
    step: '03',
    title: '429 Auto-Failover',
    tag: 'Self-healing',
    caption:
      'When OpenAI returns HTTP 429 Quota Exceeded, SLIR catches it mid-flight, retries on your local Ollama fallback, and logs both traces.',
    activeTarget: 'ollama',
    failedTarget: 'openai',
    telemetry: '429 caught → Ollama OK · 980ms',
    actionBadge: 'AUTO FAILOVER SAVED',
    wireLabel: '429 caught → qwen2.5:7b',
    responseLabel: '200 OK · failover',
  },
];

const providerColors = {
  ollama: '#10b981',
  anthropic: '#a855f7',
  openai: '#22d3ee',
} as const;

export function LiveProductFlow() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setSceneIdx((prev) => (prev + 1) % scenes.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [paused]);

  const scene = scenes[sceneIdx];
  const activeColor = providerColors[scene.activeTarget];
  const isFailover = scene.id === 'failover';

  const selectScene = (idx: number) => {
    setSceneIdx(idx);
    setPaused(true);
  };

  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[540px] lg:mx-0">
      <div
        className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-accent/[0.06] blur-2xl"
        aria-hidden="true"
      />

      <div className="overflow-hidden rounded-xl border border-line-strong bg-surface shadow-2xl shadow-black/60">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-night/75 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <SlirPulseMark size={16} />
            <span className="text-[13px] font-extrabold tracking-[0.02em]">SLIR</span>
            <span className="inline-flex items-center gap-1.5 rounded border border-good/30 bg-good/15 px-1.5 py-0.5 font-mono text-[8.5px] font-bold text-good">
              <span className="relative flex h-1.5 w-1.5">
                {!paused && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-good opacity-55" />
                )}
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-good" />
              </span>
              LIVE FLOW
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden font-mono text-[9.5px] text-ink-faint sm:inline">GATEWAY :4101</span>
            <button
              type="button"
              aria-pressed={paused}
              onClick={() => setPaused((prev) => !prev)}
              className="cursor-pointer rounded border border-line-strong bg-surface px-2 py-0.5 font-mono text-[9.5px] font-medium text-ink-dim transition-colors hover:border-accent/50 hover:text-ink"
            >
              {paused ? '▶ Play' : '❚❚ Pause'}
            </button>
          </div>
        </div>

        {/* 3 Interactive Auto-Looping Scenario Pills */}
        <div
          className="grid grid-cols-1 gap-1.5 border-b border-line bg-night/45 p-2 sm:grid-cols-3"
          role="tablist"
          aria-label="SLIR live architecture scenarios"
        >
          {scenes.map((item, idx) => {
            const active = idx === sceneIdx;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectScene(idx)}
                className={`relative flex cursor-pointer flex-col items-start justify-between gap-0.5 overflow-hidden rounded-md border px-2.5 py-1.5 text-left font-mono transition-colors ${
                  active
                    ? 'border-accent/60 bg-accent/[0.1] text-ink'
                    : 'border-line bg-surface/60 text-ink-dim hover:border-line-strong hover:text-ink'
                }`}
              >
                <span className="flex w-full items-center justify-between gap-1 text-[10px] font-semibold">
                  <span>
                    <span className={`mr-1 ${active ? 'text-accent-bright' : 'text-ink-faint'}`}>
                      {item.step}
                    </span>
                    {item.title}
                  </span>
                </span>
                <span className={`text-[8.5px] ${active ? 'text-accent-bright' : 'text-ink-faint'}`}>
                  {item.tag}
                </span>
                {active && !paused && (
                  <span
                    key={`${scene.id}-bar`}
                    aria-hidden="true"
                    className="slir-tab-progress absolute inset-x-0 bottom-0 h-[2px] bg-accent"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Animated SVG Stage */}
        <div className="bg-night p-2.5 sm:p-3">
          {/* Desktop / Tablet Hero SVG (1:1 aspect fit for ~540px column) */}
          <svg
            viewBox="0 0 540 416"
            className="hidden h-auto w-full select-none sm:block"
            role="img"
            aria-label={`Animated architecture showing ${scene.title}: ${scene.caption}`}
          >
            <defs>
              <pattern id="slir-hero-grid-d" width="28" height="28" patternUnits="userSpaceOnUse">
                <path
                  d="M 28 0 L 0 0 0 28"
                  fill="none"
                  stroke="#1f2536"
                  strokeWidth="0.7"
                  strokeOpacity="0.45"
                />
              </pattern>
              <radialGradient id="slir-hero-glow-d" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </radialGradient>
              <filter id="slir-hero-neon-d" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect x="0" y="0" width="540" height="416" fill="url(#slir-hero-grid-d)" rx="8" />
            <circle cx="270" cy="210" r="145" fill="url(#slir-hero-glow-d)" />

            {/* ================= 1. CLIENT APP (TOP) ================= */}
            <rect
              x="16"
              y="12"
              width="508"
              height="78"
              rx="10"
              fill="#11141d"
              stroke="#2f384f"
              strokeWidth="1.25"
            />
            <text
              x="28"
              y="32"
              fill="#77839b"
              fontSize="9"
              fontWeight="700"
              fontFamily="var(--font-mono)"
              letterSpacing="1.2"
            >
              1 · YOUR APP (CODE UNCHANGED)
            </text>
            <rect x="434" y="19" width="78" height="17" rx="4" fill="#10b981" fillOpacity="0.15" />
            <text
              x="473"
              y="30.5"
              textAnchor="middle"
              fill="#10b981"
              fontSize="8.5"
              fontWeight="700"
              fontFamily="var(--font-mono)"
            >
              0 RESTARTS
            </text>

            {/* Unchanged SDK Line + Live Response Pill */}
            <rect
              x="28"
              y="42"
              width="484"
              height="36"
              rx="6"
              fill="#090b10"
              stroke="#1f2536"
              strokeWidth="1"
            />
            <text
              x="38"
              y="63.5"
              fill="#9aa6be"
              fontSize="10"
              fontFamily="var(--font-mono)"
            >
              client.chat(<tspan fill="#fb923c" fontWeight="700">model=&quot;active-model&quot;</tspan>)
            </text>
            <rect
              x="356"
              y="48"
              width="148"
              height="24"
              rx="5"
              fill="#10b981"
              fillOpacity="0.14"
              stroke="#10b981"
              strokeOpacity="0.4"
              strokeWidth="0.9"
            />
            <text
              x="430"
              y="63.5"
              textAnchor="middle"
              fill="#6ee7b7"
              fontSize="9.5"
              fontWeight="700"
              fontFamily="var(--font-mono)"
            >
              ✓ {scene.responseLabel}
            </text>

            {/* ================= BUS: APP <-> SLIR ================= */}
            {/* Downward request beam */}
            <path d="M 180 90 L 180 146" fill="none" stroke="#2f384f" strokeWidth="2.5" />
            <path
              d="M 180 90 L 180 146"
              fill="none"
              stroke="#22d3ee"
              strokeOpacity="0.4"
              strokeWidth="1.5"
              className="slir-wire-dashes"
              pathLength={160}
            />
            <path
              d="M 180 90 L 180 146"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#slir-hero-neon-d)"
              className="slir-packet-fwd"
              pathLength={160}
            />
            <polygon points="175,140 180,148 185,140" fill="#22d3ee" />
            <text
              x="168"
              y="121"
              textAnchor="end"
              fill="#22d3ee"
              fontSize="9"
              fontWeight="600"
              fontFamily="var(--font-mono)"
            >
              POST /v1 (active-model)
            </text>

            {/* Upward streamed response beam */}
            <path d="M 360 146 L 360 90" fill="none" stroke="#2f384f" strokeWidth="2.5" />
            <path
              d="M 360 146 L 360 90"
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#slir-hero-neon-d)"
              className="slir-packet-fwd"
              pathLength={160}
            />
            <polygon points="355,98 360,90 365,98" fill="#10b981" />
            <text
              x="372"
              y="121"
              fill="#10b981"
              fontSize="9"
              fontWeight="600"
              fontFamily="var(--font-mono)"
            >
              streamed 200 OK
            </text>

            {/* ================= 2. SLIR RUNTIME GATEWAY HUB ================= */}
            <rect
              x="16"
              y="146"
              width="508"
              height="126"
              rx="12"
              fill="#11141d"
              stroke="#f97316"
              strokeOpacity="0.65"
              strokeWidth="1.5"
            />
            <text
              x="28"
              y="167"
              fill="#f8fafc"
              fontSize="11.5"
              fontWeight="800"
              fontFamily="var(--font-sans)"
            >
              2 · SLIR RUNTIME SWITCHER
            </text>
            <rect x="336" y="154" width="176" height="18" rx="4" fill="#f97316" fillOpacity="0.16" />
            <text
              x="424"
              y="166"
              textAnchor="middle"
              fill="#fb923c"
              fontSize="8.5"
              fontWeight="700"
              fontFamily="var(--font-mono)"
            >
              {scene.actionBadge}
            </text>

            {/* 3 Clickable Route Selector Slots inside SLIR (Centers: 98, 270, 442) */}
            <g className="cursor-pointer" onClick={() => selectScene(0)}>
              <rect
                x="26"
                y="179"
                width="144"
                height="48"
                rx="7"
                fill={scene.activeTarget === 'ollama' ? '#10b981' : '#090b10'}
                fillOpacity={scene.activeTarget === 'ollama' ? '0.15' : '0.85'}
                stroke={scene.activeTarget === 'ollama' ? '#10b981' : '#1f2536'}
                strokeWidth={scene.activeTarget === 'ollama' ? '1.4' : '1'}
              />
              <circle cx="40" cy="197" r="3.5" fill={scene.activeTarget === 'ollama' ? '#10b981' : '#2f384f'} />
              <text
                x="50"
                y="200"
                fill={scene.activeTarget === 'ollama' ? '#f8fafc' : '#9aa6be'}
                fontSize="10"
                fontWeight="700"
                fontFamily="var(--font-mono)"
              >
                qwen2.5:7b
              </text>
              <text
                x="40"
                y="217"
                fill={scene.activeTarget === 'ollama' ? '#6ee7b7' : '#77839b'}
                fontSize="8.5"
                fontFamily="var(--font-mono)"
              >
                {isFailover ? 'Fallback target' : scene.activeTarget === 'ollama' ? 'Active · Local $0' : 'Local · Ollama'}
              </text>
            </g>

            <g className="cursor-pointer" onClick={() => selectScene(1)}>
              <rect
                x="198"
                y="179"
                width="144"
                height="48"
                rx="7"
                fill={scene.activeTarget === 'anthropic' ? '#a855f7' : '#090b10'}
                fillOpacity={scene.activeTarget === 'anthropic' ? '0.16' : '0.85'}
                stroke={scene.activeTarget === 'anthropic' ? '#a855f7' : '#1f2536'}
                strokeWidth={scene.activeTarget === 'anthropic' ? '1.4' : '1'}
              />
              <circle cx="212" cy="197" r="3.5" fill={scene.activeTarget === 'anthropic' ? '#a855f7' : '#2f384f'} />
              <text
                x="222"
                y="200"
                fill={scene.activeTarget === 'anthropic' ? '#f8fafc' : '#9aa6be'}
                fontSize="10"
                fontWeight="700"
                fontFamily="var(--font-mono)"
              >
                claude-sonnet-4
              </text>
              <text
                x="212"
                y="217"
                fill={scene.activeTarget === 'anthropic' ? '#d8b4fe' : '#77839b'}
                fontSize="8.5"
                fontFamily="var(--font-mono)"
              >
                {scene.activeTarget === 'anthropic' ? 'Active · Translated' : 'Cloud · Anthropic'}
              </text>
            </g>

            <g className="cursor-pointer" onClick={() => selectScene(2)}>
              <rect
                x="370"
                y="179"
                width="144"
                height="48"
                rx="7"
                fill={isFailover ? '#f43f5e' : '#090b10'}
                fillOpacity={isFailover ? '0.15' : '0.85'}
                stroke={isFailover ? '#f43f5e' : '#1f2536'}
                strokeWidth={isFailover ? '1.4' : '1'}
              />
              <circle cx="384" cy="197" r="3.5" fill={isFailover ? '#f43f5e' : '#2f384f'} />
              <text
                x="394"
                y="200"
                fill={isFailover ? '#fda4af' : '#9aa6be'}
                fontSize="10"
                fontWeight="700"
                fontFamily="var(--font-mono)"
              >
                gpt-4o-mini
              </text>
              <text
                x="384"
                y="217"
                fill={isFailover ? '#fda4af' : '#77839b'}
                fontSize="8.5"
                fontFamily="var(--font-mono)"
              >
                {isFailover ? 'HTTP 429 caught!' : 'Cloud · OpenAI'}
              </text>
            </g>

            {/* Telemetry Bar inside SLIR Hub */}
            <rect x="26" y="236" width="488" height="26" rx="5" fill="#090b10" stroke="#1f2536" strokeWidth="1" />
            <text x="36" y="252.5" fill="#fb923c" fontSize="8.5" fontWeight="700" fontFamily="var(--font-mono)">
              SQLite WAL · {scene.wireLabel}
            </text>
            <text x="504" y="252.5" textAnchor="end" fill="#9aa6be" fontSize="8.5" fontFamily="var(--font-mono)">
              {scene.telemetry}
            </text>

            {/* ================= DOWNSTREAM PROVIDER WIRES ================= */}
            <line x1="98" y1="272" x2="98" y2="326" stroke="#1f2536" strokeWidth="2.5" />
            <line x1="270" y1="272" x2="270" y2="326" stroke="#1f2536" strokeWidth="2.5" />
            <line x1="442" y1="272" x2="442" y2="326" stroke="#1f2536" strokeWidth="2.5" />

            {scene.activeTarget === 'ollama' && (
              <>
                <path
                  d="M 98 272 L 98 326"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="url(#slir-hero-neon-d)"
                  className="slir-packet-fwd"
                  pathLength={160}
                />
                <polygon points="93,320 98,328 103,320" fill="#10b981" />
              </>
            )}

            {scene.activeTarget === 'anthropic' && (
              <>
                <path
                  d="M 270 272 L 270 326"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="url(#slir-hero-neon-d)"
                  className="slir-packet-fwd"
                  pathLength={160}
                />
                <polygon points="265,320 270,328 275,320" fill="#a855f7" />
                <rect x="228" y="291" width="84" height="16" rx="4" fill="#11141d" stroke="#a855f7" strokeWidth="0.9" />
                <text x="270" y="302" textAnchor="middle" fill="#d8b4fe" fontSize="8.5" fontWeight="700" fontFamily="var(--font-mono)">
                  /v1/messages
                </text>
              </>
            )}

            {isFailover && (
              <>
                <path
                  d="M 442 272 L 442 326"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2.2"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 442 272 C 442 302, 98 296, 98 326"
                  fill="none"
                  stroke="#10b981"
                  strokeOpacity="0.45"
                  strokeWidth="2"
                  className="slir-wire-dashes"
                  pathLength={160}
                />
                <path
                  d="M 442 272 C 442 302, 98 296, 98 326"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  filter="url(#slir-hero-neon-d)"
                  className="slir-packet-fwd"
                  pathLength={160}
                />
                <rect x="404" y="291" width="76" height="16" rx="4" fill="#11141d" stroke="#f43f5e" strokeWidth="0.9" />
                <text x="442" y="302" textAnchor="middle" fill="#fda4af" fontSize="8.5" fontWeight="700" fontFamily="var(--font-mono)">
                  HTTP 429
                </text>
                <rect x="226" y="291" width="88" height="16" rx="4" fill="#11141d" stroke="#10b981" strokeWidth="0.9" />
                <text x="270" y="302" textAnchor="middle" fill="#6ee7b7" fontSize="8.5" fontWeight="700" fontFamily="var(--font-mono)">
                  ← FAILOVER OK
                </text>
              </>
            )}

            {/* ================= 3. UPSTREAM RUNTIMES (BOTTOM) ================= */}
            {/* Ollama */}
            <g className="cursor-pointer" onClick={() => selectScene(0)}>
              <rect
                x="16"
                y="326"
                width="162"
                height="76"
                rx="10"
                fill="#11141d"
                stroke={scene.activeTarget === 'ollama' ? '#10b981' : '#1f2536'}
                strokeWidth={scene.activeTarget === 'ollama' ? '1.6' : '1'}
              />
              <text x="97" y="350" textAnchor="middle" fill="#f8fafc" fontSize="11.5" fontWeight="700" fontFamily="var(--font-sans)">
                Ollama (Local)
              </text>
              <text x="97" y="367" textAnchor="middle" fill="#77839b" fontSize="9.5" fontFamily="var(--font-mono)">
                :11434 · /api/chat
              </text>
              <rect x="50" y="376" width="94" height="17" rx="4" fill="#10b981" fillOpacity="0.16" />
              <text x="97" y="387.5" textAnchor="middle" fill="#10b981" fontSize="8.5" fontWeight="700" fontFamily="var(--font-mono)">
                {isFailover ? 'FALLBACK OK' : '$0 LOCAL'}
              </text>
            </g>

            {/* Anthropic */}
            <g className="cursor-pointer" onClick={() => selectScene(1)}>
              <rect
                x="190"
                y="326"
                width="160"
                height="76"
                rx="10"
                fill="#11141d"
                stroke={scene.activeTarget === 'anthropic' ? '#a855f7' : '#1f2536'}
                strokeWidth={scene.activeTarget === 'anthropic' ? '1.6' : '1'}
              />
              <text x="270" y="350" textAnchor="middle" fill="#f8fafc" fontSize="11.5" fontWeight="700" fontFamily="var(--font-sans)">
                Anthropic Claude
              </text>
              <text x="270" y="367" textAnchor="middle" fill="#77839b" fontSize="9.5" fontFamily="var(--font-mono)">
                /v1/messages API
              </text>
              <rect x="223" y="376" width="94" height="17" rx="4" fill="#a855f7" fillOpacity="0.16" />
              <text x="270" y="387.5" textAnchor="middle" fill="#c084fc" fontSize="8.5" fontWeight="700" fontFamily="var(--font-mono)">
                TRANSLATED
              </text>
            </g>

            {/* OpenAI */}
            <g className="cursor-pointer" onClick={() => selectScene(2)}>
              <rect
                x="362"
                y="326"
                width="162"
                height="76"
                rx="10"
                fill="#11141d"
                stroke={isFailover ? '#f43f5e' : '#1f2536'}
                strokeWidth={isFailover ? '1.6' : '1'}
              />
              <text
                x="443"
                y="350"
                textAnchor="middle"
                fill={isFailover ? '#fda4af' : '#f8fafc'}
                fontSize="11.5"
                fontWeight="700"
                fontFamily="var(--font-sans)"
              >
                OpenAI / Groq
              </text>
              <text x="443" y="367" textAnchor="middle" fill="#77839b" fontSize="9.5" fontFamily="var(--font-mono)">
                cloud /v1/chat
              </text>
              <rect
                x="396"
                y="376"
                width="94"
                height="17"
                rx="4"
                fill={isFailover ? '#f43f5e' : '#22d3ee'}
                fillOpacity="0.16"
              />
              <text
                x="443"
                y="387.5"
                textAnchor="middle"
                fill={isFailover ? '#fda4af' : '#22d3ee'}
                fontSize="8.5"
                fontWeight="700"
                fontFamily="var(--font-mono)"
              >
                {isFailover ? '429 QUOTA' : 'CLOUD /v1'}
              </text>
            </g>
          </svg>

          {/* Mobile Portrait SVG (< sm) */}
          <svg
            viewBox="0 0 360 426"
            className="block h-auto w-full select-none sm:hidden"
            role="img"
            aria-label={`Mobile architecture showing ${scene.title}: ${scene.caption}`}
          >
            <defs>
              <pattern id="slir-hero-grid-m" width="24" height="24" patternUnits="userSpaceOnUse">
                <path
                  d="M 24 0 L 0 0 0 24"
                  fill="none"
                  stroke="#1f2536"
                  strokeWidth="0.7"
                  strokeOpacity="0.45"
                />
              </pattern>
              <filter id="slir-hero-neon-m" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect x="0" y="0" width="360" height="426" fill="url(#slir-hero-grid-m)" rx="8" />

            {/* Top: Client App */}
            <rect x="14" y="12" width="332" height="78" rx="10" fill="#11141d" stroke="#2f384f" strokeWidth="1.2" />
            <text x="26" y="32" fill="#77839b" fontSize="9.5" fontWeight="700" fontFamily="var(--font-mono)">
              YOUR APP · UNCHANGED
            </text>
            <rect x="256" y="19" width="78" height="18" rx="4" fill="#10b981" fillOpacity="0.16" />
            <text x="295" y="31" textAnchor="middle" fill="#10b981" fontSize="8.5" fontWeight="700" fontFamily="var(--font-mono)">
              0 RESTARTS
            </text>
            <text x="26" y="54" fill="#9aa6be" fontSize="11" fontFamily="var(--font-mono)">
              model: <tspan fill="#fb923c" fontWeight="700">&quot;active-model&quot;</tspan>
            </text>
            <text x="26" y="75" fill="#10b981" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">
              ✓ {scene.responseLabel}
            </text>

            {/* Vertical Bus Top -> Middle */}
            <path d="M 156 90 L 156 136" fill="none" stroke="#2f384f" strokeWidth="2.5" />
            <path
              d="M 156 90 L 156 136"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="3.2"
              strokeLinecap="round"
              filter="url(#slir-hero-neon-m)"
              className="slir-packet-fwd"
              pathLength={160}
            />
            <text x="144" y="117" textAnchor="end" fill="#22d3ee" fontSize="9" fontWeight="600" fontFamily="var(--font-mono)">
              POST /v1
            </text>

            <path d="M 204 136 L 204 90" fill="none" stroke="#2f384f" strokeWidth="2.5" />
            <path
              d="M 204 136 L 204 90"
              fill="none"
              stroke="#10b981"
              strokeWidth="3.2"
              strokeLinecap="round"
              filter="url(#slir-hero-neon-m)"
              className="slir-packet-fwd"
              pathLength={160}
            />
            <text x="216" y="117" fill="#10b981" fontSize="9" fontWeight="600" fontFamily="var(--font-mono)">
              200 stream
            </text>

            {/* Middle: SLIR Switcher */}
            <rect
              x="14"
              y="136"
              width="332"
              height="116"
              rx="12"
              fill="#11141d"
              stroke="#f97316"
              strokeOpacity="0.65"
              strokeWidth="1.4"
            />
            <text x="28" y="159" fill="#f8fafc" fontSize="12" fontWeight="800" fontFamily="var(--font-sans)">
              SLIR RUNTIME SWITCHER
            </text>
            <rect x="280" y="146" width="52" height="17" rx="4" fill="#f97316" fillOpacity="0.18" />
            <text x="306" y="157.5" textAnchor="middle" fill="#fb923c" fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">
              :4101
            </text>

            <rect
              x="28"
              y="170"
              width="304"
              height="36"
              rx="6"
              fill={activeColor}
              fillOpacity="0.14"
              stroke={activeColor}
              strokeWidth="1.1"
            />
            <text x="38" y="192" fill="#f8fafc" fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">
              {scene.wireLabel}
            </text>
            <text x="28" y="226" fill="#f97316" fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">
              {scene.actionBadge}
            </text>
            <text x="28" y="241" fill="#9aa6be" fontSize="9" fontFamily="var(--font-mono)">
              {scene.telemetry}
            </text>

            {/* Branches Middle -> Bottom */}
            <path d="M 180 252 C 180 282, 66 282, 66 314" fill="none" stroke="#1f2536" strokeWidth="2.5" />
            <path d="M 180 252 L 180 314" fill="none" stroke="#1f2536" strokeWidth="2.5" />
            <path d="M 180 252 C 180 282, 294 282, 294 314" fill="none" stroke="#1f2536" strokeWidth="2.5" />

            {scene.activeTarget === 'ollama' && (
              <path
                d="M 180 252 C 180 282, 66 282, 66 314"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.2"
                strokeLinecap="round"
                filter="url(#slir-hero-neon-m)"
                className="slir-packet-fwd"
                pathLength={160}
              />
            )}
            {scene.activeTarget === 'anthropic' && (
              <path
                d="M 180 252 L 180 314"
                fill="none"
                stroke="#a855f7"
                strokeWidth="3.2"
                strokeLinecap="round"
                filter="url(#slir-hero-neon-m)"
                className="slir-packet-fwd"
                pathLength={160}
              />
            )}
            {isFailover && (
              <>
                <path
                  d="M 180 252 C 180 282, 294 282, 294 314"
                  fill="none"
                  stroke="#f43f5e"
                  strokeOpacity="0.6"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <rect x="242" y="274" width="60" height="16" rx="3" fill="#f43f5e" fillOpacity="0.26" />
                <text x="272" y="285" textAnchor="middle" fill="#fda4af" fontSize="8.5" fontWeight="700" fontFamily="var(--font-mono)">
                  429 ERR
                </text>
              </>
            )}

            {/* Bottom 3 Provider Cards */}
            <g className="cursor-pointer" onClick={() => selectScene(0)}>
              <rect
                x="14"
                y="314"
                width="104"
                height="98"
                rx="9"
                fill="#11141d"
                stroke={scene.activeTarget === 'ollama' ? '#10b981' : '#1f2536'}
                strokeWidth={scene.activeTarget === 'ollama' ? '1.5' : '1'}
              />
              <text x="66" y="339" textAnchor="middle" fill="#f8fafc" fontSize="11.5" fontWeight="700" fontFamily="var(--font-sans)">
                Ollama
              </text>
              <text x="66" y="357" textAnchor="middle" fill="#9aa6be" fontSize="9.5" fontFamily="var(--font-mono)">
                qwen2.5:7b
              </text>
              <rect x="24" y="373" width="84" height="20" rx="4" fill="#10b981" fillOpacity="0.16" />
              <text x="66" y="386.5" textAnchor="middle" fill="#10b981" fontSize="8.5" fontWeight="700" fontFamily="var(--font-mono)">
                {isFailover ? 'FALLBACK OK' : '$0 LOCAL'}
              </text>
            </g>

            <g className="cursor-pointer" onClick={() => selectScene(1)}>
              <rect
                x="128"
                y="314"
                width="104"
                height="98"
                rx="9"
                fill="#11141d"
                stroke={scene.activeTarget === 'anthropic' ? '#a855f7' : '#1f2536'}
                strokeWidth={scene.activeTarget === 'anthropic' ? '1.5' : '1'}
              />
              <text x="180" y="339" textAnchor="middle" fill="#f8fafc" fontSize="11.5" fontWeight="700" fontFamily="var(--font-sans)">
                Anthropic
              </text>
              <text x="180" y="357" textAnchor="middle" fill="#9aa6be" fontSize="9.5" fontFamily="var(--font-mono)">
                claude-4
              </text>
              <rect x="138" y="373" width="84" height="20" rx="4" fill="#a855f7" fillOpacity="0.16" />
              <text x="180" y="386.5" textAnchor="middle" fill="#c084fc" fontSize="8.5" fontWeight="700" fontFamily="var(--font-mono)">
                MESSAGES
              </text>
            </g>

            <g className="cursor-pointer" onClick={() => selectScene(2)}>
              <rect
                x="242"
                y="314"
                width="104"
                height="98"
                rx="9"
                fill="#11141d"
                stroke={isFailover ? '#f43f5e' : '#1f2536'}
                strokeWidth={isFailover ? '1.5' : '1'}
              />
              <text x="294" y="339" textAnchor="middle" fill={isFailover ? '#fda4af' : '#f8fafc'} fontSize="11.5" fontWeight="700" fontFamily="var(--font-sans)">
                OpenAI
              </text>
              <text x="294" y="357" textAnchor="middle" fill="#9aa6be" fontSize="9.5" fontFamily="var(--font-mono)">
                gpt-4o-mini
              </text>
              <rect
                x="252"
                y="373"
                width="84"
                height="20"
                rx="4"
                fill={isFailover ? '#f43f5e' : '#22d3ee'}
                fillOpacity="0.16"
              />
              <text
                x="294"
                y="386.5"
                textAnchor="middle"
                fill={isFailover ? '#fda4af' : '#22d3ee'}
                fontSize="8.5"
                fontWeight="700"
                fontFamily="var(--font-mono)"
              >
                {isFailover ? '429 LIMIT' : 'CLOUD /v1'}
              </text>
            </g>
          </svg>
        </div>

        {/* Explainer Caption */}
        <div className="border-t border-line bg-surface px-4 py-2.5 text-[11.5px] leading-relaxed text-ink-dim">
          <span className="mr-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-accent-bright">
            {scene.step} · {scene.title}:
          </span>
          {scene.caption}
        </div>
      </div>
    </div>
  );
}
