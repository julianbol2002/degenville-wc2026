import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import BonusPicks from "@/components/BonusPicks";
import ParticipantPicksTable from "@/components/ParticipantPicksTable";
import BackLink from "@/components/BackLink";
import AutoRefresh from "@/components/AutoRefresh";
import { getAppData } from "@/lib/data";
import { PARTICIPANTS, getParticipantBySlug } from "@/lib/participants";

export const revalidate = 60;

export function generateStaticParams() {
  return PARTICIPANTS.map((p) => ({ name: p.slug }));
}

interface PageProps {
  params: { name: string };
}

function rankBadge(rank: number): string {
  if (rank === 1) return "🥇 1st";
  if (rank === 2) return "🥈 2nd";
  if (rank === 3) return "🥉 3rd";
  return `#${rank}`;
}

export default async function ParticipantPage({ params }: PageProps) {
  const config = getParticipantBySlug(params.name);
  if (!config) notFound();

  const data = await getAppData();
  const participant = data.participants.find((p) => p.slug === params.name);
  if (!participant) notFound();

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader
        activePath="/picks"
        stale={data.stale}
        rightSlot={<AutoRefresh lastUpdated={data.lastUpdated} />}
      />
      <main className="page-enter mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackLink />
        </div>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-navy">{participant.displayName}</h2>
            <span className="mt-2 inline-block rounded-full bg-teal-light px-3 py-1 text-sm font-semibold text-teal">
              {rankBadge(participant.rank)}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate">Total Points</p>
            <p className="text-4xl font-bold text-teal">{participant.totalPoints}</p>
          </div>
        </div>

        <BonusPicks
          championPick={participant.championPick}
          finalist1={participant.finalist1}
          finalist2={participant.finalist2}
        />

        <h3 className="mb-4 text-lg font-bold text-navy">Game-by-Game Picks</h3>
        <ParticipantPicksTable participant={participant} games={data.games} />
      </main>
    </div>
  );
}
