interface StatsBarProps {
  gamesScored: number;
  totalGames: number;
  totalParticipants: number;
}

export default function StatsBar({
  gamesScored,
  totalGames,
  totalParticipants,
}: StatsBarProps) {
  return (
    <div className="border-b border-border bg-black text-white transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3 text-sm font-medium sm:px-6 lg:px-8">
        <span>
          Games Scored:{" "}
          <strong className="text-espn-red">
            {gamesScored}/{totalGames}
          </strong>
        </span>
        <span className="hidden h-4 w-px bg-white/20 sm:block" />
        <span>
          Total Participants: <strong>{totalParticipants}</strong>
        </span>
        <span className="hidden h-4 w-px bg-white/20 sm:block" />
        <span>
          Prize Pool: <strong className="text-espn-red">$340</strong>
        </span>
      </div>
    </div>
  );
}
