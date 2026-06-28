import type { Game, Participant } from "@/lib/types";
import { getPopularPick } from "@/lib/scoring";

interface BracketCardProps {
  game: Game;
  participants: Participant[];
}

export default function BracketCard({ game, participants }: BracketCardProps) {
  const isDone = game.status === "Done" && game.actualT1 !== null && game.actualT2 !== null;
  const team1Wins = isDone && game.actualT1! > game.actualT2!;
  const team2Wins = isDone && game.actualT2! > game.actualT1!;
  const popular = getPopularPick(game.id, participants, game.team1, game.team2);

  return (
    <div className="rounded-xl bg-white p-4 shadow-md transition-shadow hover:shadow-lg">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="text-xs font-medium uppercase text-slate">Game {game.id}</span>
        <span className="rounded-full bg-navy/10 px-2 py-0.5 text-xs font-semibold text-navy">
          {game.date}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span
          className={`flex-1 text-right text-sm font-semibold sm:text-base ${
            team1Wins ? "text-teal" : "text-navy"
          }`}
        >
          {game.team1}
        </span>
        <div className="flex items-center gap-2 px-2">
          <span className={`text-2xl font-bold ${isDone ? "text-navy" : "text-slate-300"}`}>
            {isDone ? game.actualT1 : "?"}
          </span>
          <span className="text-xs font-bold text-slate">VS</span>
          <span className={`text-2xl font-bold ${isDone ? "text-navy" : "text-slate-300"}`}>
            {isDone ? game.actualT2 : "?"}
          </span>
        </div>
        <span
          className={`flex-1 text-left text-sm font-semibold sm:text-base ${
            team2Wins ? "text-teal" : "text-navy"
          }`}
        >
          {game.team2}
        </span>
      </div>

      <div className="mt-3 flex justify-center">
        {isDone ? (
          <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold uppercase text-green-600">
            Final
          </span>
        ) : (
          <span className="animate-pulse rounded-full bg-slate-200 px-3 py-1 text-xs font-bold uppercase text-slate">
            Upcoming
          </span>
        )}
      </div>

      <p className="mt-3 border-t border-slate-100 pt-3 text-center text-xs text-slate">
        {popular.total > 0 ? (
          <>
            {popular.count}/{popular.total} picked{" "}
            <strong className="text-navy">{popular.team}</strong>
          </>
        ) : (
          "No picks yet"
        )}
      </p>
    </div>
  );
}
