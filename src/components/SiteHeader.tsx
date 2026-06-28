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
    ? "hero-gradient hero-pattern text-white shadow-xl"
    : "border-b border-border bg-card text-primary shadow-lg transition-colors duration-300";

  return (
    <div className="sticky top-0 z-50">
      <header className={headerClass}>
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">DEGENVILLE 🌍</h1>
              <p className={`mt-1 text-lg font-semibold sm:text-xl ${hero ? "text-teal-light" : "text-teal"}`}>
                WORLD CUP 2026
              </p>
            </div>
            <div className="flex items-center gap-3 sm:items-center">
              {rightSlot}
              {stale && (
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-300">
                  Data may be outdated
                </span>
              )}
              <ThemeToggle />
            </div>
          </div>

          <nav className="mt-5 flex flex-wrap gap-6 border-t border-white/10 pt-4">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? activePath === "/"
                  : activePath.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`pb-1 text-sm font-semibold uppercase tracking-wide transition-colors duration-300 hover:text-teal ${
                    isActive
                      ? "border-b-2 border-teal text-teal"
                      : hero
                        ? "text-white/70"
                        : "text-secondary"
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
