import type { Game, GamePick } from "./types";
import { computePoints } from "./scoring";
import { PARTICIPANTS, RESULTS_CSV_URL } from "./participants";

const FETCH_OPTIONS: RequestInit = { next: { revalidate: 60 } };

async function fetchCsv(url: string): Promise<string> {
  const res = await fetch(url, { ...FETCH_OPTIONS, redirect: "follow" });
  if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.status} — ${url}`);
  return res.text();
}

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  for (const line of csv.split(/\r?\n/)) {
    const row: string[] = [];
    let inQuotes = false;
    let current = "";
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' && line[i + 1] === '"') { current += '"'; i++; }
      else if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === "," && !inQuotes) { row.push(current.trim()); current = ""; }
      else { current += ch; }
    }
    row.push(current.trim());
    rows.push(row);
  }
  return rows;
}

export function parseNumberCell(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return isNaN(value) ? null : value;
  const parsed = parseFloat(String(value).trim());
  return isNaN(parsed) ? null : parsed;
}

export async function parseResultsSheet(): Promise<Game[]> {
  const csv = await fetchCsv(RESULTS_CSV_URL);
  const rows = parseCsv(csv);
  const games: Game[] = [];

  // Row 0: title, Row 1: subtitle, Row 2: blank, Row 3: headers, Row 4: blank, Rows 5–20: games
  for (let i = 5; i <= 20; i++) {
    const row = rows[i];
    if (!row) continue;
    const id = parseNumberCell(row[0]);
    if (id === null) continue;
    const statusRaw = (row[7] ?? "").toLowerCase();
    games.push({
      id,
      date: row[1] ?? "",
      team1: row[2] ?? "",
      team2: row[4] ?? "",
      actualT1: parseNumberCell(row[5]),
      actualT2: parseNumberCell(row[6]),
      status: statusRaw === "done" ? "Done" : "Pending",
    });
  }

  return games.sort((a, b) => a.id - b.id);
}

export interface ParsedParticipantSheet {
  championPick: string | null;
  finalist1: string | null;
  finalist2: string | null;
  picks: GamePick[];
}

export async function parseParticipantSheet(
  csvUrl: string,
  games: Game[]
): Promise<ParsedParticipantSheet> {
  const csv = await fetchCsv(csvUrl);
  const rows = parseCsv(csv);

  // Row 1: bonus picks — E=champion, H=finalist1, I=finalist2
  const bonusRow = rows[1] ?? [];
  const championPick = bonusRow[4]?.trim() || null;
  const finalist1 = bonusRow[7]?.trim() || null;
  const finalist2 = bonusRow[8]?.trim() || null;

  const picks: GamePick[] = [];

  // Rows 5–20: game picks
  for (let i = 5; i <= 20; i++) {
    const row = rows[i];
    if (!row) continue;
    const gameId = parseNumberCell(row[0]);
    if (gameId === null) continue;
    const predT1 = parseNumberCell(row[4]);
    const predT2 = parseNumberCell(row[5]);
    const game = games.find((g) => g.id === gameId);
    const actualT1 = game?.actualT1 ?? null;
    const actualT2 = game?.actualT2 ?? null;
    const points = computePoints(predT1, predT2, actualT1, actualT2);
    picks.push({ gameId, predT1, predT2, points });
  }

  return { championPick, finalist1, finalist2, picks };
}

export function getParticipantTabNames(): string[] {
  return PARTICIPANTS.map((p) => p.tabName);
}
