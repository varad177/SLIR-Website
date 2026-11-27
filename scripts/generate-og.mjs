import sharp from 'sharp';

const ogSvg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="-10%" r="65%">
      <stop offset="0%" stop-color="#f97316" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#f97316" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#2f384f" stroke-opacity="0.22" stroke-width="1"/>
    </pattern>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#090b10" stop-opacity="0"/>
      <stop offset="100%" stop-color="#090b10" stop-opacity="0.90"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="#090b10"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="420" fill="url(#glow)"/>
  <rect y="360" width="1200" height="270" fill="url(#fade)"/>

  <g transform="translate(72, 54)">
    <circle cx="18" cy="24" r="14" fill="none" stroke="#f97316" stroke-width="2.5" stroke-opacity="0.4"/>
    <circle cx="18" cy="24" r="8" fill="#f97316"/>
    <circle cx="18" cy="24" r="3.2" fill="#ffffff"/>
    <text x="46" y="36" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#f8fafc">SLIR</text>
    <rect x="134" y="13" width="122" height="24" rx="5" fill="#10b981" fill-opacity="0.14" stroke="#10b981" stroke-opacity="0.4"/>
    <text x="195" y="29" text-anchor="middle" font-family="Consolas, monospace" font-size="11" font-weight="700" fill="#34d399">SWITCH RUNTIME</text>
    <rect x="268" y="13" width="64" height="24" rx="5" fill="none" stroke="#2f384f"/>
    <text x="300" y="29" text-anchor="middle" font-family="Consolas, monospace" font-size="12" fill="#94a3b8">v1.0.0</text>
  </g>

  <text x="72" y="190" font-family="Consolas, monospace" font-size="14" letter-spacing="3" fill="#f97316">SWITCH LLM IN RUNTIME · SELF-HOSTED AI GATEWAY</text>

  <text x="72" y="278" font-family="Segoe UI, Arial, sans-serif" font-size="54" font-weight="800" fill="#f8fafc">One local AI gateway.</text>
  <text x="72" y="348" font-family="Segoe UI, Arial, sans-serif" font-size="54" font-weight="800" fill="#9aa6be">Switch LLMs at runtime.</text>

  <text x="72" y="418" font-family="Segoe UI, Arial, sans-serif" font-size="21" fill="#9aa6be">Hot-swap Ollama, LM Studio, vLLM, OpenAI, Anthropic &amp; Groq without restarts.</text>
  <text x="72" y="450" font-family="Segoe UI, Arial, sans-serif" font-size="21" fill="#9aa6be">Pin models per app, profile VRAM/TTFT latency, and inspect live failover traces.</text>

  <g font-family="Consolas, monospace" font-size="13">
    <rect x="72" y="512" width="174" height="32" rx="16" fill="#f97316" fill-opacity="0.12" stroke="#f97316" stroke-opacity="0.4"/>
    <text x="159" y="533" text-anchor="middle" fill="#fb923c">Runtime Hot-Swap</text>

    <rect x="258" y="512" width="174" height="32" rx="16" fill="#06b6d4" fill-opacity="0.1" stroke="#06b6d4" stroke-opacity="0.35"/>
    <text x="345" y="533" text-anchor="middle" fill="#22d3ee">OpenAI + Anthropic</text>

    <rect x="444" y="512" width="150" height="32" rx="16" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-opacity="0.35"/>
    <text x="519" y="533" text-anchor="middle" fill="#34d399">Auto Failover</text>

    <rect x="606" y="512" width="122" height="32" rx="16" fill="#2f384f" fill-opacity="0.4" stroke="#475569"/>
    <text x="667" y="533" text-anchor="middle" fill="#9aa6be">Zero-Config</text>
  </g>

  <text x="1128" y="533" text-anchor="end" font-family="Consolas, monospace" font-size="14" fill="#77839b">slir.varaddhumale.in</text>
</svg>`;

const iconSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#090b10"/>
  <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="none" stroke="#2f384f"/>
  <circle cx="16" cy="16" r="10" fill="none" stroke="#f97316" stroke-width="2" stroke-opacity="0.45"/>
  <circle cx="16" cy="16" r="5.5" fill="#f97316"/>
  <circle cx="16" cy="16" r="2.2" fill="#ffffff"/>
</svg>`;

await sharp(Buffer.from(ogSvg)).png({ compressionLevel: 9 }).toFile('public/og.png');
await sharp(Buffer.from(iconSvg(512))).resize(32, 32).png().toFile('public/favicon-32x32.png');
await sharp(Buffer.from(iconSvg(512))).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(Buffer.from(iconSvg(512))).resize(192, 192).png().toFile('public/icon-192.png');
await sharp(Buffer.from(iconSvg(512))).resize(512, 512).png().toFile('public/icon-512.png');
console.log('Wrote public/og.png and PNG favicons/app icons');
