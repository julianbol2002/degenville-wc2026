import Link from "next/link";

export default function BackLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-navy/90"
    >
      ← Back to Leaderboard
    </Link>
  );
}
