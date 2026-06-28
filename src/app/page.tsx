import SiteHeader from "@/components/SiteHeader";
import StatsBar from "@/components/StatsBar";
import LeaderboardTable from "@/components/LeaderboardTable";
import AutoRefresh from "@/components/AutoRefresh";
import { getAppData } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const data = await getAppData();
  const gamesScored = data.games.filter((g) => g.status === "Done").length;

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader
        activePath="/"
        stale={data.stale}
        rightSlot={<AutoRefresh lastUpdated={data.lastUpdated} />}
      />
      <StatsBar
        gamesScored={gamesScored}
        totalGames={data.games.length}
        totalParticipants={data.participants.length}
      />
      <main className="page-enter mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold text-navy">Leaderboard</h2>
        <LeaderboardTable participants={data.participants} games={data.games} />
      </main>
    </div>
  );
}
