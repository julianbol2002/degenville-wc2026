import SiteHeader from "@/components/SiteHeader";
import AllPicksGrid from "@/components/AllPicksGrid";
import AutoRefresh from "@/components/AutoRefresh";
import { getAppData } from "@/lib/data";

export const revalidate = 60;

export default async function AllPicksPage() {
  const data = await getAppData();

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader
        activePath="/picks"
        stale={data.stale}
        rightSlot={<AutoRefresh lastUpdated={data.lastUpdated} />}
      />
      <main className="page-enter mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="mb-2 text-2xl font-bold text-navy">All Picks</h2>
        <p className="mb-8 text-slate">
          Every prediction across all 17 participants — green = correct winner, gold = exact score, red = wrong.
        </p>
        <AllPicksGrid data={data} />
      </main>
    </div>
  );
}
