"use client";

import Link from "next/link";
import type { Game, Participant } from "@/lib/types";
import { getHeadToHead } from "@/lib/stats-utils";

interface HeadToHeadProps {
  participant: Participant;
  others: Participant[];
  games: Game[];
}

export default function HeadToHead({ participant, others, games }: HeadToHeadProps) {
  return (
    <section className="mt-10">
      <h3 className="mb-4 text-lg font-bold text-primary">Head to Head</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {others
          .filter((o) => o.slug !== participant.slug)
          .map((other) => {
            const h2h = getHeadToHead(participant, other, games);
            return (
              <div key={other.slug} className="glass-card rounded-xl p-4 transition-colors duration-300">
                <Link
                  href={`/picks/${other.slug}`}
                  className="font-semibold text-primary hover:text-teal hover:underline"
                >
                  vs {other.displayName}
                </Link>
                <div className="mt-2 space-y-1 text-sm text-secondary">
                  <p>Agreed: {h2h.agreed} games</p>
                  <p>Disagreed: {h2h.disagreed} games</p>
                  <p>
                    Points leader: <strong className="text-teal">{h2h.pointsLeader}</strong> (
                    {h2h.pointDiff} pt diff)
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}
