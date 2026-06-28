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
    <div className="border-b border-border bg-teal/10 transition-colors duration-300 dark:bg-teal/5">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3 text-sm font-medium text-secondary sm:px-6 lg:px-8">
        <span>
          Games Scored:{" "}
          <strong className="text-primary">
            {gamesScored}/{totalGames}
          </strong>
        </span>
        <span className="hidden h-4 w-px bg-border sm:block" />
        <span>
          Total Participants: <strong className="text-primary">{totalParticipants}</strong>
        </span>
        <span className="hidden h-4 w-px bg-border sm:block" />
        <span>
          Prize Pool: <strong className="text-teal">$340</strong>
        </span>
      </div>
    </div>
  );
}
