"use client";

import Flag from "./Flag";
import type { Game, Participant } from "@/lib/types";
import {
  getCorrectWinnerCount,
  getExactScoreCount,
  getPendingCount,
  getWrongPickCount,
} from "@/lib/stats-utils";

interface ParticipantProfileProps {
  participant: Participant;
  games: Game[];
}

function rankBadge(rank: number): React.ReactNode {
  if (rank === 1) return <span className="shimmer-gold">🥇 1st</span>;
  if (rank === 2) return <span className="shimmer-silver">🥈 2nd</span>;
  if (rank === 3) return <span className="shimmer-bronze">🥉 3rd</span>;
  return `#${rank}`;
}

export default function ParticipantProfile({ participant, games }: ParticipantProfileProps) {
  const exact = getExactScoreCount(participant, games);
  const winners = getCorrectWinnerCount(participant, games);
  const wrong = getWrongPickCount(participant, games);
  const pending = getPendingCount(participant, games);

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">{participant.displayName}</h2>
          <span className="mt-2 inline-block rounded-full bg-teal/15 px-3 py-1 text-sm font-semibold text-teal">
            {rankBadge(participant.rank)}
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm text-secondary">Total Points</p>
          <p className="text-4xl font-bold text-teal">{participant.totalPoints}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "Exact Scores", value: exact, color: "text-gold" },
          { label: "Correct Winners", value: winners, color: "text-correct" },
          { label: "Wrong Picks", value: wrong, color: "text-wrong" },
          { label: "Pending", value: pending, color: "text-secondary" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-lg p-3 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-secondary">
          Pre-Tournament Bonus Picks
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Champion", value: participant.championPick },
            { label: "Finalist 1", value: participant.finalist1 },
            { label: "Finalist 2", value: participant.finalist2 },
          ].map((pick) => (
            <div key={pick.label} className="glass-card flex items-center gap-3 rounded-xl p-4">
              {pick.value && <Flag team={pick.value} size={32} />}
              <div>
                <p className="text-xs font-semibold uppercase text-secondary">{pick.label}</p>
                <p className="font-bold text-primary">{pick.value || "—"}</p>
                <p className="text-xs text-secondary">Pending — tournament in progress</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
