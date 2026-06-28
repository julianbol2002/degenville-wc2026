import type { Game, Participant } from "@/lib/types";
import { getPickResult, getResultLabel } from "@/lib/scoring";

function rowClass(result: ReturnType<typeof getPickResult>): string {
  switch (result) {
    case "exact":
      return "bg-gold/15";
    case "winner":
      return "bg-green-500/10";
    case "wrong":
      return "bg-red-500/10";
    case "pending":
    case "unpicked":
      return "bg-slate-50";
  }
}

function formatScore(t1: number | null, t2: number | null): string {
  if (t1 === null || t2 === null) return "—";
  return `${t1}-${t2}`;
}

interface ParticipantPicksTableProps {
  participant: Participant;
  games: Game[];
}

export default function ParticipantPicksTable({
  participant,
  games,
}: ParticipantPicksTableProps) {
  let cumulative = 0;

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-navy text-xs uppercase tracking-wider text-white">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Teams</th>
              <th className="px-4 py-3">Their Pick</th>
              <th className="px-4 py-3">Actual</th>
              <th className="px-4 py-3">Pts</th>
              <th className="px-4 py-3">Result</th>
              <th className="px-4 py-3 text-right">Running Total</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => {
              const pick = participant.picks.find((p) => p.gameId === game.id);
              const result = getPickResult(
                pick?.predT1 ?? null,
                pick?.predT2 ?? null,
                game
              );
              if (game.status === "Done") {
                cumulative += pick?.points ?? 0;
              }

              return (
                <tr key={game.id} className={`border-b border-slate-100 ${rowClass(result)}`}>
                  <td className="px-4 py-3 font-medium">{game.id}</td>
                  <td className="px-4 py-3">
                    {game.team1} vs {game.team2}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {formatScore(pick?.predT1 ?? null, pick?.predT2 ?? null)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-teal">
                    {game.status === "Done"
                      ? formatScore(game.actualT1, game.actualT2)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 font-bold">
                    {game.status === "Done" ? pick?.points ?? 0 : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {result === "exact" && <span className="mr-1">⭐</span>}
                    {getResultLabel(result)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-teal">
                    {game.status === "Done" ? cumulative : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
