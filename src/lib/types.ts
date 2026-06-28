export type GameStatus = "Done" | "Pending";

export interface Game {
  id: number;
  date: string;
  team1: string;
  team2: string;
  actualT1: number | null;
  actualT2: number | null;
  status: GameStatus;
}

export interface GamePick {
  gameId: number;
  predT1: number | null;
  predT2: number | null;
  points: number;
}

export interface Participant {
  tabName: string;
  displayName: string;
  slug: string;
  rank: number;
  totalPoints: number;
  championPick: string | null;
  finalist1: string | null;
  finalist2: string | null;
  picks: GamePick[];
  avgPointsPerGame: number;
  gamesScored: number;
}

export interface AppData {
  lastUpdated: string;
  games: Game[];
  participants: Participant[];
  stale?: boolean;
}

export type PickResult = "pending" | "exact" | "winner" | "wrong" | "unpicked";
