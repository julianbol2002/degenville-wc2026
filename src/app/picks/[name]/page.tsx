import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import ParticipantProfile from "@/components/ParticipantProfile";
import ParticipantPicksTable from "@/components/ParticipantPicksTable";
import HeadToHead from "@/components/HeadToHead";
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const config = getParticipantBySlug(params.name);
  return {
    title: config?.displayName ?? "Participant",
    description: `${config?.displayName ?? "Participant"} picks and stats for Degenville World Cup 2026.`,
  };
}

export default async function ParticipantPage({ params }: PageProps) {
  const config = getParticipantBySlug(params.name);
  if (!config) notFound();

  const data = await getAppData();
  const participant = data.participants.find((p) => p.slug === params.name);
  if (!participant) notFound();

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      <SiteHeader
        activePath="/picks"
        stale={data.stale}
        rightSlot={<AutoRefresh lastUpdated={data.lastUpdated} />}
      />
      <main className="page-enter mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackLink />
        </div>

        <ParticipantProfile participant={participant} games={data.games} />

        <h3 className="mb-4 text-lg font-bold text-primary">Game-by-Game Picks</h3>
        <ParticipantPicksTable participant={participant} games={data.games} />

        <HeadToHead
          participant={participant}
          others={data.participants}
          games={data.games}
        />
      </main>
    </div>
  );
}
