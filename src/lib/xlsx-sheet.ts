import type { Game, GamePick } from "./types";
import { computePoints } from "./scoring";
import { PARTICIPANTS, RESULTS_CSV_URL } from "./participants";
import { parseCSV } from "./csv";

const FETCH_OPTIONS: RequestInit = { next: { revalidate: 60 } };

// Highest game id we expect. Guards against stray numeric rows being read as games.
const MAX_GAME_ID = 64;

async function fetchCsv(url: string): Promise<string> {
  const res = await fetch(url, { ...FETCH_OPTIONS, redirect: "follow" });
  if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.status} — ${url}`);
  return res.text();
}

// A row represents a game when its first cell is a positive integer id. This
// lets us locate games regardless of how many header/title rows precede them —
// the published CSV has multi-line quoted header cells that shift row indices.
function parseGameId(value: string | undefined): number | null {
  const n = parseNumberCell(value);
  if (n === null || !Number.isInteger(n) || n < 1 || n > MAX_GAME_ID) return null;
  return n;
}

export function parseNumberCell(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return isNaN(value) ? null : value;
  const parsed = parseFloat(String(value).trim());
  return isNaN(parsed) ? null : parsed;
}

export async function parseResultsSheet(): Promise<Game[]> {
  const csv = await fetchCsv(RESULTS_CSV_URL);
  const rows = parseCSV(csv);
  const games: Game[] = [];

  // Columns: 0=#, 1=Date, 2=Team 1, 3="vs", 4=Team 2, 5=Actual T1, 6=Actual T2, 7=Status.
  // Scan by game id rather than fixed row numbers — header cells contain embedded
  // newlines that shift the row indices unpredictably.
  for (const row of rows) {
    const id = parseGameId(row[0]);
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
  const rows = parseCSV(csv);

  // Bonus picks live on the row containing "Champion Pick:" — E=champion, H=finalist1, I=finalist2.
  // Find it by content rather than a fixed index in case leading rows shift.
  const bonusRow =
    rows.find((r) => r.some((c) => c.toLowerCase().includes("champion pick"))) ?? [];
  const championPick = bonusRow[4]?.trim() || null;
  const finalist1 = bonusRow[7]?.trim() || null;
  const finalist2 = bonusRow[8]?.trim() || null;

  const picks: GamePick[] = [];

  // Columns: 0=#, 1=Team 1, 3=Team 2, 4=Pred T1, 5=Pred T2. Scan by game id rather than
  // fixed row numbers — header cells contain embedded newlines that shift row indices.
  for (const row of rows) {
    const gameId = parseGameId(row[0]);
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
