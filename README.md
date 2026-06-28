# Degenville World Cup 2026

ESPN-style World Cup 2026 bracket, leaderboard, and picks tracker for the Degenville friend group. All scores and picks live in a Google Sheet — no database, no redeploys needed for updates.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Google Sheets (published XLSX workbook) as the single source of truth

## Getting Started

```bash
npm install
cp .env.local.example .env.local   # or create .env.local manually
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create `.env.local`:

```
SHEET_BASE_URL=https://docs.google.com/spreadsheets/d/e/2PACX-1vSs07VSIpzIgfg5-7lz45Bal_fOCRoV1aJWjt9r9MbJFdQqUeYhov5_0FQEUwncVJKQQdjudRk9h9aR/pub?output=xlsx
```

The app downloads the full published workbook in one request and reads each participant tab plus the Results tab.

## Updating Data (No Redeploy Required)

The site refreshes from the sheet automatically every **60 seconds** via Next.js ISR caching.

### Update actual scores

1. Open the Google Sheet.
2. Go to the **Results (Enter Here)** tab.
3. Edit the green cells (Actual T1 Goals, Actual T2 Goals, Status).
4. The site updates within 60 seconds.

### Update participant picks

1. Open the participant's tab (e.g. `Casey_Venis`).
2. Edit the yellow prediction cells.
3. The site updates within 60 seconds.

### Force an immediate refresh

Visit [`/api/data`](http://localhost:3000/api/data) directly to bust the cache and fetch fresh CSV data.

## Deploy to Vercel

1. Push this repo to GitHub: `julianbol2002/degenville-wc2026`
2. Import the project in [Vercel](https://vercel.com).
3. Add the `SHEET_BASE_URL` environment variable in the Vercel dashboard.
4. Deploy.

Score and pick updates in the sheet propagate to production within 60 seconds — no redeployment needed.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Leaderboard with per-game point breakdown |
| `/bracket` | Round of 32 bracket with popular picks |
| `/picks` | All picks grid (17 participants × 16 games) |
| `/picks/[name]` | Individual participant picks and running total |
| `/api/data` | JSON API (games, participants, scores) |

## Scoring

- **+2** — Correct winner (or correct draw)
- **+4** — Exact score
- **+4** — Predicted 0-0 draw (penalties scenario)
- **+3** — Blowout bonus (correct winner by 4+ goal margin)

## Data Flow

```
Google Sheet → published XLSX → /api/data → React pages
```

No authentication, database, or external state management — the sheet is the only thing that ever needs editing.
