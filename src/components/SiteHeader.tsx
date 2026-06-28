import Link from "next/link";

const links = [
  { href: "/", label: "Leaderboard" },
  { href: "/bracket", label: "Bracket" },
  { href: "/picks", label: "All Picks" },
];

interface SiteHeaderProps {
  activePath: string;
  stale?: boolean;
  rightSlot?: React.ReactNode;
}

export default function SiteHeader({
  activePath,
  stale,
  rightSlot,
}: SiteHeaderProps) {
  return (
    <header className="bg-navy text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              DEGENVILLE 🌍
            </h1>
            <p className="mt-1 text-lg font-semibold text-teal sm:text-xl">
              WORLD CUP 2026
            </p>
          </div>
          <div className="flex flex-col items-start gap-1 sm:items-end">
            {rightSlot}
            {stale && (
              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-300">
                Data may be outdated
              </span>
            )}
          </div>
        </div>

        <nav className="mt-6 flex flex-wrap gap-6 border-t border-white/10 pt-4">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? activePath === "/"
                : activePath.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`pb-1 text-sm font-semibold uppercase tracking-wide transition-colors hover:text-teal ${
                  isActive
                    ? "border-b-2 border-teal text-teal"
                    : "text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
