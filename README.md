# SLIR — Marketing & Documentation Website (Next.js App Router)

Production-ready marketing and developer reference site for **SLIR (Switch LLM In Runtime)**, powered by **Next.js App Router**, **React 19**, **Tailwind CSS v4**, and **Shiki** (build-time syntax highlighting).

- **Vercel-ready**: Configured with security & asset headers (`next.config.ts`), `sitemap.xml` (`src/app/sitemap.ts`), `robots.txt` (`src/app/robots.ts`), branded `404` (`src/app/not-found.tsx`), PNG/SVG favicons (`public/favicon.svg`, `favicon-32x32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`), `manifest.webmanifest`, `llms.txt`, and `1200×630` OpenGraph / Twitter social card (`public/og.png`).
- **SEO & Structured Data**: Full Metadata API (`metadataBase`, canonical URLs, OpenGraph, Twitter summary large image) + Schema.org `@graph` (`WebSite`, `SoftwareApplication`, `FAQPage`).
- **Self-hosted fonts**: Plus Jakarta Sans Variable and JetBrains Mono Variable bundled locally.

## Local Development

```bash
npm install
npm run dev
```

Runs at `http://localhost:4321`.

## Production Build & Asset Generation

```bash
npm run og         # regenerates public/og.png + PNG favicons/icons
npm run typecheck  # tsc --noEmit
npm run build      # next build
npm run start
```

## Deploy to Vercel (Recommended)

1. Push `slir-website` to GitHub (or connect it as the Root Directory in Vercel).
2. Vercel auto-detects **Next.js**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (default)
   - **Node.js Version**: `22.x`
3. Attach custom domain `slir.varaddhumale.in` in **Project Settings → Domains**.
4. *(Optional)* Set `NEXT_PUBLIC_UMAMI_SRC` and `NEXT_PUBLIC_UMAMI_ID` for Umami analytics.
