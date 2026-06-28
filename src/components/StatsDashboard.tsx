"use client";

import { useState } from "react";
import type { AppData, Participant } from "@/lib/types";
import {
  buildRankHistorySeries,
  computeFunStats,
  getSparklinePoints,
  getStreakBadge,
} from "@/lib/stats-utils";

function Sparkline({ values }: { values: number[] }) {
  if (values.length === 0) {
    return <svg width="120" height="32" className="text-secondary" />;
  }

  const max = Math.max(...values, 1);
  const w = 120;
  const h = 32;
  const points = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * w;
      const y = h - (v / max) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        fill="none"
        stroke="#2A9D8F"
        strokeWidth="2"
        points={points}
        className="chart-line"
      />
    </svg>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass-card rounded-xl p-4 transition-colors duration-300">
      <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{label}</p>
      <p className="mt-2 text-2xl font-bold text-teal">{value}</p>
    </div>
  );
}

interface StatsDashboardProps {
  data: AppData;
}

const LINE_COLORS = [
  "#2A9D8F",
  "#FFD700",
  "#EF4444",
  "#22C55E",
  "#818CF8",
  "#F97316",
  "#EC4899",
  "#14B8A6",
];

export default function StatsDashboard({ data }: StatsDashboardProps) {
  const fun = computeFunStats(data);
  const rankSeries = buildRankHistorySeries(data.participants, data.games);
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const toggleLine = (slug: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const chartW = 600;
  const chartH = 300;
  const maxGame = 16;
  const maxRank = data.participants.length;

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Points Scored" value={fun.totalPoints} />
        <StatCard label="Avg Pts / Game" value={fun.avgPerGame.toFixed(1)} />
        <StatCard label="Games Completed" value={`${fun.gamesCompleted}/16`} />
        <StatCard label="Most Picked Upset" value={fun.mostPickedUpset} />
      </div>

      <section>
        <h3 className="mb-4 text-lg font-bold text-primary">Participant Profiles</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.participants.map((p: Participant) => {
            const streak = getStreakBadge(p, data.games);
            return (
              <div key={p.slug} className="glass-card rounded-xl p-4 transition-colors duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-primary">{p.displayName}</p>
                    <p className="text-sm text-secondary">Rank #{p.rank}</p>
                  </div>
                  <p className="text-xl font-bold text-teal">{p.totalPoints}</p>
                </div>
                {streak === "fire" && <p className="mt-1 text-xs text-orange-500">🔥 On Fire</p>}
                {streak === "cold" && <p className="mt-1 text-xs text-blue-400">🥶 Ice Cold</p>}
                <div className="mt-3">
                  <Sparkline values={getSparklinePoints(p, data.games)} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {[
          { title: "Sharpshooter 🎯", person: fun.sharpshooter, stat: "exact scores" },
          { title: "Upset King 👑", person: fun.upsetKing, stat: "rare correct upsets" },
          { title: "One-Trick Pony 🐴", person: fun.oneTrickPony, stat: "best single game" },
          { title: "Consistency King 👑", person: fun.consistencyKing, stat: "lowest variance" },
          { title: "Bracket Buster 💥", person: fun.bracketBuster, stat: "most upset picks" },
          { title: "Deadweight 💀", person: fun.deadweight, stat: "fewest points" },
        ].map((item) => (
          <div key={item.title} className="glass-card rounded-xl p-5 transition-colors duration-300">
            <h4 className="font-bold text-primary">{item.title}</h4>
            <p className="mt-2 text-teal">{item.person?.displayName ?? "—"}</p>
            <p className="text-xs text-secondary">{item.stat}</p>
          </div>
        ))}
      </section>

      <section>
        <h3 className="mb-4 text-lg font-bold text-primary">Rank Movement Over Time</h3>
        <div className="glass-card overflow-x-auto rounded-xl p-4">
          <svg width={chartW} height={chartH} className="mx-auto">
            {[1, 5, 10, 17].map((rank) => {
              const y = ((rank - 1) / (maxRank - 1)) * (chartH - 40) + 20;
              return (
                <g key={rank}>
                  <line x1={40} y1={y} x2={chartW - 20} y2={y} stroke="var(--border)" strokeDasharray="4" />
                  <text x={5} y={y + 4} fill="var(--text-secondary)" fontSize="10">
                    #{rank}
                  </text>
                </g>
              );
            })}
            {rankSeries.map((series, idx) => {
              if (hidden.has(series.slug) || series.points.length === 0) return null;
              const pts = series.points
                .map((p) => {
                  const x = 40 + ((p.x - 1) / (maxGame - 1)) * (chartW - 60);
                  const y = ((p.y - 1) / (maxRank - 1)) * (chartH - 40) + 20;
                  return `${x},${y}`;
                })
                .join(" ");
              return (
                <polyline
                  key={series.slug}
                  fill="none"
                  stroke={LINE_COLORS[idx % LINE_COLORS.length]}
                  strokeWidth="2"
                  points={pts}
                  className="chart-line"
                />
              );
            })}
          </svg>
          <div className="mt-4 flex flex-wrap gap-2">
            {rankSeries.map((series, idx) => (
              <button
                key={series.slug}
                type="button"
                onClick={() => toggleLine(series.slug)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-300 ${
                  hidden.has(series.slug)
                    ? "bg-border text-secondary line-through"
                    : "bg-teal/20 text-primary"
                }`}
                style={{ borderLeft: `3px solid ${LINE_COLORS[idx % LINE_COLORS.length]}` }}
              >
                {series.name.split(" ").pop()}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
