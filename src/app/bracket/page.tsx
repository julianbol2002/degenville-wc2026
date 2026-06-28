import type { Metadata } from "next";
import { readFile } from "fs/promises";
import path from "path";
import SiteHeader from "@/components/SiteHeader";
import TournamentBracket from "@/components/TournamentBracket";
import AutoRefresh from "@/components/AutoRefresh";
import { getAppData } from "@/lib/data";
import type { BracketProgression } from "@/lib/bracket-types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Bracket",
  description: "Full World Cup 2026 tournament bracket from Round of 32 through the Final.",
};

async function getBracketProgression(): Promise<BracketProgression> {
  const file = await readFile(
    path.join(process.cwd(), "public", "bracket-progression.json"),
    "utf-8"
  );
  return JSON.parse(file) as BracketProgression;
}

export default async function BracketPage() {
  const [data, progression] = await Promise.all([getAppData(), getBracketProgression()]);

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      <SiteHeader
        activePath="/bracket"
        stale={data.stale}
        rightSlot={<AutoRefresh lastUpdated={data.lastUpdated} />}
      />
      <main className="page-enter mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="mb-2 text-2xl font-bold uppercase tracking-wide text-primary">
          Tournament Bracket
        </h2>
        <p className="mb-8 text-secondary">
          Round of 32 from the live sheet · later rounds updated via bracket-progression.json
        </p>
        <TournamentBracket r32Games={data.games} progression={progression} />
      </main>
    </div>
  );
}
