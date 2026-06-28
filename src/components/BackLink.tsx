import Link from "next/link";

export default function BackLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-paper shadow-md transition-all duration-300 hover:bg-teal dark:bg-card dark:text-primary dark:hover:border-teal dark:hover:text-teal"
    >
      ← Back to Leaderboard
    </Link>
  );
}
