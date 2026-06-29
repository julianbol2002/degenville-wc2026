"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Game, Participant } from "@/lib/types";
import {
  getBestGameScore,
  getRankMovement,
  getStreakBadge,
  pointsColorClass,
  storePreviousRanks,
} from "@/lib/stats-utils";
import { getAllProfiles, upsertProfile, uploadAvatar } from "@/lib/supabase";
import type { DegenProfile } from "@/lib/supabase";
import ProfileEditor from "@/components/ProfileEditor";

function rankDisplay(rank: number): React.ReactNode {
  if (rank === 1) return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-espn-red text-sm font-bold text-white">1</span>
  );
  if (rank === 2) return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-neutral-700 text-sm font-bold text-white">2</span>
  );
  if (rank === 3) return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-neutral-500 text-sm font-bold text-white">3</span>
  );
  return <span className="text-lg font-bold text-primary">{rank}</span>;
}

function GameSquares({ picks, games }: { picks: Participant["picks"]; games: Game[] }) {
  return (
    <>
      <div className="hidden gap-1 md:flex">
        {games.map((game) => {
          const pick = picks.find((p) => p.gameId === game.id);
          const pending = game.status !== "Done";
          const pts = pick?.points ?? 0;
          return (
            <div
              key={game.id}
              title={`Game ${game.id}: ${game.team1} vs ${game.team2} — Your pick: ${pick?.predT1 ?? "—"}-${pick?.predT2 ?? "—"} | Actual: ${pending ? "—" : `${game.actualT1}-${game.actualT2}`} | Pts: ${pending ? "—" : pts}`}
              className={`group relative flex h-5 w-5 items-center justify-center rounded-sm text-[9px] font-bold transition-transform duration-300 hover:scale-125 ${pointsColorClass(pts, pending)}`}
            >
              {pending ? "" : pts}
            </div>
          );
        })}
      </div>
      <div className="text-sm text-secondary md:hidden">
        {(() => {
          const completed = games.filter((g) => g.status === "Done");
          const withPoints = completed.filter((g) => {
            const pick = picks.find((p) => p.gameId === g.id);
            return (pick?.points ?? 0) > 0;
          }).length;
          return `${withPoints}/${completed.length} games scored`;
        })()}
      </div>
    </>
  );
}

interface LeaderboardTableProps {
  participants: Participant[];
  games: Game[];
  lastUpdated: string;
}

export default function LeaderboardTable({ participants, games, lastUpdated }: LeaderboardTableProps) {
  const [previousRanks, setPreviousRanks] = useState<Record<string, number>>({});
  const [profiles, setProfiles] = useState<Record<string, DegenProfile>>({});

  useEffect(() => {
    const prev = storePreviousRanks(lastUpdated, participants);
    setPreviousRanks(prev);
  }, [lastUpdated, participants]);

  useEffect(() => {
    getAllProfiles().then(setProfiles);
  }, []);

  const enriched = useMemo(
    () =>
      participants.map((p) => ({
        ...p,
        displayName: profiles[p.slug]?.display_name ?? p.displayName,
        avatar: profiles[p.slug]?.avatar_url ?? null,
        streak: getStreakBadge(p, games),
        bestGame: getBestGameScore(p, games),
        movement: getRankMovement(p.rank, previousRanks[p.slug]),
      })),
    [participants, games, previousRanks, profiles]
  );

  function handleProfileSave(slug: string, name: string, avatarUrl: string | null) {
    setProfiles((prev) => ({
      ...prev,
      [slug]: {
        slug,
        display_name: name,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      },
    }));
  }

  return (
    <div className="overflow-hidden rounded-sm border border-border bg-card shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="espn-table-head text-xs uppercase">
              <th className="px-4 py-3 font-semibold">Rank</th>
              <th className="px-4 py-3 font-semibold">Move</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">Avg / Game</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">Best</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">Per Game</th>
              <th className="px-4 py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {enriched.map((p, i) => (
              <tr
                key={p.slug}
                className="animate-fade-in border-b border-border/60 transition-colors duration-300 hover:bg-black/5 dark:hover:bg-white/5"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <td className="px-4 py-4">{rankDisplay(p.rank)}</td>
                <td className={`px-4 py-4 text-sm font-bold ${p.movement.className}`}>
                  {p.movement.label}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-border bg-neutral-700">
                      {p.avatar ? (
                        <Image src={p.avatar} alt={p.displayName} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                          {p.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <Link
                        href={`/picks/${p.slug}`}
                        className="font-semibold text-primary transition-colors duration-300 hover:text-espn-red hover:underline"
                      >
                        {p.displayName}
                      </Link>
                      {p.streak === "fire" && (
                        <span className="text-xs text-espn-red">🔥 HOT STREAK</span>
                      )}
                      {p.streak === "cold" && (
                        <span className="text-xs text-secondary">🥶 COLD STREAK</span>
                      )}
                      <ProfileEditor
                        slug={p.slug}
                        currentName={p.displayName}
                        currentAvatar={p.avatar}
                        onSave={(name, avatar) => handleProfileSave(p.slug, name, avatar)}
                      />
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-4 text-secondary sm:table-cell">
                  {p.gamesScored > 0 ? p.avgPointsPerGame.toFixed(1) : "—"}
                </td>
                <td className="hidden px-4 py-4 font-semibold text-primary sm:table-cell">
                  {p.bestGame > 0 ? p.bestGame : "—"}
                </td>
                <td className="hidden px-4 py-4 sm:table-cell">
                  <GameSquares picks={p.picks} games={games} />
                </td>
                <td className="px-4 py-4 text-right font-display text-2xl font-bold text-espn-red">
                  {p.totalPoints}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}