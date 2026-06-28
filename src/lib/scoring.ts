import type { Game, PickResult } from "./types";

export function computePoints(
  predT1: number | null,
  predT2: number | null,
  actualT1: number | null,
  actualT2: number | null
): number {
  if (actualT1 === null || actualT2 === null || predT1 === null || predT2 === null) return 0;
  let pts = 0;
  const predictedWinner = predT1 > predT2 ? 1 : predT1 < predT2 ? 2 : 0;
  const actualWinner = actualT1 > actualT2 ? 1 : actualT1 < actualT2 ? 2 : 0;
  if (predictedWinner === actualWinner) pts += 2;
  if (predT1 === actualT1 && predT2 === actualT2) pts += 4;
  if (predT1 === 0 && predT2 === 0 && actualT1 === actualT2) pts += 4;
  if (predictedWinner === actualWinner && predictedWinner !== 0 && Math.abs(predT1 - predT2) >= 4) pts += 3;
  return pts;
}

export function getPickResult(
  predT1: number | null,
  predT2: number | null,
  game: Game
): PickResult {
  if (game.status !== "Done" || game.actualT1 === null || game.actualT2 === null) {
    return predT1 === null || predT2 === null ? "unpicked" : "pending";
  }
  if (predT1 === null || predT2 === null) return "unpicked";
  if (predT1 === game.actualT1 && predT2 === game.actualT2) return "exact";
  const predictedWinner = predT1 > predT2 ? 1 : predT1 < predT2 ? 2 : 0;
  const actualWinner =
    game.actualT1 > game.actualT2 ? 1 : game.actualT1 < game.actualT2 ? 2 : 0;
  if (predictedWinner === actualWinner) return "winner";
  return "wrong";
}

export function getResultLabel(result: PickResult): string {
  switch (result) {
    case "exact":
      return "Exact Score";
    case "winner":
      return "Correct Winner";
    case "wrong":
      return "Wrong";
    case "pending":
      return "Pending";
    case "unpicked":
      return "Unpicked";
  }
}

export function assignRanks<T extends { totalPoints: number; rank?: number }>(
  sorted: T[]
): T[] {
  let rank = 1;
  return sorted.map((p, i) => {
    if (i > 0 && p.totalPoints < sorted[i - 1].totalPoints) {
      rank = i + 1;
    }
    return { ...p, rank };
  });
}

export function getPopularPick(
  gameId: number,
  participants: { picks: { gameId: number; predT1: number | null; predT2: number | null }[] }[],
  team1: string,
  team2: string
): { team: string; count: number; total: number } {
  let team1Count = 0;
  let team2Count = 0;
  let drawCount = 0;
  let total = 0;

  for (const p of participants) {
    const pick = p.picks.find((pk) => pk.gameId === gameId);
    if (!pick || pick.predT1 === null || pick.predT2 === null) continue;
    total++;
    if (pick.predT1 > pick.predT2) team1Count++;
    else if (pick.predT1 < pick.predT2) team2Count++;
    else drawCount++;
  }

  if (total === 0) return { team: team1, count: 0, total: 0 };

  const max = Math.max(team1Count, team2Count, drawCount);
  if (team1Count === max) return { team: team1, count: team1Count, total };
  if (team2Count === max) return { team: team2, count: team2Count, total };
  return { team: "Draw", count: drawCount, total };
}
