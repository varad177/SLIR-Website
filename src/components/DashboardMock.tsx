'use client';

import React, { useEffect, useState } from 'react';
import { SlirPulseMark } from './SlirLogo';

interface SidebarItem {
  id: string;
  label: string;
  icon: 'grid' | 'apps' | 'cube' | 'list' | 'coin' | 'shuffle' | 'flask' | 'book';
  badge?: string;
  interactive: boolean;
}

const sidebarItems: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: 'grid', interactive: true },
  { id: 'apps', label: 'Applications', icon: 'apps', badge: '2', interactive: false },
  { id: 'models', label: 'Models', icon: 'cube', interactive: false },
  { id: 'logs', label: 'Request Logs', icon: 'list', interactive: true },
  { id: 'costs', label: 'Costs & Alerts', icon: 'coin', interactive: false },
  { id: 'failover', label: 'Failover', icon: 'shuffle', interactive: true },
  { id: 'playground', label: 'Playground', icon: 'flask', interactive: false },
  { id: 'help', label: 'User Manual', icon: 'book', interactive: false },
];

const modelOptions = [
  { id: 'nomic-embed-text:latest', provider: 'Ollama' },
  { id: 'google/gemma-4-31b-it', provider: 'Google' },
  { id: 'qwen2.5:7b', provider: 'Ollama' },
  { id: 'gpt-4o-mini', provider: 'OpenAI' },
  { id: 'claude-sonnet-4', provider: 'Anthropic' },
];

const providerByModel: Record<string, string> = {
  'nomic-embed-text:latest': 'Ollama',
  'google/gemma-4-31b-it': 'Google',
  'qwen2.5:7b': 'Ollama',
  'gpt-4o-mini': 'OpenAI',
  'claude-sonnet-4': 'Anthropic',
};

interface MockRow {
  id: string;
  time: string;
  app: string;
  model: string;
  latency: string;
  breakdown: string;
  tokens: number;
  isFailover?: boolean;
  isLive?: boolean;
}

const initialRows: MockRow[] = [
  {
    id: 'init-1',
    time: '16:56:41',
    app: 'Your App',
    model: 'gpt-4o-mini',
    latency: '980 ms',
    breakdown: 'L:0.00s PE:0.18s G:0.80s',
    tokens: 412,
    isFailover: true,
  },
  {
    id: 'init-2',
    time: '16:54:12',
    app: 'Your App',
    model: 'nomic-embed-text:latest',
    latency: '320 ms',
    breakdown: 'L:0.00s PE:0.04s G:0.28s',
    tokens: 612,
  },
  {
    id: 'init-3',
    time: '16:50:08',
    app: 'support-bot',
    model: 'google/gemma-4-31b-it',
    latency: '1.14s',
    breakdown: 'L:0.00s PE:0.20s G:0.94s',
    tokens: 940,
  },
];

export function DashboardMock() {
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'failover'>('overview');
  const [scope, setScope] = useState<string>('Your App');
  const [selectedModel, setSelectedModel] = useState<string>('nomic-embed-text:latest');
  const [isPinned, setIsPinned] = useState<boolean>(true);
  const [timeframe, setTimeframe] = useState<'15m' | '24h' | '7d'>('24h');
  const [reqTotal, setReqTotal] = useState<number>(6);
  const [reqOk, setReqOk] = useState<number>(5);
  const [tokTotal, setTokTotal] = useState<number>(4820);
  const [spendTotal, setSpendTotal] = useState<number>(0.0042);
  const [rows, setRows] = useState<MockRow[]>(initialRows);

  const appendRow = (opts: {
    app?: string;
    model: string;
    tokens: number;
    latency: string;
    cost: number;
    isFailover?: boolean;
  }) => {
    const now = new Date().toTimeString().slice(0, 8);
    const appName = opts.app || (scope === 'all' ? 'Your App' : scope);

    setReqTotal((v) => v + 1);
    setReqOk((v) => v + 1);
    setTokTotal((v) => v + opts.tokens);
    setSpendTotal((v) => v + opts.cost);

    setRows((prev) => [
      {
        id: `live-${Date.now()}-${Math.random()}`,
        time: now,
        app: appName,
        model: opts.model,
        latency: opts.latency,
        breakdown: 'L:0.00s PE:0.14s G:0.28s',
        tokens: opts.tokens,
        isFailover: Boolean(opts.isFailover),
        isLive: !opts.isFailover,
      },
      ...prev.slice(0, 4),
    ]);
  };

  useEffect(() => {
    const onRoutePreview = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail?.model) {
        setSelectedModel(detail.model);
        setIsPinned(Boolean(detail.isPinned));
      }
    };
    const onLiveRequest = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail?.model) {
        appendRow({
          app: detail.app,
          model: detail.model,
          tokens: detail.tokens || 520,
          latency: detail.latency || '420 ms',
          cost: detail.cost || 0,
          isFailover: Boolean(detail.isFailover),
        });
      }
    };

    window.addEventListener('slir:route-preview', onRoutePreview);
    window.addEventListener('slir:live-request', onLiveRequest);
    return () => {
      window.removeEventListener('slir:route-preview', onRoutePreview);
      window.removeEventListener('slir:live-request', onLiveRequest);
    };
  });

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    setIsPinned(modelId !== 'google/gemma-4-31b-it');
  };

  const chartPath =
    timeframe === '15m'
      ? 'M0,38 L30,22 L70,10 L110,18 L160,8'
      : timeframe === '7d'
        ? 'M0,32 L30,18 L70,12 L110,20 L160,14'
        : 'M0,40 L25,12 L65,24 L105,36 L160,38';

  const breadcrumb =
    activeTab === 'logs' ? 'Request Logs' : activeTab === 'failover' ? 'Failover' : 'Overview';

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-accent/[0.045] blur-2xl"
        aria-hidden="true"
      />

      <div className="overflow-hidden rounded-xl border border-line-strong bg-night shadow-2xl shadow-black/75">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-line bg-[#06080c] px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-bad/75" />
            <span className="h-2.5 w-2.5 rounded-full bg-warn/75" />
            <span className="h-2.5 w-2.5 rounded-full bg-good/75" />
          </div>
          <div className="mx-auto flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1 font-mono text-[10.5px] text-ink-dim">
            <svg className="h-3 w-3 text-good" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            http://localhost:4100
          </div>
          <div className="hidden rounded border border-accent/35 bg-accent/15 px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider text-accent-bright sm:block">
            INTERACTIVE SANDBOX
          </div>
        </div>

        <div className="flex min-h-[540px] text-left">
          {/* Sidebar */}
          <aside className="hidden w-48 shrink-0 flex-col border-r border-line bg-[#080a0f] p-2.5 md:flex">
            <div className="flex items-center gap-2 px-1.5 pb-3 pt-1">
              <SlirPulseMark size={16} />
              <span className="text-[12px] font-extrabold tracking-[0.02em]">SLIR</span>
              <span className="rounded border border-good/30 bg-good/15 px-1.5 py-0.5 font-mono text-[7.5px] font-bold text-good">
                SWITCH RUNTIME
              </span>
            </div>

            <div className="mb-3 rounded-lg border border-line bg-surface/80 p-2">
              <label
                htmlFor="mock-scope-select"
                className="block font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-ink-faint"
              >
                ANALYTICS SCOPE
              </label>
              <select
                id="mock-scope-select"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="mt-1.5 w-full rounded border border-line-strong bg-night px-2 py-1 font-mono text-[10px] text-ink focus:border-accent focus:outline-none"
              >
                <option value="Your App">Your App</option>
                <option value="support-bot">support-bot</option>
                <option value="all">All applications</option>
              </select>
              <p className="mt-1 text-[8.5px] leading-tight text-ink-faint">
                Metrics and logs are filtered to this application.
              </p>
            </div>

            <nav className="space-y-0.5" aria-label="Interactive dashboard tabs">
              {sidebarItems.map((item) => {
                const pressed = item.id === activeTab;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={pressed}
                    onClick={() => {
                      if (item.id === 'overview' || item.id === 'logs' || item.id === 'failover') {
                        setActiveTab(item.id);
                      }
                    }}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] font-medium transition-colors ${
                      item.interactive
                        ? 'cursor-pointer text-ink-dim hover:bg-raised/60 hover:text-ink aria-pressed:bg-accent/15 aria-pressed:font-semibold aria-pressed:text-accent-bright'
                        : 'cursor-default text-ink-faint opacity-75'
                    }`}
                  >
                    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {item.icon === 'grid' && (<><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></>)}
                      {item.icon === 'apps' && (<><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>)}
                      {item.icon === 'cube' && (<><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /></>)}
                      {item.icon === 'list' && (<><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></>)}
                      {item.icon === 'coin' && (<><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /></>)}
                      {item.icon === 'shuffle' && <path d="M16 3h5v5M4 20 21 3M21 16v5h-5" />}
                      {item.icon === 'flask' && <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />}
                      {item.icon === 'book' && (<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>)}
                    </svg>
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto rounded bg-raised px-1.5 py-px font-mono text-[8.5px] text-ink-dim">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto space-y-1.5 border-t border-line pt-3 font-mono text-[9px]">
              <div className="text-[8px] uppercase tracking-[0.14em] text-ink-faint">GLOBAL FALLBACK</div>
              <div className="truncate font-semibold text-ink">google/gemma-4-31b-it</div>
              <div className="flex items-center gap-1.5 text-good">
                <span className="h-1.5 w-1.5 rounded-full bg-good" />
                Gateway :4101 Live
              </div>
              <div className="text-ink-faint">Prompts not retained</div>
            </div>
          </aside>

          {/* Main column */}
          <div className="min-w-0 flex-1 bg-night">
            {/* Mobile-only Brand + Scope + Navigation strip */}
            <div className="space-y-2.5 border-b border-line bg-[#080a0f] p-3 md:hidden">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <SlirPulseMark size={16} />
                  <span className="text-[12px] font-extrabold tracking-[0.02em]">SLIR</span>
                  <span className="rounded border border-good/30 bg-good/15 px-1.5 py-0.5 font-mono text-[8px] font-bold text-good">
                    SWITCH RUNTIME
                  </span>
                </div>
                <span className="flex items-center gap-1 font-mono text-[9px] text-good">
                  <span className="h-1.5 w-1.5 rounded-full bg-good" />
                  :4101 Live
                </span>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex min-w-0 flex-1 items-center gap-2 font-mono text-[9.5px] text-ink-faint">
                  <span className="shrink-0">SCOPE:</span>
                  <select
                    aria-label="Mobile analytics scope"
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="min-w-0 flex-1 rounded border border-line-strong bg-night px-2 py-1 text-[10.5px] text-ink focus:border-accent focus:outline-none"
                  >
                    <option value="Your App">Your App</option>
                    <option value="support-bot">support-bot</option>
                    <option value="all">All applications</option>
                  </select>
                </label>

                <div className="grid grid-cols-3 gap-1 rounded-md border border-line bg-surface p-0.5 font-mono text-[10px]">
                  {(['overview', 'logs', 'failover'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      aria-pressed={activeTab === tab}
                      onClick={() => setActiveTab(tab)}
                      className="cursor-pointer rounded px-2 py-1 capitalize text-ink-dim transition-colors aria-pressed:bg-accent/20 aria-pressed:font-semibold aria-pressed:text-accent-bright"
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-[#0b0e14] px-3.5 py-2.5 sm:px-4">
              <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-[11px] sm:gap-2">
                <span className="font-semibold text-ink-dim">SLIR</span>
                <span className="text-ink-faint">/</span>
                <strong className="text-ink">{breadcrumb}</strong>
                <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded border border-line bg-surface px-2 py-0.5 font-mono text-[9.5px] text-ink-dim">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="truncate">
                    Global: <strong className="text-ink">google/gemma-4-31b-it</strong>
                  </span>
                </span>
                <span className="hidden rounded border border-line bg-surface px-2 py-0.5 font-mono text-[9.5px] text-ink-dim sm:inline">
                  {scope === 'all' ? 'All applications' : scope}
                </span>
              </div>

              <div className="hidden items-center gap-2 font-mono text-[9.5px] md:flex">
                <span className="inline-flex items-center gap-1.5 font-semibold text-good">
                  <span className="h-1.5 w-1.5 rounded-full bg-good" />
                  GATEWAY LIVE
                </span>
              </div>
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-3 p-3.5 sm:p-4">
                <div className="relative overflow-hidden rounded-xl border border-line-strong bg-surface p-4">
                  <div className="routing-glow pointer-events-none absolute inset-0" aria-hidden="true" />
                  <div className="relative flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <div>
                      <div className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-ink-faint">
                        MODEL ROUTING
                      </div>
                      <div className="mt-1 text-[17px] font-bold tracking-tight text-ink">
                        {scope === 'all' ? 'Your App' : scope}
                      </div>
                      <p className="mt-0.5 text-[11px] text-ink-dim">
                        Requests sent with this application key are routed by the rule below.
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={
                            isPinned
                              ? 'inline-flex items-center gap-1.5 rounded border border-accent/40 bg-accent/15 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-accent-bright'
                              : 'inline-flex items-center gap-1.5 rounded border border-good/40 bg-good/15 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-good'
                          }
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${isPinned ? 'bg-accent' : 'bg-good'}`} />
                          {isPinned ? 'Pinned model' : 'Follow global'}
                        </span>
                        <span className="rounded border border-line-strong bg-night px-2 py-0.5 font-mono text-[10.5px] font-semibold text-ink">
                          {selectedModel}
                        </span>
                        <span className="font-mono text-[10px] text-ink-faint">
                          {providerByModel[selectedModel] || 'Cloud'}
                        </span>
                      </div>
                    </div>

                    <div className="w-full min-w-0 shrink-0 lg:w-auto">
                      <label
                        htmlFor="mock-model-select"
                        className="block font-mono text-[8.5px] uppercase tracking-[0.14em] text-ink-faint"
                      >
                        ROUTE THIS APPLICATION TO
                      </label>
                      <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-center">
                        <select
                          id="mock-model-select"
                          value={selectedModel}
                          onChange={(e) => handleModelChange(e.target.value)}
                          className="w-full min-w-0 rounded-md border border-line-strong bg-night px-2.5 py-1.5 font-mono text-[11px] text-ink focus:border-accent focus:outline-none sm:w-auto"
                        >
                          {modelOptions.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.id}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => handleModelChange('google/gemma-4-31b-it')}
                          className="w-full cursor-pointer rounded-md border border-line-strong bg-raised px-2.5 py-1.5 text-[10.5px] font-semibold text-ink transition-colors hover:border-accent/50 hover:text-accent-bright sm:w-auto"
                        >
                          Follow global
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="relative mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line/80 pt-3">
                    <div className="max-w-full break-all rounded border border-line bg-night px-2.5 py-1 font-mono text-[10px] text-ink-dim sm:break-normal">
                      http://localhost:4101/v1
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          appendRow({
                            model: selectedModel,
                            tokens: selectedModel.includes('claude')
                              ? 820
                              : selectedModel.includes('gpt')
                                ? 640
                                : 480,
                            latency: selectedModel.includes('nomic') ? '240 ms' : '690 ms',
                            cost: selectedModel.includes('claude')
                              ? 0.0028
                              : selectedModel.includes('gpt')
                                ? 0.0004
                                : 0,
                          })
                        }
                        className="cursor-pointer rounded border border-accent/40 bg-accent/15 px-2.5 py-1 font-mono text-[10px] font-semibold text-accent-bright transition-colors hover:bg-accent/25"
                      >
                        ⚡ Test route
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          appendRow({
                            model: 'gpt-4o-mini',
                            tokens: 412,
                            latency: '980 ms',
                            cost: 0.0004,
                            isFailover: true,
                          })
                        }
                        className="cursor-pointer rounded border border-line-strong bg-night px-2.5 py-1 font-mono text-[10px] text-ink-dim transition-colors hover:border-accent/40 hover:text-ink"
                      >
                        Trigger 429 failover
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('failover')}
                        className="cursor-pointer font-mono text-[10px] font-semibold text-accent-bright hover:underline"
                      >
                        Manage failover ›
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface px-3.5 py-2">
                  <div className="flex flex-wrap items-center gap-3 font-mono text-[10px]">
                    <span className="font-bold text-ink">RUNTIME DEFAULTS</span>
                    <span className="text-ink-faint">CONTEXT</span>
                    <select aria-label="Default context window" defaultValue="16K" className="rounded border border-line-strong bg-night px-2 py-0.5 text-ink">
                      <option>16K</option>
                      <option>8K</option>
                      <option>4K</option>
                    </select>
                    <span className="text-ink-faint">TEMPERATURE</span>
                    <select aria-label="Default temperature" defaultValue="0.2 focused" className="rounded border border-line-strong bg-night px-2 py-0.5 text-ink">
                      <option>0.2 focused</option>
                      <option>0.7 balanced</option>
                      <option>1.0 creative</option>
                    </select>
                  </div>
                  <span className="text-[10px] text-ink-faint">
                    Applies to requests that do not send their own values.
                  </span>
                </div>

                {/* 5 KPI Cards */}
                <div className="grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2 lg:grid-cols-5">
                  <div className="min-w-0 rounded-lg border border-line bg-surface p-3">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-mono text-[8.5px] uppercase text-ink-faint">REQUESTS</span>
                      <span className="rounded bg-good/15 px-1.5 py-0.5 font-mono text-[8px] font-semibold text-good">
                        {((reqOk / reqTotal) * 100).toFixed(1)}% success
                      </span>
                    </div>
                    <div className="mt-2 font-mono text-[22px] font-bold leading-none text-ink">
                      {reqTotal.toLocaleString()}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-1 font-mono text-[8.5px] text-ink-faint">
                      <span>{reqOk} succeeded</span>
                      <span className="text-bad">1 failed</span>
                    </div>
                  </div>

                  <div className="min-w-0 rounded-lg border border-line bg-surface p-3">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-mono text-[8.5px] uppercase text-ink-faint">TOKENS</span>
                      <span className="rounded bg-raised px-1.5 py-0.5 font-mono text-[8px] text-ink-dim">91% in</span>
                    </div>
                    <div className="mt-2 font-mono text-[22px] font-bold leading-none text-ink">
                      {tokTotal.toLocaleString()}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-1 font-mono text-[8.5px] text-ink-faint">
                      <span>4,380 prompt</span>
                      <span>440 comp.</span>
                    </div>
                  </div>

                  <div className="min-w-0 rounded-lg border border-line bg-surface p-3">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-mono text-[8.5px] uppercase text-ink-faint">TOKEN VOLUME</span>
                      <div className="flex gap-0.5 font-mono text-[7.5px]">
                        {(['15m', '24h', '7d'] as const).map((tf) => (
                          <button
                            key={tf}
                            type="button"
                            aria-pressed={timeframe === tf}
                            onClick={() => setTimeframe(tf)}
                            className="cursor-pointer rounded px-1 py-0.5 text-ink-faint hover:text-ink aria-pressed:bg-accent aria-pressed:font-bold aria-pressed:text-night"
                          >
                            {tf}
                          </button>
                        ))}
                      </div>
                    </div>
                    <svg viewBox="0 0 160 44" className="mt-2 h-11 w-full overflow-visible" aria-hidden="true">
                      <defs>
                        <linearGradient id="slirPromptGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f97316" stopOpacity="0.38" />
                          <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                      <path d={`${chartPath} L160,44 L0,44 Z`} fill="url(#slirPromptGrad)" />
                      <path d={chartPath} fill="none" stroke="#f97316" strokeWidth="2" />
                      <path d="M0,42 L25,36 L65,37 L105,40 L160,41" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
                    </svg>
                  </div>

                  <div className="min-w-0 rounded-lg border border-line bg-surface p-3">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-mono text-[8.5px] uppercase text-ink-faint">PROMPT CACHE</span>
                      <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[8px] text-accent-bright">33% hit</span>
                    </div>
                    <div className="mt-2 font-mono text-[22px] font-bold leading-none text-ink">2</div>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-1 font-mono text-[8.5px] text-ink-faint">
                      <span>6 reported</span>
                      <span>L:0.04s</span>
                    </div>
                  </div>

                  <div className="min-w-0 rounded-lg border border-line bg-surface p-3 min-[360px]:col-span-2 lg:col-span-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-mono text-[8.5px] uppercase text-ink-faint">ESTIMATED SPEND</span>
                      <span className="rounded bg-good/15 px-1.5 py-0.5 font-mono text-[8px] text-good">tracked</span>
                    </div>
                    <div className="mt-2 font-mono text-[22px] font-bold leading-none text-ink">
                      ${spendTotal.toFixed(4)}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-1 font-mono text-[8.5px] text-ink-faint">
                      <span>$0.00/day</span>
                      <span>~$0.13/30d</span>
                    </div>
                  </div>
                </div>

                {/* Recent Requests */}
                <div className="overflow-hidden rounded-lg border border-line bg-surface">
                  <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
                    <div>
                      <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink-faint">LATEST ACTIVITY</div>
                      <div className="text-[11.5px] font-bold text-ink">RECENT REQUESTS</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('logs')}
                      className="cursor-pointer font-mono text-[10px] font-semibold text-accent-bright hover:underline"
                    >
                      Open logs ›
                    </button>
                  </div>
                  <div className="hidden overflow-x-auto sm:block">
                    <table className="w-full min-w-[540px] text-left">
                      <thead>
                        <tr className="font-mono text-[8px] uppercase tracking-[0.12em] text-ink-faint">
                          <th className="px-3.5 py-2 font-medium">TIME</th>
                          <th className="px-3.5 py-2 font-medium">APPLICATION</th>
                          <th className="px-3.5 py-2 font-medium">MODEL</th>
                          <th className="px-3.5 py-2 font-medium">STATUS</th>
                          <th className="px-3.5 py-2 font-medium">LATENCY BREAKDOWN</th>
                          <th className="px-3.5 py-2 text-right font-medium">TOKENS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line/60 font-mono text-[9.5px]">
                        {rows.map((row) => (
                          <tr key={row.id} className={row.isLive ? 'bg-accent/[0.06]' : ''}>
                            <td className="px-3.5 py-2 text-ink-dim">{row.time}</td>
                            <td className="px-3.5 py-2 text-ink">{row.app}</td>
                            <td className="px-3.5 py-2 text-ink">
                              {row.model}
                              {row.isFailover && (
                                <span className="ml-1 rounded border border-accent/40 bg-accent/15 px-1 py-px text-[8px] font-bold text-accent-bright">
                                  Failover
                                </span>
                              )}
                              {row.isLive && (
                                <span className="ml-1 rounded border border-good/30 bg-good/15 px-1 py-px text-[8px] font-bold text-good">
                                  Live
                                </span>
                              )}
                              {row.isFailover && (
                                <div className="text-[8px] text-ink-faint">
                                  from claude-sonnet-4 · Rate limit ·{' '}
                                  <button
                                    type="button"
                                    onClick={() => setActiveTab('logs')}
                                    className="cursor-pointer text-accent-bright hover:underline"
                                  >
                                    details ↗
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="px-3.5 py-2">
                              <span className="rounded bg-good/15 px-1.5 py-0.5 text-[8.5px] font-semibold text-good">
                                200
                              </span>
                            </td>
                            <td className="px-3.5 py-2 text-ink-dim">
                              {row.latency} <span className="text-ink-faint">{row.breakdown}</span>
                            </td>
                            <td className="px-3.5 py-2 text-right text-ink">{row.tokens}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile stacked cards */}
                  <div className="divide-y divide-line/60 font-mono text-[10px] sm:hidden">
                    {rows.map((row) => (
                      <div key={row.id} className={`space-y-1.5 p-3 ${row.isLive ? 'bg-accent/[0.06]' : ''}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate font-semibold text-ink">
                            {row.model}
                            {row.isFailover && (
                              <span className="ml-1.5 rounded border border-accent/40 bg-accent/15 px-1 py-px text-[8px] font-bold text-accent-bright">
                                Failover
                              </span>
                            )}
                            {row.isLive && (
                              <span className="ml-1.5 rounded border border-good/30 bg-good/15 px-1 py-px text-[8px] font-bold text-good">
                                Live
                              </span>
                            )}
                          </span>
                          <span className="shrink-0 rounded bg-good/15 px-1.5 py-0.5 text-[8.5px] font-semibold text-good">
                            200
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-ink-dim">
                          <span>{row.app} · {row.time}</span>
                          <span>{row.latency} · {row.tokens} tok</span>
                        </div>
                        {row.isFailover && (
                          <div className="text-[8.5px] text-ink-faint">
                            from claude-sonnet-4 · Rate limit ·{' '}
                            <button
                              type="button"
                              onClick={() => setActiveTab('logs')}
                              className="cursor-pointer text-accent-bright hover:underline"
                            >
                              details ↗
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="space-y-3 p-3.5 sm:p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-ink-faint">OBSERVABILITY</div>
                    <div className="text-[15px] font-bold">Request Logs &amp; Failover Trace Inspector</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className="cursor-pointer rounded border border-line-strong bg-surface px-2.5 py-1 font-mono text-[10px] text-ink-dim hover:text-ink"
                  >
                    ← Back to Overview
                  </button>
                </div>

                <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="min-w-0 rounded-lg border border-line bg-surface p-3 font-mono text-[10px]">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-1.5 border-b border-line pb-2 text-[9px] text-ink-faint">
                      <span>FILTER: FAILOVER TRIGGERED</span>
                      <span className="text-good">X-SLIR-Telemetry: recorded</span>
                    </div>
                    <div className="space-y-2">
                      <div className="rounded border border-accent/40 bg-accent/[0.08] p-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <strong className="text-ink">gpt-4o-mini</strong>
                          <span className="rounded bg-good/15 px-1.5 py-0.5 text-[8.5px] text-good">Failover · 200</span>
                        </div>
                        <div className="mt-1 text-[9px] text-ink-dim">from claude-sonnet-4 · Rate limit · 1 fallback</div>
                      </div>
                      <div className="rounded border border-line bg-night/50 p-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <strong className="text-ink">nomic-embed-text:latest</strong>
                          <span className="rounded bg-good/15 px-1.5 py-0.5 text-[8.5px] text-good">Direct · 200</span>
                        </div>
                        <div className="mt-1 text-[9px] text-ink-faint">Your App · Ollama local · 320 ms</div>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 rounded-lg border border-line bg-surface p-3.5 font-mono text-[10px]">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-line pb-2">
                      <strong className="text-[11px] text-ink">Failover routing &amp; attempt log</strong>
                      <span className="text-[9px] text-ink-faint">1 fallback</span>
                    </div>
                    <div className="mt-2.5 grid grid-cols-1 gap-2 text-[9.5px] sm:grid-cols-2">
                      <div className="min-w-0 rounded bg-night/60 p-2">
                        <span className="block text-[8px] text-ink-faint">PRIMARY</span>
                        <strong className="break-all text-ink sm:break-normal">claude-sonnet-4</strong>
                      </div>
                      <div className="min-w-0 rounded bg-night/60 p-2">
                        <span className="block text-[8px] text-ink-faint">SERVED BY</span>
                        <strong className="break-all text-good sm:break-normal">gpt-4o-mini</strong>
                      </div>
                    </div>
                    <div className="mt-2.5 space-y-2">
                      <div className="rounded border border-line border-l-2 border-l-bad bg-night/70 p-2">
                        <div className="flex flex-wrap items-center justify-between gap-1.5 text-[9.5px]">
                          <span className="font-semibold text-ink">
                            1 · claude-sonnet-4 <span className="text-ink-faint">(anthropic)</span>
                          </span>
                          <span className="text-bad">Rate limit · HTTP 429 · 110 ms</span>
                        </div>
                        <div className="mt-1.5 break-words rounded border border-line bg-surface px-2 py-1 text-[9px] text-ink-dim">
                          429 rate_limit_error: Quota exceeded on tier 1 — switching to backup model
                        </div>
                      </div>
                      <div className="rounded border border-line border-l-2 border-l-good bg-night/70 p-2">
                        <div className="flex flex-wrap items-center justify-between gap-1.5 text-[9.5px]">
                          <span className="font-semibold text-ink">
                            2 · gpt-4o-mini <span className="text-ink-faint">(openai)</span>
                          </span>
                          <span className="text-good">Success · HTTP 200 · 870 ms</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'failover' && (
              <div className="space-y-3 p-3.5 sm:p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-ink-faint">RESILIENCE</div>
                    <div className="text-[15px] font-bold">Automatic Failover Chain &amp; Live Attempt Logs</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className="cursor-pointer rounded border border-line-strong bg-surface px-2.5 py-1 font-mono text-[10px] text-ink-dim hover:text-ink"
                  >
                    ← Back to Overview
                  </button>
                </div>

                <div className="rounded-lg border border-line bg-surface p-3.5">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                    <div className="rounded border border-cyan/40 bg-night px-2.5 py-1.5">
                      <span className="block text-[7.5px] uppercase text-ink-faint">Primary</span>
                      <strong className="text-ink">claude-sonnet-4</strong>
                    </div>
                    <span className="text-ink-faint">→</span>
                    <div className="rounded border border-line-strong bg-night px-2.5 py-1.5">
                      <span className="block text-[7.5px] uppercase text-ink-faint">Fallback 1</span>
                      <strong className="text-ink">gpt-4o-mini</strong>
                    </div>
                    <span className="text-ink-faint">→</span>
                    <div className="rounded border border-line-strong bg-night px-2.5 py-1.5">
                      <span className="block text-[7.5px] uppercase text-ink-faint">Fallback 2</span>
                      <strong className="text-ink">qwen2.5:7b</strong>
                    </div>
                    <span className="text-ink-faint">→</span>
                    <div className="rounded border border-bad/40 bg-bad/10 px-2.5 py-1.5">
                      <span className="block text-[7.5px] uppercase text-bad">If all fail</span>
                      <strong className="text-ink">Log full trace</strong>
                    </div>
                  </div>
                </div>

                <div className="min-w-0 rounded-lg border border-line bg-surface p-3.5 font-mono text-[10px]">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-[11px] text-ink">Recorded Failover Attempt Logs</strong>
                    <button
                      type="button"
                      onClick={() =>
                        appendRow({
                          model: 'gpt-4o-mini',
                          tokens: 412,
                          latency: '980 ms',
                          cost: 0.0004,
                          isFailover: true,
                        })
                      }
                      className="cursor-pointer rounded border border-accent/40 bg-accent/15 px-2 py-0.5 text-[9px] font-semibold text-accent-bright hover:bg-accent/25"
                    >
                      ⚡ Simulate new 429
                    </button>
                  </div>
                  <div className="min-w-0 rounded border border-line bg-night/70 p-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="rounded bg-good/15 px-1.5 py-0.5 text-[8.5px] font-semibold text-good">Failover succeeded</span>
                      <span className="break-words text-[9px] text-ink-faint">req_f83a9c · HTTP 200 · 980 ms</span>
                    </div>
                    <div className="mt-1.5 break-words text-[10px] text-ink-dim">
                      claude-sonnet-4 <span className="text-accent-bright">→</span> <strong className="text-ink">gpt-4o-mini</strong>
                    </div>
                    <div className="mt-2 break-words rounded border border-line border-l-2 border-l-bad bg-surface p-2 text-[9px] text-ink-dim">
                      Attempt 1 failed: upstream returned HTTP 429 (&quot;You exceeded your current quota&quot;). Fallback Attempt 2 succeeded in 870ms.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
