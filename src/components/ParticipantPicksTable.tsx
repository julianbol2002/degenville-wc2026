import Flag from "./Flag";
import type { Game, Participant } from "@/lib/types";
import { getPickResult, getResultLabel } from "@/lib/scoring";
import { cumulativeGradient } from "@/lib/stats-utils";

function rowClass(result: ReturnType<typeof getPickResult>): string {
  switch (result) {
    case "exact":
      return "bg-gold/15";
    case "winner":
      return "bg-correct/10";
    case "wrong":
      return "bg-wrong/10";
    case "pending":
    case "unpicked":
      return "bg-card";
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
  const maxPossible = games.filter((g) => g.status === "Done").length * 9;

  return (
    <div className="glass-card overflow-hidden rounded-xl shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="espn-table-head text-xs uppercase tracking-wider text-white">
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
              const progress = maxPossible > 0 ? cumulative / maxPossible : 0;

              return (
                <tr
                  key={game.id}
                  className={`border-b border-border/50 transition-colors duration-300 ${rowClass(result)}`}
                >
                  <td className="px-4 py-3 font-medium text-primary">{game.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Flag team={game.team1} size={24} />
                      <span className="text-primary">{game.team1}</span>
                      <span className="text-secondary">vs</span>
                      <Flag team={game.team2} size={24} />
                      <span className="text-primary">{game.team2}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-primary">
                    {formatScore(pick?.predT1 ?? null, pick?.predT2 ?? null)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-espn-red">
                    {game.status === "Done"
                      ? formatScore(game.actualT1, game.actualT2)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 font-bold text-primary">
                    {game.status === "Done" ? pick?.points ?? 0 : "—"}
                  </td>
                  <td className="px-4 py-3 text-primary">
                    {getResultLabel(result)}
                  </td>
                  <td
                    className="px-4 py-3 text-right font-bold"
                    style={{
                      color:
                        game.status === "Done" ? cumulativeGradient(progress) : undefined,
                    }}
                  >
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
