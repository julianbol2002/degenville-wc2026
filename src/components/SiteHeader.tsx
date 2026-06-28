"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import LiveScoresTicker from "./LiveScoresTicker";

const links = [
  { href: "/", label: "Leaderboard" },
  { href: "/bracket", label: "Bracket" },
  { href: "/picks", label: "All Picks" },
  { href: "/stats", label: "Stats" },
];

interface SiteHeaderProps {
  activePath: string;
  stale?: boolean;
  rightSlot?: React.ReactNode;
  hero?: boolean;
}

export default function SiteHeader({
  activePath,
  stale,
  rightSlot,
  hero = false,
}: SiteHeaderProps) {
  const headerClass = hero
    ? "espn-header hero-gradient hero-pattern text-white"
    : "espn-header text-white";

  return (
    <div className="sticky top-0 z-50">
      <header className={headerClass}>
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-display text-xs font-semibold tracking-[0.35em] text-espn-red">
                DEGENVILLE FC
              </p>
              <h1 className="font-display text-4xl font-bold leading-none tracking-wide sm:text-5xl">
                WORLD CUP 2026
              </h1>
              <p className="mt-1 text-sm uppercase tracking-widest text-white/70">
                Bracket Challenge
              </p>
            </div>
            <div className="flex items-center gap-3 sm:items-center">
              {rightSlot}
              {stale && (
                <span className="rounded bg-white/10 px-3 py-1 text-xs font-medium text-white">
                  Data may be outdated
                </span>
              )}
              <ThemeToggle />
            </div>
          </div>

          <nav className="mt-4 flex flex-wrap gap-5 border-t border-white/10 pt-3">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? activePath === "/"
                  : activePath.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-display pb-1 text-sm font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-espn-red ${
                    isActive
                      ? "border-b-2 border-espn-red text-espn-red"
                      : "text-white/75"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <LiveScoresTicker />
    </div>
  );
}
