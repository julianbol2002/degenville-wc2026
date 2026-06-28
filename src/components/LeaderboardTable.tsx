"use client";

import Link from "next/link";
import type { Participant } from "@/lib/types";

function rankDisplay(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return String(rank);
}

function GameSquares({ picks, games }: { picks: Participant["picks"]; games: { id: number; status: string }[] }) {
  return (
    <>
      <div className="hidden gap-1 md:flex">
        {games.map((game) => {
          const pick = picks.find((p) => p.gameId === game.id);
          const pending = game.status !== "Done";
          const pts = pick?.points ?? 0;
          const color = pending
            ? "bg-slate-300"
            : pts > 0
              ? "bg-green-500"
              : "bg-red-500";

          return (
            <div
              key={game.id}
              title={`Game ${game.id}: ${pts} pts`}
              className={`group relative h-4 w-4 rounded-sm ${color} transition-transform hover:scale-125`}
            >
              <span className="pointer-events-none absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-navy px-2 py-1 text-xs text-white group-hover:block">
                {pending ? "Pending" : `${pts} pts`}
              </span>
            </div>
          );
        })}
      </div>
      <div className="text-sm text-slate md:hidden">
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
  games: { id: number; status: string }[];
}

export default function LeaderboardTable({ participants, games }: LeaderboardTableProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-navy text-xs uppercase tracking-wider text-white">
              <th className="px-4 py-3 font-semibold">Rank</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Avg / Game</th>
              <th className="px-4 py-3 font-semibold">Per Game</th>
              <th className="px-4 py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p, i) => (
              <tr
                key={p.slug}
                className="animate-fade-in border-b border-slate-100 transition-colors hover:bg-teal-light/50"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <td className="px-4 py-4 text-lg font-bold">{rankDisplay(p.rank)}</td>
                <td className="px-4 py-4">
                  <Link
                    href={`/picks/${p.slug}`}
                    className="font-semibold text-navy hover:text-teal hover:underline"
                  >
                    {p.displayName}
                  </Link>
                </td>
                <td className="px-4 py-4 text-slate">
                  {p.gamesScored > 0 ? p.avgPointsPerGame.toFixed(1) : "—"}
                </td>
                <td className="px-4 py-4">
                  <GameSquares picks={p.picks} games={games} />
                </td>
                <td className="px-4 py-4 text-right text-2xl font-bold text-teal">
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
