'use client';

import React, { useState } from 'react';
import { CopyButton } from './CopyButton';

export interface HighlightedSnippet {
  key: string;
  label: string;
  code: string;
  html: string;
}

export function CodeTabsClient({ snippets }: { snippets: HighlightedSnippet[] }) {
  const [activeKey, setActiveKey] = useState(snippets[0]?.key || 'python');
  const activeSnippet = snippets.find((s) => s.key === activeKey) || snippets[0];

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const delta = event.key === 'ArrowRight' ? 1 : -1;
    const next = snippets[(index + delta + snippets.length) % snippets.length];
    if (next) {
      setActiveKey(next.key);
      document.getElementById(`tab-${next.key}`)?.focus();
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="overflow-hidden rounded-xl border border-line-strong bg-surface shadow-xl shadow-black/30">
        <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2">
          <div role="tablist" aria-label="Code examples" className="flex flex-wrap gap-1">
            {snippets.map((snippet, index) => (
              <button
                key={snippet.key}
                type="button"
                role="tab"
                id={`tab-${snippet.key}`}
                aria-controls={`panel-${snippet.key}`}
                aria-selected={activeKey === snippet.key}
                onClick={() => setActiveKey(snippet.key)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="cursor-pointer rounded-md px-2.5 py-1 font-mono text-[11px] text-ink-dim transition-colors hover:text-ink aria-selected:bg-raised aria-selected:text-ink"
              >
                {snippet.label}
              </button>
            ))}
          </div>
          {activeSnippet && <CopyButton text={activeSnippet.code} />}
        </div>

        {snippets.map((snippet) => (
          <div
            key={snippet.key}
            id={`panel-${snippet.key}`}
            role="tabpanel"
            aria-labelledby={`tab-${snippet.key}`}
            hidden={activeKey !== snippet.key}
            className="code-panel"
            dangerouslySetInnerHTML={{ __html: snippet.html }}
          />
        ))}
      </div>

      <p className="mt-5 text-center font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
        Checks <span className="text-ink-dim">X-SLIR-Telemetry: recorded</span> · Works with LangChain · LlamaIndex · Vercel AI SDK · Streaming &amp; Tool Calls
      </p>
    </div>
  );
}
