import { cell, parseCSV, parseNumber } from "./csv";
import { PARTICIPANTS, RESULTS_TAB } from "./participants";
import { computePoints, assignRanks } from "./scoring";
import { getCachedData, setCachedData } from "./cache";
import type { AppData, Game, GamePick, Participant } from "./types";

const FETCH_OPTIONS: RequestInit = { next: { revalidate: 60 } };

function buildSheetUrl(tabName: string): string {
  const base = process.env.SHEET_BASE_URL;
  if (!base) throw new Error("SHEET_BASE_URL is not configured");
  const joiner = base.includes("?") ? "&" : "?";
  return `${base}${joiner}sheet=${encodeURIComponent(tabName)}`;
}

function emptyFallbackData(): AppData {
  const games: Game[] = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    date: "",
    team1: "TBD",
    team2: "TBD",
    actualT1: null,
    actualT2: null,
    status: "Pending" as const,
  }));

  const participants: Participant[] = PARTICIPANTS.map((config, i) => ({
    tabName: config.tabName,
    displayName: config.displayName,
    slug: config.slug,
    rank: i + 1,
    totalPoints: 0,
    championPick: null,
    finalist1: null,
    finalist2: null,
    picks: games.map((g) => ({
      gameId: g.id,
      predT1: null,
      predT2: null,
      points: 0,
    })),
    avgPointsPerGame: 0,
    gamesScored: 0,
  }));

  return {
    lastUpdated: new Date().toISOString(),
    games,
    participants,
    stale: true,
  };
}

async function fetchCSV(tabName: string): Promise<string> {
  const url = buildSheetUrl(tabName);
  const res = await fetch(url, FETCH_OPTIONS);
  if (!res.ok) throw new Error(`Failed to fetch sheet "${tabName}": ${res.status}`);
  return res.text();
}

export function parseResultsCSV(csv: string): Game[] {
  const rows = parseCSV(csv);
  const games: Game[] = [];

  for (let i = 5; i <= 20; i++) {
    const row = rows[i];
    if (!row) continue;

    const id = parseNumber(cell(row, 0));
    if (id === null) continue;

    const statusRaw = cell(row, 7).toLowerCase();
    const status = statusRaw === "done" ? "Done" : "Pending";

    games.push({
      id,
      date: cell(row, 1),
      team1: cell(row, 2),
      team2: cell(row, 4),
      actualT1: parseNumber(cell(row, 5)),
      actualT2: parseNumber(cell(row, 6)),
      status,
    });
  }

  return games.sort((a, b) => a.id - b.id);
}

interface ParsedParticipant {
  championPick: string | null;
  finalist1: string | null;
  finalist2: string | null;
  picks: GamePick[];
}

export function parseParticipantCSV(csv: string, games: Game[]): ParsedParticipant {
  const rows = parseCSV(csv);
  const bonusRow = rows[1];

  const championPick = cell(bonusRow, 4) || null;
  const finalist1 = cell(bonusRow, 7) || null;
  const finalist2 = cell(bonusRow, 8) || null;

  const picks: GamePick[] = [];

  for (let i = 9; i <= 24; i++) {
    const row = rows[i];
    if (!row) continue;

    const gameId = parseNumber(cell(row, 0));
    if (gameId === null) continue;

    const predT1 = parseNumber(cell(row, 4));
    const predT2 = parseNumber(cell(row, 5));

    const game = games.find((g) => g.id === gameId);
    const actualT1 = game?.actualT1 ?? parseNumber(cell(row, 6));
    const actualT2 = game?.actualT2 ?? parseNumber(cell(row, 7));

    const points = computePoints(predT1, predT2, actualT1, actualT2);

    picks.push({ gameId, predT1, predT2, points });
  }

  return {
    championPick: championPick || null,
    finalist1: finalist1 || null,
    finalist2: finalist2 || null,
    picks: picks.sort((a, b) => a.gameId - b.gameId),
  };
}

export async function getAppData(): Promise<AppData> {
  try {
    const resultsCSV = await fetchCSV(RESULTS_TAB);
    const games = parseResultsCSV(resultsCSV);

    const participantResults = await Promise.all(
      PARTICIPANTS.map(async (config) => {
        try {
          const csv = await fetchCSV(config.tabName);
          const parsed = parseParticipantCSV(csv, games);
          const totalPoints = parsed.picks.reduce((sum, p) => sum + p.points, 0);
          const gamesScored = games.filter((g) => g.status === "Done").length;
          const avgPointsPerGame = gamesScored > 0 ? totalPoints / gamesScored : 0;

          const participant: Participant = {
            tabName: config.tabName,
            displayName: config.displayName,
            slug: config.slug,
            rank: 0,
            totalPoints,
            championPick: parsed.championPick,
            finalist1: parsed.finalist1,
            finalist2: parsed.finalist2,
            picks: parsed.picks,
            avgPointsPerGame,
            gamesScored,
          };

          return participant;
        } catch (err) {
          console.error(`Error parsing participant ${config.tabName}:`, err);
          return null;
        }
      })
    );

    const participants = assignRanks(
      participantResults
        .filter((p): p is Participant => p !== null)
        .sort((a, b) => b.totalPoints - a.totalPoints)
    );

    const data: AppData = {
      lastUpdated: new Date().toISOString(),
      games,
      participants,
    };

    setCachedData(data);
    return data;
  } catch (err) {
    console.error("Error fetching app data:", err);
    const cached = getCachedData();
    if (cached) {
      return { ...cached, stale: true, lastUpdated: cached.lastUpdated };
    }
    return emptyFallbackData();
  }
}
