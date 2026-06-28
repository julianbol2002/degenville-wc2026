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
  if (rank === 1) {
    return <span className="rounded-sm bg-espn-red px-2 py-1 text-sm font-bold text-white">1ST</span>;
  }
  if (rank === 2) {
    return <span className="rounded-sm bg-neutral-700 px-2 py-1 text-sm font-bold text-white">2ND</span>;
  }
  if (rank === 3) {
    return <span className="rounded-sm bg-neutral-500 px-2 py-1 text-sm font-bold text-white">3RD</span>;
  }
  return <span className="font-display text-sm font-bold text-primary">#{rank}</span>;
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
          <h2 className="font-display text-3xl font-bold text-primary">{participant.displayName}</h2>
          <span className="mt-2 inline-block">{rankBadge(participant.rank)}</span>
        </div>
        <div className="text-right">
          <p className="text-sm uppercase tracking-wider text-secondary">Total Points</p>
          <p className="font-display text-4xl font-bold text-espn-red">{participant.totalPoints}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "Exact Scores", value: exact },
          { label: "Correct Winners", value: winners },
          { label: "Wrong Picks", value: wrong },
          { label: "Pending", value: pending },
        ].map((stat) => (
          <div key={stat.label} className="rounded-sm border border-border bg-card p-3 text-center">
            <p className="font-display text-2xl font-bold text-espn-red">{stat.value}</p>
            <p className="text-xs uppercase tracking-wide text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-3 font-display text-sm font-bold tracking-wider text-secondary">
          Pre-Tournament Bonus Picks
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Champion", value: participant.championPick },
            { label: "Finalist 1", value: participant.finalist1 },
            { label: "Finalist 2", value: participant.finalist2 },
          ].map((pick) => (
            <div key={pick.label} className="flex items-center gap-3 rounded-sm border border-border bg-card p-4">
              {pick.value && <Flag team={pick.value} size={32} />}
              <div>
                <p className="text-xs font-semibold uppercase text-secondary">{pick.label}</p>
                <p className="font-semibold text-primary">{pick.value || "—"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
