# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FPL Pulse — a Fantasy Premier League mini-league tracker. Displays gameweek
standings ranked by net points (gross points minus transfer costs) for any
public FPL classic mini-league.

## Commands

```bash
npm run dev      # Vite dev server — NOTE: /api/* is unavailable, use `vercel dev`
vercel dev       # Full stack including the serverless functions
npm run build    # TypeScript compile + Vite build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Architecture

**Frontend Stack**: React 19 + TypeScript + Vite + Tailwind CSS

**Routing** (React Router v7):
- `/` - Home page showing all gameweeks and stats
- `/gameweek/:week` - Weekly standings for specific gameweek

**Data Layer**:
- TanStack React Query for caching and data fetching
- `src/hooks/fplhooks.ts` - Main `useFpl` hook that fetches and aggregates league data
- 30-minute stale time on queries

**API Endpoints** (`api/` folder - Vercel serverless functions):
These call the official FPL API server-side, to bypass CORS and to keep the
per-manager fan-out off the browser:
- `league.js` - Aggregated league season (`/api/league?leagueId=...`)
- `seasonDetails.js` - Season/gameweek metadata (`/api/seasonDetails`)

Both set `Cache-Control` so the edge absorbs repeat traffic — the fan-out to FPL
happens once per league per cache window, not once per visitor.

`league.js` picks its TTL from `/event-status/`: 1 hour once a gameweek's points
are confirmed (they can no longer change), 5 minutes otherwise. The check is
one-directional — only positive evidence of settled scores extends the TTL, so
an unreadable or unfamiliar response falls back to the short window.

**Data Flow**:
1. `/api/league` pages through league standings (50/page, capped at 3 pages)
2. It fetches each manager's history with bounded concurrency, keyed by `event`
   number — `history.current` only holds gameweeks that entry actually played,
   so array position does not map to gameweek
3. It returns every manager's whole season in one payload
4. `useFpl` derives each gameweek's table client-side: net points (points minus
   transfer cost), sorted and ranked. Changing gameweek costs no new requests.

## Key Files

- `src/hooks/fplhooks.ts` - Core data fetching logic and TypeScript interfaces
- `src/components/Home.tsx` - Main page with gameweek list
- `src/components/Gameweek.tsx` - Individual gameweek standings view
