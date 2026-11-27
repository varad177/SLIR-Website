import React from 'react';
import { codeToHtml } from 'shiki';
import { CodeTabsClient, type HighlightedSnippet } from './CodeTabsClient';

const rawSnippets = [
  {
    key: 'python',
    label: 'Python (OpenAI)',
    lang: 'python',
    code: `from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:4101/v1",
    api_key="mp_live_your_application_key",  # records telemetry, failover & budgets
)

response = client.chat.completions.create(
    model="active-model",  # hot-swappable from the SLIR dashboard
    messages=[{"role": "user", "content": "Hello SLIR!"}],
)

print(response.choices[0].message.content)`,
  },
  {
    key: 'anthropic',
    label: 'Anthropic SDK',
    lang: 'python',
    code: `from anthropic import Anthropic

client = Anthropic(
    base_url="http://localhost:4101",
    api_key="mp_live_your_application_key",  # sent as x-api-key
)

message = client.messages.create(
    model="active-model",  # routes to Anthropic OR any local/OpenAI model
    max_tokens=256,
    messages=[{"role": "user", "content": "Summarize latency telemetry."}],
)

print(message.content[0].text)`,
  },
  {
    key: 'node',
    label: 'Node.js / TS',
    lang: 'ts',
    code: `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "http://localhost:4101/v1",
  apiKey: "mp_live_your_application_key",
});

const response = await client.chat.completions.create({
  model: "active-model",
  messages: [{ role: "user", content: "Status check." }],
});

console.log(response.choices[0].message.content);`,
  },
  {
    key: 'csharp',
    label: 'C# / .NET',
    lang: 'csharp',
    code: `using System.Net.Http.Headers;
using System.Net.Http.Json;

var client = new HttpClient { BaseAddress = new Uri("http://localhost:4101/v1/") };
client.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", "mp_live_your_application_key");

var body = new {
    model = "active-model", // resolved by SLIR at runtime
    messages = new[] {
        new { role = "user", content = "Analyze this telemetry anomaly." }
    }
};

var response = await client.PostAsJsonAsync("chat/completions", body);
Console.WriteLine(await response.Content.ReadAsStringAsync());`,
  },
  {
    key: 'curl',
    label: 'cURL',
    lang: 'bash',
    code: `curl http://localhost:4101/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer mp_live_your_application_key" \\
  -d '{
    "model": "active-model",
    "messages": [
      { "role": "user", "content": "Summarize this log in one line." }
    ]
  }'`,
  },
];

export async function CodeExamples() {
  const highlighted: HighlightedSnippet[] = await Promise.all(
    rawSnippets.map(async (item) => ({
      key: item.key,
      label: item.label,
      code: item.code,
      html: await codeToHtml(item.code, {
        lang: item.lang,
        theme: 'github-dark-default',
      }),
    }))
  );

  return (
    <section id="code" className="section scroll-mt-20">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">03 — Integration</p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-[2.6rem] md:leading-[1.1]">
            Keep your OpenAI or Anthropic SDK.
          </h2>
          <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ink-dim">
            Point any SDK at port <code className="font-mono text-ink">4101</code> with an
            application key (<code className="font-mono text-ink">mp_live_...</code>) from the
            dashboard. SLIR handles streaming, tool calls, schema translation, failover, and
            budget enforcement.
          </p>
        </div>

        <CodeTabsClient snippets={highlighted} />
      </div>
    </section>
  );
}
