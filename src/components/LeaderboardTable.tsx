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
  if (rank === 1) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-espn-red text-sm font-bold text-white">
        1
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-neutral-700 text-sm font-bold text-white">
        2
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-neutral-500 text-sm font-bold text-white">
        3
      </span>
    );
  }
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
    <div className="overflow-hidden rounded-sm border border-border bg-card shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="espn-table-head text-xs uppercase">
              <th className="px-4 py-3 font-semibold">Rank</th>
              <th className="px-4 py-3 font-semibold">Move</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">Avg / Game</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">Best</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">Per Game</th>
              <th className="px-4 py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {enriched.map((p, i) => (
              <tr
                key={p.slug}
                className="animate-fade-in border-b border-border/60 transition-colors duration-300 hover:bg-black/5 dark:hover:bg-white/5"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <td className="px-4 py-4">{rankDisplay(p.rank)}</td>
                <td className={`px-4 py-4 text-sm font-bold ${p.movement.className}`}>
                  {p.movement.label}
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/picks/${p.slug}`}
                    className="group inline-flex flex-col gap-1 font-semibold text-primary transition-colors duration-300 hover:text-espn-red"
                  >
                    <span className="group-hover:underline">{p.displayName}</span>
                    {p.streak === "fire" && (
                      <span className="text-xs font-normal text-espn-red">HOT STREAK</span>
                    )}
                    {p.streak === "cold" && (
                      <span className="text-xs font-normal text-secondary">COLD STREAK</span>
                    )}
                  </Link>
                </td>
                <td className="hidden px-4 py-4 text-secondary sm:table-cell">
                  {p.gamesScored > 0 ? p.avgPointsPerGame.toFixed(1) : "—"}
                </td>
                <td className="hidden px-4 py-4 font-semibold text-primary sm:table-cell">
                  {p.bestGame > 0 ? p.bestGame : "—"}
                </td>
                <td className="hidden px-4 py-4 sm:table-cell">
                  <GameSquares picks={p.picks} games={games} />
                </td>
                <td className="px-4 py-4 text-right font-display text-2xl font-bold text-espn-red">
                  {p.totalPoints}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
