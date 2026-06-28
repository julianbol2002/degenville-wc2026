"use client";

import { useState } from "react";
import type { AppData } from "@/lib/types";
import { getPickResult } from "@/lib/scoring";

function cellClass(result: ReturnType<typeof getPickResult>): string {
  switch (result) {
    case "exact":
      return "bg-gold/20 text-navy";
    case "winner":
      return "bg-green-500/15 text-navy";
    case "wrong":
      return "bg-red-500/15 text-navy";
    case "pending":
    case "unpicked":
      return "bg-slate-100 text-slate";
  }
}

function formatPick(predT1: number | null, predT2: number | null): string {
  if (predT1 === null || predT2 === null) return "—";
  return `${predT1}-${predT2}`;
}

interface AllPicksGridProps {
  data: AppData;
}

export default function AllPicksGrid({ data }: AllPicksGridProps) {
  const [mobileParticipant, setMobileParticipant] = useState(0);
  const { games, participants } = data;

  return (
    <>
      {/* Desktop grid */}
      <div className="hidden overflow-hidden rounded-xl bg-white shadow-md lg:block">
        <div className="max-h-[80vh] overflow-auto">
          <table className="w-full min-w-max border-collapse text-sm">
            <thead>
              <tr className="bg-navy text-white">
                <th className="sticky left-0 top-0 z-20 bg-navy px-3 py-3 text-left font-semibold">
                  Game
                </th>
                {participants.map((p) => (
                  <th
                    key={p.slug}
                    className="sticky top-0 z-10 min-w-[72px] bg-navy px-2 py-3 text-center text-xs font-semibold"
                  >
                    {p.displayName.split(" ").pop()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id} className="border-b border-slate-100">
                  <td className="sticky left-0 z-10 bg-white px-3 py-2 font-medium text-navy">
                    <div>G{game.id}</div>
                    <div className="text-xs text-slate">
                      {game.team1} vs {game.team2}
                    </div>
                    {game.status === "Done" && (
                      <div className="text-xs font-bold text-teal">
                        {game.actualT1}-{game.actualT2}
                      </div>
                    )}
                  </td>
                  {participants.map((p) => {
                    const pick = p.picks.find((pk) => pk.gameId === game.id);
                    const result = getPickResult(
                      pick?.predT1 ?? null,
                      pick?.predT2 ?? null,
                      game
                    );
                    return (
                      <td
                        key={p.slug}
                        className={`px-2 py-2 text-center font-semibold ${cellClass(result)}`}
                      >
                        {formatPick(pick?.predT1 ?? null, pick?.predT2 ?? null)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile toggle view */}
      <div className="lg:hidden">
        <div className="mb-4 flex flex-wrap gap-2">
          {participants.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setMobileParticipant(i)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                mobileParticipant === i
                  ? "bg-teal text-white"
                  : "bg-white text-navy shadow-sm hover:bg-teal-light"
              }`}
            >
              {p.displayName.split(" ").pop()}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-md">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy text-white">
                <th className="px-3 py-3 text-left">Game</th>
                <th className="px-3 py-3 text-left">Result</th>
                <th className="px-3 py-3 text-left">Pick</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => {
                const p = participants[mobileParticipant];
                const pick = p.picks.find((pk) => pk.gameId === game.id);
                const result = getPickResult(
                  pick?.predT1 ?? null,
                  pick?.predT2 ?? null,
                  game
                );
                return (
                  <tr key={game.id} className="border-b border-slate-100">
                    <td className="px-3 py-3">
                      <div className="font-medium">G{game.id}</div>
                      <div className="text-xs text-slate">
                        {game.team1} vs {game.team2}
                      </div>
                    </td>
                    <td className="px-3 py-3 font-bold text-teal">
                      {game.status === "Done"
                        ? `${game.actualT1}-${game.actualT2}`
                        : "—"}
                    </td>
                    <td className={`px-3 py-3 font-semibold ${cellClass(result)}`}>
                      {formatPick(pick?.predT1 ?? null, pick?.predT2 ?? null)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
