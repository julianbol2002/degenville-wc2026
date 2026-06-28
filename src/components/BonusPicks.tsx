interface BonusPicksProps {
  championPick: string | null;
  finalist1: string | null;
  finalist2: string | null;
}

function PickCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate">{label}</p>
      <p className="mt-2 text-lg font-bold text-navy">{value || "—"}</p>
      <p className="mt-2 text-xs text-slate">Pending — tournament in progress</p>
    </div>
  );
}

export default function BonusPicks({
  championPick,
  finalist1,
  finalist2,
}: BonusPicksProps) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-lg font-bold text-navy">Pre-Tournament Bonus Picks</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <PickCard label="Champion Pick" value={championPick} />
        <PickCard label="Finalist 1" value={finalist1} />
        <PickCard label="Finalist 2" value={finalist2} />
      </div>
    </section>
  );
}
