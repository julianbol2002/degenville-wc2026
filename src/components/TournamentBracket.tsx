"use client";

import { useMemo } from "react";
import BracketGameCard from "./BracketGameCard";
import Flag from "./Flag";
import type { Game } from "@/lib/types";
import type { BracketProgression, BracketGame } from "@/lib/bracket-types";
import { getWinner } from "@/lib/bracket-types";

interface TournamentBracketProps {
  r32Games: Game[];
  progression: BracketProgression;
}

const CARD_H = 64;
const CARD_GAP = 8;
const COL_W = 200;
const COL_GAP = 100;

function r32Y(index: number): number {
  return index * (CARD_H + CARD_GAP);
}

function pairCenterY(i: number, count: number): number {
  const y1 = r32Y(i * 2);
  const y2 = r32Y(i * 2 + 1);
  if (i * 2 + 1 >= count) return y1 + CARD_H / 2;
  return (y1 + y2 + CARD_H) / 2;
}

function columnY(index: number, total: number, containerHeight: number): number {
  const slotH = containerHeight / total;
  return index * slotH + slotH / 2 - CARD_H / 2;
}

export default function TournamentBracket({ r32Games, progression }: TournamentBracketProps) {
  const r32: BracketGame[] = r32Games.map((g) => ({
    id: g.id,
    team1: g.team1,
    team2: g.team2,
    actual_t1: g.actualT1,
    actual_t2: g.actualT2,
    date: g.date,
    status: g.status,
  }));

  const r32Height = r32.length * (CARD_H + CARD_GAP);
  const champion =
    progression.champion ||
    (progression.final[0] ? getWinner(progression.final[0]) : null) ||
    "";

  const rounds = useMemo(
    () => [
      { label: "R32", games: r32, count: 16 },
      { label: "R16", games: progression.r16, count: 8 },
      { label: "QF", games: progression.qf, count: 4 },
      { label: "SF", games: progression.sf, count: 2 },
      { label: "Final", games: progression.final, count: 1 },
    ],
    [r32, progression]
  );

  const svgWidth = 80 + rounds.length * (COL_W + COL_GAP) + 160;
  const svgHeight = Math.max(r32Height, 600);

  return (
    <div className="relative overflow-x-auto rounded-xl border border-border bg-card/50 p-4 transition-colors duration-300">
      <div className="sticky left-0 z-20 float-left mr-4 w-12 space-y-[calc(4*4.5rem+2rem)] pt-8">
        {rounds.map((r) => (
          <div
            key={r.label}
            className="flex h-16 items-center text-xs font-bold uppercase tracking-wider text-teal"
            style={{ marginTop: r.label === "R32" ? 0 : undefined }}
          >
            {r.label}
          </div>
        ))}
        <div className="flex h-24 items-center text-xs font-bold uppercase text-gold">🏆</div>
      </div>

      <div className="min-w-[1100px]" style={{ marginLeft: "3rem" }}>
        <svg
          width={svgWidth}
          height={svgHeight}
          className="absolute left-16 top-4 pointer-events-none"
          style={{ minWidth: svgWidth }}
        >
          {progression.r16.map((_, i) => {
            const x1 = COL_W;
            const y1 = pairCenterY(i, r32.length) + 20;
            const x2 = COL_W + COL_GAP;
            const y2 = columnY(i, 8, r32Height) + CARD_H / 2 + 20;
            return (
              <g key={`r32-r16-${i}`}>
                <path
                  d={`M ${x1} ${y1} H ${x1 + 30} V ${y2} H ${x2}`}
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="2"
                  className="chart-line"
                />
              </g>
            );
          })}
          {[0, 1, 2, 3].map((i) => {
            const x1 = COL_W + COL_GAP + COL_W;
            const y1 = columnY(i * 2, 8, r32Height) + CARD_H / 2 + 20;
            const y1b = columnY(i * 2 + 1, 8, r32Height) + CARD_H / 2 + 20;
            const x2 = COL_W * 2 + COL_GAP * 2;
            const y2 = columnY(i, 4, r32Height) + CARD_H / 2 + 20;
            const midY = (y1 + y1b) / 2;
            return (
              <path
                key={`r16-qf-${i}`}
                d={`M ${x1} ${y1} H ${x1 + 20} V ${midY} H ${x2 - 20} V ${y2} H ${x2}`}
                fill="none"
                stroke="var(--border)"
                strokeWidth="2"
                opacity="0.6"
              />
            );
          })}
        </svg>

        <div className="relative flex gap-[100px]">
          <div className="flex flex-col gap-2" style={{ width: COL_W }}>
            {r32.map((game) => (
              <BracketGameCard key={game.id} game={game} compact />
            ))}
          </div>

          <div className="relative flex flex-col justify-around" style={{ width: COL_W, height: r32Height }}>
            {progression.r16.map((game) => (
              <BracketGameCard key={game.id} game={game} compact />
            ))}
          </div>

          <div className="relative flex flex-col justify-around" style={{ width: COL_W, height: r32Height }}>
            {progression.qf.map((game) => (
              <BracketGameCard key={game.id} game={game} compact />
            ))}
          </div>

          <div className="relative flex flex-col justify-around" style={{ width: COL_W, height: r32Height }}>
            {progression.sf.map((game) => (
              <BracketGameCard key={game.id} game={game} compact />
            ))}
          </div>

          <div className="flex items-center" style={{ width: COL_W, height: r32Height }}>
            {progression.final.map((game) => (
              <BracketGameCard key={game.id} game={game} isFinal />
            ))}
          </div>

          <div className="flex items-center" style={{ width: 140, height: r32Height }}>
            <div
              className={`relative flex w-full flex-col items-center justify-center rounded-xl border-2 p-4 text-center transition-all duration-300 ${
                champion
                  ? "gold-glow border-gold bg-gradient-to-br from-gold/30 to-teal/20"
                  : "border-border bg-card/50"
              }`}
            >
              {champion && (
                <>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span
                      key={i}
                      className="confetti-piece"
                      style={{
                        left: `${10 + (i % 4) * 20}%`,
                        top: `${(i % 3) * 10}%`,
                        backgroundColor: ["#FFD700", "#2A9D8F", "#EF4444", "#22C55E"][i % 4],
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </>
              )}
              <span className="text-3xl">🏆</span>
              {champion ? (
                <>
                  <Flag team={champion} size={32} className="mt-2" />
                  <p className="mt-2 text-sm font-bold text-primary">{champion}</p>
                </>
              ) : (
                <p className="mt-2 animate-pulse-soft text-sm text-secondary">TBD</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
