/** Approximate FIFA ranking order (lower index = stronger). Used for upset detection only. */
export const FIFA_RANK_ORDER: string[] = [
  "Argentina",
  "France",
  "Brazil",
  "England",
  "Belgium",
  "Portugal",
  "Netherlands",
  "Spain",
  "Croatia",
  "USA",
  "Germany",
  "Mexico",
  "Morocco",
  "Colombia",
  "Japan",
  "Switzerland",
  "Senegal",
  "Australia",
  "Austria",
  "Ecuador",
  "Sweden",
  "Norway",
  "Egypt",
  "Algeria",
  "Ivory Coast",
  "Ghana",
  "Canada",
  "South Africa",
  "Paraguay",
  "Cape Verde",
  "DR Congo",
  "Bosnia & Herz.",
];

export function getFifaRank(team: string): number {
  const idx = FIFA_RANK_ORDER.indexOf(team);
  return idx === -1 ? FIFA_RANK_ORDER.length : idx;
}

export function isUnderdog(team: string, opponent: string): boolean {
  return getFifaRank(team) > getFifaRank(opponent);
}
