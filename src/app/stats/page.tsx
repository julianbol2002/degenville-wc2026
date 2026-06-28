import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import StatsDashboard from "@/components/StatsDashboard";
import AutoRefresh from "@/components/AutoRefresh";
import { getAppData } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Stats",
  description: "Advanced statistics, fun leaderboards, and rank movement charts for Degenville WC 2026.",
};

export default async function StatsPage() {
  const data = await getAppData();

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      <SiteHeader
        activePath="/stats"
        stale={data.stale}
        rightSlot={<AutoRefresh lastUpdated={data.lastUpdated} />}
      />
      <main className="page-enter mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="mb-2 text-2xl font-bold text-primary">Stats & Analytics</h2>
        <p className="mb-8 text-secondary">
          Deep dive into group performance, fun awards, and rank trends over the tournament.
        </p>
        <StatsDashboard data={data} />
      </main>
    </div>
  );
}
