import SiteHeader from "@/components/SiteHeader";
import BracketCard from "@/components/BracketCard";
import AutoRefresh from "@/components/AutoRefresh";
import { getAppData } from "@/lib/data";

export const revalidate = 60;

export default async function BracketPage() {
  const data = await getAppData();
  const sortedGames = [...data.games].sort((a, b) => {
    const dateA = a.date || "";
    const dateB = b.date || "";
    return dateA.localeCompare(dateB) || a.id - b.id;
  });

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader
        activePath="/bracket"
        stale={data.stale}
        rightSlot={<AutoRefresh lastUpdated={data.lastUpdated} />}
      />
      <main className="page-enter mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="mb-2 text-2xl font-bold uppercase tracking-wide text-navy">
          ROUND OF 32
        </h2>
        <p className="mb-8 text-slate">Degenville World Cup 2026 bracket</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {sortedGames.map((game) => (
            <BracketCard key={game.id} game={game} participants={data.participants} />
          ))}
        </div>
      </main>
    </div>
  );
}
