"use client";

import Flag from "./Flag";
import type { BracketGame } from "@/lib/bracket-types";
import { getWinner, isComplete, isPending } from "@/lib/bracket-types";

interface BracketGameCardProps {
  game: BracketGame;
  compact?: boolean;
  isFinal?: boolean;
}

export default function BracketGameCard({ game, compact, isFinal }: BracketGameCardProps) {
  const complete = isComplete(game);
  const pending = isPending(game);
  const winner = getWinner(game);
  const team1 = game.team1 || "TBD";
  const team2 = game.team2 || "TBD";

  return (
    <div
      className={`glass-card rounded-lg p-2 transition-all duration-300 ${
        isFinal ? "gold-glow border-gold/50" : ""
      } ${compact ? "min-w-[180px]" : "min-w-[200px]"}`}
    >
      <div className="mb-1 flex items-center justify-between text-[10px] text-secondary">
        <span>G{game.id}</span>
        {pending ? (
          <span className="animate-pulse-soft rounded bg-secondary/20 px-1.5 py-0.5 font-bold uppercase">
            Upcoming
          </span>
        ) : complete ? (
          <span className="rounded bg-correct/20 px-1.5 py-0.5 font-bold uppercase text-correct">
            Final
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-1.5">
        <Flag team={team1} size={24} />
        <span
          className={`flex-1 truncate text-xs font-semibold ${
            winner === team1 ? "text-teal" : "text-primary"
          }`}
        >
          {team1}
        </span>
        <span className="px-1 text-sm font-bold text-primary">
          {complete ? game.actual_t1 : "?"}
        </span>
        <span className="text-[10px] text-secondary">-</span>
        <span className="px-1 text-sm font-bold text-primary">
          {complete ? game.actual_t2 : "?"}
        </span>
        <span
          className={`flex-1 truncate text-right text-xs font-semibold ${
            winner === team2 ? "text-teal" : "text-primary"
          }`}
        >
          {team2}
        </span>
        <Flag team={team2} size={24} />
      </div>
    </div>
  );
}
