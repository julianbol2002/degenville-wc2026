"use client";

import { useState } from "react";
import type { AppData } from "@/lib/types";
import { getPickResult } from "@/lib/scoring";
import { getConsensusPick, isSoleCorrectPick } from "@/lib/stats-utils";
import Flag from "./Flag";

function cellClass(result: ReturnType<typeof getPickResult>): string {
  switch (result) {
    case "exact":
      return "bg-gold/20 text-primary";
    case "winner":
      return "bg-correct/15 text-primary";
    case "wrong":
      return "bg-wrong/15 text-primary";
    case "pending":
    case "unpicked":
      return "bg-border/30 text-secondary";
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
  const active = participants[mobileParticipant];

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl lg:block">
        <div className="glass-card max-h-[80vh] overflow-auto">
          <table className="w-full min-w-max border-collapse text-sm">
            <thead>
              <tr className="bg-navy text-paper">
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
                <tr key={game.id} className="border-b border-border/50">
                  <td className="sticky left-0 z-10 bg-card px-3 py-2 font-medium text-primary">
                    <div>G{game.id}</div>
                    <div className="flex flex-wrap items-center gap-1 text-xs text-secondary">
                      <Flag team={game.team1} size={24} />
                      {game.team1}
                      <span>vs</span>
                      <Flag team={game.team2} size={24} />
                      {game.team2}
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
                    const sole = isSoleCorrectPick(game, p.slug, participants);
                    return (
                      <td
                        key={p.slug}
                        className={`relative px-2 py-2 text-center font-semibold transition-colors duration-300 ${cellClass(
                          result
                        )} ${sole ? "bg-gold/30 ring-1 ring-gold/60" : ""}`}
                      >
                        {sole && (
                          <span className="absolute -right-0.5 -top-0.5 text-[10px]">👑</span>
                        )}
                        {formatPick(pick?.predT1 ?? null, pick?.predT2 ?? null)}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-t-2 border-teal/30 bg-teal/10">
                <td className="sticky left-0 z-10 bg-card px-3 py-3 font-semibold text-primary">
                  Consensus
                </td>
                <td colSpan={participants.length} className="px-3 py-3">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-secondary">
                    {games.map((game) => {
                      const { pick, pct } = getConsensusPick(game, participants);
                      return (
                        <span key={game.id} className="text-primary">
                          G{game.id}: <strong className="text-teal">{pick}</strong> ({pct}%)
                        </span>
                      );
                    })}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="mb-4 flex flex-wrap gap-2">
          {participants.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setMobileParticipant(i)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ${
                mobileParticipant === i
                  ? "scale-105 bg-teal text-white shadow-md"
                  : "bg-card text-primary shadow-sm hover:bg-teal/10"
              }`}
            >
              {p.displayName.split(" ").pop()}
            </button>
          ))}
        </div>

        <div
          key={active.slug}
          className="glass-card animate-fade-in overflow-hidden rounded-xl"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy text-paper">
                <th className="px-3 py-3 text-left">Game</th>
                <th className="px-3 py-3 text-left">Result</th>
                <th className="px-3 py-3 text-left">{active.displayName.split(" ").pop()}</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => {
                const pick = active.picks.find((pk) => pk.gameId === game.id);
                const result = getPickResult(
                  pick?.predT1 ?? null,
                  pick?.predT2 ?? null,
                  game
                );
                const sole = isSoleCorrectPick(game, active.slug, participants);
                return (
                  <tr key={game.id} className="border-b border-border/50">
                    <td className="px-3 py-3">
                      <div className="font-medium text-primary">G{game.id}</div>
                      <div className="flex items-center gap-1 text-xs text-secondary">
                        <Flag team={game.team1} size={24} />
                        {game.team1}
                        <span>vs</span>
                        <Flag team={game.team2} size={24} />
                        {game.team2}
                      </div>
                    </td>
                    <td className="px-3 py-3 font-bold text-teal">
                      {game.status === "Done"
                        ? `${game.actualT1}-${game.actualT2}`
                        : "—"}
                    </td>
                    <td
                      className={`relative px-3 py-3 font-semibold ${cellClass(result)} ${
                        sole ? "bg-gold/30" : ""
                      }`}
                    >
                      {sole && "👑 "}
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
