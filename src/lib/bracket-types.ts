export interface BracketGame {
  id: number;
  team1: string;
  team2: string;
  actual_t1: number | null;
  actual_t2: number | null;
  date?: string;
  status?: string;
}

export interface BracketProgression {
  r16: BracketGame[];
  qf: BracketGame[];
  sf: BracketGame[];
  final: BracketGame[];
  champion: string;
}

export function getWinner(game: BracketGame): string | null {
  if (game.actual_t1 === null || game.actual_t2 === null) return null;
  if (game.actual_t1 > game.actual_t2) return game.team1 || null;
  if (game.actual_t2 > game.actual_t1) return game.team2 || null;
  return null;
}

export function isComplete(game: BracketGame): boolean {
  return (
    !!game.team1 &&
    !!game.team2 &&
    game.actual_t1 !== null &&
    game.actual_t2 !== null
  );
}

export function isPending(game: BracketGame): boolean {
  return !game.team1 || !game.team2 || game.actual_t1 === null || game.actual_t2 === null;
}
