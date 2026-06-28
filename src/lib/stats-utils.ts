import type { AppData, Game, Participant } from "./types";
import { getPickResult } from "./scoring";
import { isUnderdog } from "./fifa-rankings";

export type StreakBadge = "fire" | "cold" | null;

export function getStreakBadge(participant: Participant, games: Game[]): StreakBadge {
  const completed = games
    .filter((g) => g.status === "Done")
    .sort((a, b) => a.id - b.id)
    .slice(-3);

  if (completed.length < 3) return null;

  const lastThreePoints = completed.map((game) => {
    const pick = participant.picks.find((p) => p.gameId === game.id);
    return pick?.points ?? 0;
  });

  if (lastThreePoints.every((p) => p > 0)) return "fire";
  if (lastThreePoints.every((p) => p === 0)) return "cold";
  return null;
}

export function getBestGameScore(participant: Participant, games: Game[]): number {
  let best = 0;
  for (const game of games) {
    if (game.status !== "Done") continue;
    const pick = participant.picks.find((p) => p.gameId === game.id);
    if ((pick?.points ?? 0) > best) best = pick?.points ?? 0;
  }
  return best;
}

export function getExactScoreCount(participant: Participant, games: Game[]): number {
  return games.filter((game) => {
    if (game.status !== "Done") return false;
    const pick = participant.picks.find((p) => p.gameId === game.id);
    return getPickResult(pick?.predT1 ?? null, pick?.predT2 ?? null, game) === "exact";
  }).length;
}

export function getCorrectWinnerCount(participant: Participant, games: Game[]): number {
  return games.filter((game) => {
    if (game.status !== "Done") return false;
    const pick = participant.picks.find((p) => p.gameId === game.id);
    const result = getPickResult(pick?.predT1 ?? null, pick?.predT2 ?? null, game);
    return result === "exact" || result === "winner";
  }).length;
}

export function getWrongPickCount(participant: Participant, games: Game[]): number {
  return games.filter((game) => {
    if (game.status !== "Done") return false;
    const pick = participant.picks.find((p) => p.gameId === game.id);
    return getPickResult(pick?.predT1 ?? null, pick?.predT2 ?? null, game) === "wrong";
  }).length;
}

export function getPendingCount(participant: Participant, games: Game[]): number {
  return games.filter((game) => game.status !== "Done").length;
}

export function pointsColorClass(pts: number, pending: boolean): string {
  if (pending) return "bg-secondary/30 text-secondary";
  if (pts === 0) return "bg-red-500 text-white";
  if (pts <= 2) return "bg-orange-500 text-white";
  if (pts <= 4) return "bg-yellow-500 text-navy-dark";
  if (pts <= 6) return "bg-green-400 text-navy-dark";
  return "bg-green-500 text-white";
}

export function hashDataTimestamp(lastUpdated: string): string {
  return lastUpdated.slice(0, 19);
}

export interface RankSnapshot {
  timestamp: string;
  ranks: Record<string, number>;
}

const RANK_HISTORY_KEY = "degenville-rank-history";

export function loadRankHistory(): RankSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RANK_HISTORY_KEY);
    return raw ? (JSON.parse(raw) as RankSnapshot[]) : [];
  } catch {
    return [];
  }
}

export function saveRankSnapshot(lastUpdated: string, participants: Participant[]): void {
  if (typeof window === "undefined") return;
  const history = loadRankHistory();
  const snapshot: RankSnapshot = {
    timestamp: hashDataTimestamp(lastUpdated),
    ranks: Object.fromEntries(participants.map((p) => [p.slug, p.rank])),
  };

  const filtered = history.filter((h) => h.timestamp !== snapshot.timestamp);
  filtered.push(snapshot);
  localStorage.setItem(RANK_HISTORY_KEY, JSON.stringify(filtered.slice(-20)));
}

export function getPreviousRanks(): Record<string, number> | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("degenville-prev-ranks");
    if (!stored) return null;
    const parsed = JSON.parse(stored) as { ranks: Record<string, number> };
    return parsed.ranks;
  } catch {
    return null;
  }
}

export function storePreviousRanks(lastUpdated: string, participants: Participant[]): Record<string, number> {
  if (typeof window === "undefined") return {};
  const currentRanks = Object.fromEntries(participants.map((p) => [p.slug, p.rank]));
  let previous: Record<string, number> = {};

  try {
    const stored = localStorage.getItem("degenville-prev-ranks");
    if (stored) {
      previous = (JSON.parse(stored) as { ranks: Record<string, number> }).ranks;
    }
  } catch {
    previous = {};
  }

  localStorage.setItem(
    "degenville-prev-ranks",
    JSON.stringify({ timestamp: hashDataTimestamp(lastUpdated), ranks: currentRanks })
  );

  return previous;
}

export function getRankMovement(current: number, previous: number | undefined): {
  delta: number;
  label: string;
  className: string;
} {
  if (previous === undefined) {
    return { delta: 0, label: "—", className: "text-secondary" };
  }
  const delta = previous - current;
  if (delta > 0) return { delta, label: `▲${delta}`, className: "text-green-500 animate-flash" };
  if (delta < 0) return { delta, label: `▼${Math.abs(delta)}`, className: "text-red-500 animate-flash" };
  return { delta: 0, label: "—", className: "text-secondary" };
}

export function computeRankAfterGame(
  participants: Participant[],
  games: Game[],
  throughGameId: number
): Record<string, number> {
  const completedGames = games.filter((g) => g.status === "Done" && g.id <= throughGameId);
  const totals = participants.map((p) => {
    const total = completedGames.reduce((sum, game) => {
      const pick = p.picks.find((pk) => pk.gameId === game.id);
      return sum + (pick?.points ?? 0);
    }, 0);
    return { slug: p.slug, total };
  });

  totals.sort((a, b) => b.total - a.total);
  const ranks: Record<string, number> = {};
  let rank = 1;
  totals.forEach((t, i) => {
    if (i > 0 && t.total < totals[i - 1].total) rank = i + 1;
    ranks[t.slug] = rank;
  });
  return ranks;
}

export function buildRankHistorySeries(
  participants: Participant[],
  games: Game[]
): { slug: string; name: string; points: { x: number; y: number }[] }[] {
  const completedIds = games.filter((g) => g.status === "Done").map((g) => g.id).sort((a, b) => a - b);

  return participants.map((p) => ({
    slug: p.slug,
    name: p.displayName,
    points: completedIds.map((gameId) => ({
      x: gameId,
      y: computeRankAfterGame(participants, games, gameId)[p.slug] ?? p.rank,
    })),
  }));
}

export function getSparklinePoints(participant: Participant, games: Game[]): number[] {
  return games
    .filter((g) => g.status === "Done")
    .sort((a, b) => a.id - b.id)
    .map((game) => participant.picks.find((p) => p.gameId === game.id)?.points ?? 0);
}

export function getConsensusPick(
  game: Game,
  participants: Participant[]
): { pick: string; pct: number } {
  const counts = new Map<string, number>();
  let total = 0;

  for (const p of participants) {
    const pick = p.picks.find((pk) => pk.gameId === game.id);
    if (!pick || pick.predT1 === null || pick.predT2 === null) continue;
    const label = `${pick.predT1}-${pick.predT2}`;
    counts.set(label, (counts.get(label) ?? 0) + 1);
    total++;
  }

  if (total === 0) return { pick: "—", pct: 0 };

  let best = "—";
  let bestCount = 0;
  counts.forEach((count, pick) => {
    if (count > bestCount) {
      bestCount = count;
      best = pick;
    }
  });

  return { pick: best, pct: Math.round((bestCount / total) * 100) };
}

export function isSoleCorrectPick(
  game: Game,
  participantSlug: string,
  participants: Participant[]
): boolean {
  if (game.status !== "Done") return false;

  const correctSlugs = participants.filter((p) => {
    const pick = p.picks.find((pk) => pk.gameId === game.id);
    if (!pick || pick.predT1 === null || pick.predT2 === null) return false;
    const result = getPickResult(pick.predT1, pick.predT2, game);
    return result === "exact" || result === "winner";
  });

  return correctSlugs.length === 1 && correctSlugs[0]?.slug === participantSlug;
}

export function getHeadToHead(a: Participant, b: Participant, games: Game[]) {
  let agreed = 0;
  let disagreed = 0;

  for (const game of games) {
    const pickA = a.picks.find((p) => p.gameId === game.id);
    const pickB = b.picks.find((p) => p.gameId === game.id);
    if (!pickA || !pickB || pickA.predT1 === null || pickA.predT2 === null || pickB.predT1 === null || pickB.predT2 === null) {
      continue;
    }

    const winnerA = pickA.predT1 > pickA.predT2 ? 1 : pickA.predT1 < pickA.predT2 ? 2 : 0;
    const winnerB = pickB.predT1 > pickB.predT2 ? 1 : pickB.predT1 < pickB.predT2 ? 2 : 0;
    if (winnerA === winnerB) agreed++;
    else disagreed++;
  }

  return {
    agreed,
    disagreed,
    pointsLeader: a.totalPoints >= b.totalPoints ? a.displayName : b.displayName,
    pointDiff: Math.abs(a.totalPoints - b.totalPoints),
  };
}

export function computeFunStats(data: AppData) {
  const { participants, games } = data;
  const completed = games.filter((g) => g.status === "Done");

  const sharpshooter = [...participants].sort(
    (a, b) => getExactScoreCount(b, games) - getExactScoreCount(a, games)
  )[0];

  const upsetKing = [...participants].sort((a, b) => {
    const score = (p: Participant) =>
      completed.reduce((sum, game) => {
        const pick = p.picks.find((pk) => pk.gameId === game.id);
        if (!pick || pick.predT1 === null || pick.predT2 === null) return sum;
        const result = getPickResult(pick.predT1, pick.predT2, game);
        if (result !== "exact" && result !== "winner") return sum;

        const winnerTeam =
          game.actualT1! > game.actualT2!
            ? game.team1
            : game.actualT2! > game.actualT1!
              ? game.team2
              : null;
        if (!winnerTeam) return sum;

        const loserTeam = winnerTeam === game.team1 ? game.team2 : game.team1;
        if (!isUnderdog(winnerTeam, loserTeam)) return sum;

        const othersPickedWinner = participants.filter((op) => {
          if (op.slug === p.slug) return false;
          const opPick = op.picks.find((pk) => pk.gameId === game.id);
          if (!opPick || opPick.predT1 === null || opPick.predT2 === null) return false;
          const opWinner =
            opPick.predT1 > opPick.predT2
              ? game.team1
              : opPick.predT1 < opPick.predT2
                ? game.team2
                : null;
          return opWinner === winnerTeam;
        }).length;

        const pct = othersPickedWinner / Math.max(participants.length - 1, 1);
        if (pct >= 0.4) return sum;
        return sum + 1;
      }, 0);

    return score(b) - score(a);
  })[0];

  const oneTrickPony = [...participants].sort(
    (a, b) => getBestGameScore(b, games) - getBestGameScore(a, games)
  )[0];

  const consistencyKing = [...participants]
    .filter((p) => getSparklinePoints(p, games).length >= 3)
    .sort((a, b) => {
      const std = (p: Participant) => {
        const pts = getSparklinePoints(p, games);
        if (pts.length < 2) return Infinity;
        const mean = pts.reduce((s, v) => s + v, 0) / pts.length;
        const variance = pts.reduce((s, v) => s + (v - mean) ** 2, 0) / pts.length;
        return Math.sqrt(variance);
      };
      return std(a) - std(b);
    })[0];

  const bracketBuster = [...participants].sort((a, b) => {
    const upsets = (p: Participant) =>
      games.reduce((sum, game) => {
        const pick = p.picks.find((pk) => pk.gameId === game.id);
        if (!pick || pick.predT1 === null || pick.predT2 === null) return sum;
        const picked =
          pick.predT1 > pick.predT2 ? game.team1 : pick.predT1 < pick.predT2 ? game.team2 : null;
        if (!picked) return sum;
        const opponent = picked === game.team1 ? game.team2 : game.team1;
        return isUnderdog(picked, opponent) ? sum + 1 : sum;
      }, 0);
    return upsets(b) - upsets(a);
  })[0];

  const deadweight = [...participants].sort((a, b) => a.totalPoints - b.totalPoints)[0];

  let mostPickedUpset = "—";
  let upsetCount = 0;
  for (const game of completed) {
    if (game.actualT1 === null || game.actualT2 === null) continue;
    const winner =
      game.actualT1 > game.actualT2
        ? game.team1
        : game.actualT2 > game.actualT1
          ? game.team2
          : null;
    if (!winner) continue;
    const loser = winner === game.team1 ? game.team2 : game.team1;
    if (!isUnderdog(winner, loser)) continue;

    let picks = 0;
    for (const p of participants) {
      const pick = p.picks.find((pk) => pk.gameId === game.id);
      if (!pick || pick.predT1 === null || pick.predT2 === null) continue;
      const picked =
        pick.predT1 > pick.predT2 ? game.team1 : pick.predT1 < pick.predT2 ? game.team2 : null;
      if (picked === winner) picks++;
    }
    if (picks > upsetCount) {
      upsetCount = picks;
      mostPickedUpset = winner;
    }
  }

  const totalPoints = participants.reduce((s, p) => s + p.totalPoints, 0);
  const avgPerGame =
    completed.length > 0
      ? totalPoints / (participants.length * completed.length)
      : 0;

  return {
    sharpshooter,
    upsetKing,
    oneTrickPony,
    consistencyKing,
    bracketBuster,
    deadweight,
    mostPickedUpset,
    totalPoints,
    avgPerGame,
    gamesCompleted: completed.length,
  };
}

export function cumulativeGradient(progress: number): string {
  const clamped = Math.max(0, Math.min(1, progress));
  const hue = clamped * 120;
  return `hsl(${hue}, 70%, 45%)`;
}
