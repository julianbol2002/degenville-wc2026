"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Game, Participant } from "@/lib/types";
import {
  getBestGameScore,
  getRankMovement,
  getStreakBadge,
  pointsColorClass,
  storePreviousRanks,
} from "@/lib/stats-utils";

function rankDisplay(rank: number): React.ReactNode {
  if (rank === 1) return <span className="shimmer-gold text-2xl">🥇</span>;
  if (rank === 2) return <span className="shimmer-silver text-2xl">🥈</span>;
  if (rank === 3) return <span className="shimmer-bronze text-2xl">🥉</span>;
  return <span className="text-lg font-bold text-primary">{rank}</span>;
}

function GameSquares({
  picks,
  games,
}: {
  picks: Participant["picks"];
  games: Game[];
}) {
  return (
    <>
      <div className="hidden gap-1 md:flex">
        {games.map((game) => {
          const pick = picks.find((p) => p.gameId === game.id);
          const pending = game.status !== "Done";
          const pts = pick?.points ?? 0;

          return (
            <div
              key={game.id}
              title={`Game ${game.id}: ${game.team1} vs ${game.team2} — Your pick: ${
                pick?.predT1 ?? "—"
              }-${pick?.predT2 ?? "—"} | Actual: ${
                pending ? "—" : `${game.actualT1}-${game.actualT2}`
              } | Pts: ${pending ? "—" : pts}`}
              className={`group relative flex h-5 w-5 items-center justify-center rounded-sm text-[9px] font-bold transition-transform duration-300 hover:scale-125 ${pointsColorClass(
                pts,
                pending
              )}`}
            >
              {pending ? "" : pts}
            </div>
          );
        })}
      </div>
      <div className="text-sm text-secondary md:hidden">
        {(() => {
          const completed = games.filter((g) => g.status === "Done");
          const withPoints = completed.filter((g) => {
            const pick = picks.find((p) => p.gameId === g.id);
            return (pick?.points ?? 0) > 0;
          }).length;
          return `${withPoints}/${completed.length} games scored`;
        })()}
      </div>
    </>
  );
}

interface LeaderboardTableProps {
  participants: Participant[];
  games: Game[];
  lastUpdated: string;
}

export default function LeaderboardTable({
  participants,
  games,
  lastUpdated,
}: LeaderboardTableProps) {
  const [previousRanks, setPreviousRanks] = useState<Record<string, number>>({});

  useEffect(() => {
    const prev = storePreviousRanks(lastUpdated, participants);
    setPreviousRanks(prev);
  }, [lastUpdated, participants]);

  const enriched = useMemo(
    () =>
      participants.map((p) => ({
        ...p,
        streak: getStreakBadge(p, games),
        bestGame: getBestGameScore(p, games),
        movement: getRankMovement(p.rank, previousRanks[p.slug]),
      })),
    [participants, games, previousRanks]
  );

  return (
    <div className="glass-card overflow-hidden rounded-xl shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-border bg-navy text-xs uppercase tracking-wider text-paper">
              <th className="px-4 py-3 font-semibold">Rank</th>
              <th className="px-4 py-3 font-semibold">Move</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Avg / Game</th>
              <th className="px-4 py-3 font-semibold">Best</th>
              <th className="px-4 py-3 font-semibold">Per Game</th>
              <th className="px-4 py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {enriched.map((p, i) => (
              <tr
                key={p.slug}
                className="animate-fade-in border-b border-border/50 transition-colors duration-300 hover:bg-teal/5"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <td className="px-4 py-4">{rankDisplay(p.rank)}</td>
                <td className={`px-4 py-4 text-sm font-bold ${p.movement.className}`}>
                  {p.movement.label}
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/picks/${p.slug}`}
                    className="group inline-flex flex-col gap-1 font-semibold text-primary transition-colors duration-300 hover:text-teal"
                  >
                    <span className="group-hover:underline">{p.displayName}</span>
                    {p.streak === "fire" && (
                      <span className="text-xs font-normal text-orange-500">🔥 On Fire</span>
                    )}
                    {p.streak === "cold" && (
                      <span className="text-xs font-normal text-blue-400">🥶 Ice Cold</span>
                    )}
                  </Link>
                </td>
                <td className="px-4 py-4 text-secondary">
                  {p.gamesScored > 0 ? p.avgPointsPerGame.toFixed(1) : "—"}
                </td>
                <td className="px-4 py-4 text-secondary">
                  {p.bestGame > 0 ? (
                    <span>
                      ⭐ {p.bestGame}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-4">
                  <GameSquares picks={p.picks} games={games} />
                </td>
                <td className="px-4 py-4 text-right text-2xl font-bold text-teal">{p.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
