"use client";

import { useEffect, useState } from "react";
import Flag from "./Flag";

interface TickerMatch {
  home: string;
  away: string;
  homeScore: number | null | undefined;
  awayScore: number | null | undefined;
  status: string;
  minute?: number;
  utcDate: string;
}

export default function LiveScoresTicker() {
  const [matches, setMatches] = useState<TickerMatch[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch("/api/live-scores");
        if (res.status === 204 || !res.ok) {
          setMatches([]);
          return;
        }
        const data = (await res.json()) as { matches: TickerMatch[] };
        setMatches(data.matches ?? []);
      } catch {
        setMatches([]);
      }
    };

    fetchScores();
    const interval = setInterval(fetchScores, 60000);
    return () => clearInterval(interval);
  }, []);

  if (matches.length === 0) return null;

  const items = [...matches, ...matches];

  return (
    <div className="overflow-hidden border-b border-border bg-card/90 backdrop-blur-sm transition-colors duration-300">
      <div className="flex animate-ticker whitespace-nowrap py-2">
        {items.map((m, i) => {
          const isLive = m.status === "IN_PLAY" || m.status === "PAUSED";
          const isFinished = m.status === "FINISHED";
          const isUpcoming = m.status === "TIMED" || m.status === "SCHEDULED";

          return (
            <div
              key={`${m.home}-${m.away}-${i}`}
              className="mx-6 inline-flex items-center gap-2 text-sm text-primary"
            >
              <Flag team={m.home} size={24} />
              <span className="font-medium">{m.home}</span>
              {isLive || isFinished ? (
                <span className="font-bold">
                  {m.homeScore ?? 0} - {m.awayScore ?? 0}
                </span>
              ) : (
                <span className="text-secondary">vs</span>
              )}
              <span className="font-medium">{m.away}</span>
              <Flag team={m.away} size={24} />
              {isLive && (
                <span className="animate-pulse rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  LIVE {m.minute ? `${m.minute}'` : ""}
                </span>
              )}
              {isUpcoming && (
                <span className="text-xs text-secondary">
                  {new Date(m.utcDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
              {isFinished && <span className="text-xs text-secondary">FT</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
