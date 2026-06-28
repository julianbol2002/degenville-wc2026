import { assignRanks } from "./scoring";
import { getCachedData, setCachedData } from "./cache";
import { PARTICIPANTS, getParticipantConfig } from "./participants";
import {
  fetchWorkbook,
  getParticipantTabNames,
  parseParticipantSheet,
  parseResultsSheet,
} from "./xlsx-sheet";
import type { AppData, Game, Participant } from "./types";

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

export async function getAppData(): Promise<AppData> {
  try {
    const workbook = await fetchWorkbook();
    const games = parseResultsSheet(workbook);
    const tabNames = getParticipantTabNames(workbook);

    const participantResults = await Promise.all(
      tabNames.map(async (tabName) => {
        try {
          const config = getParticipantConfig(tabName);
          if (!config) {
            console.warn(`No participant config for tab ${tabName}, skipping`);
            return null;
          }

          const parsed = parseParticipantSheet(workbook, tabName, games);
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
          console.error(`Error parsing participant ${tabName}:`, err);
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
