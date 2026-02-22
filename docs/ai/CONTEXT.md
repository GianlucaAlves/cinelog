# CineLog — AI Context

## Product
CineLog is a Letterboxd-inspired app for discovering, rating, reviewing, and tracking movies/series.

## Differentiator
Guest homepage feels like entering a video rental store (locadora) at night.
Primary CTA: “Enter the store” → browse corridors.

## Stack
React + TS + Tailwind + shadcn/ui (frontend)
Node + Express + TS + Prisma + Postgres (backend)
TMDB via backend proxy

## Non-negotiables
- Never expose TMDB API key on frontend.
- Strict TypeScript, no `any`.
- Accessibility: keyboard nav, focus states, prefers-reduced-motion.
- Small incremental steps; I write the code.
