export const FLAG_CODES: Record<string, string> = {
  "South Africa": "za",
  Canada: "ca",
  Brazil: "br",
  Japan: "jp",
  Germany: "de",
  Paraguay: "py",
  Netherlands: "nl",
  Morocco: "ma",
  "Ivory Coast": "ci",
  Norway: "no",
  France: "fr",
  Sweden: "se",
  Mexico: "mx",
  Ecuador: "ec",
  USA: "us",
  "Bosnia & Herz.": "ba",
  Australia: "au",
  Egypt: "eg",
  Spain: "es",
  Austria: "at",
  Portugal: "pt",
  Croatia: "hr",
  Algeria: "dz",
  Switzerland: "ch",
  Senegal: "sn",
  Belgium: "be",
  England: "gb-eng",
  "DR Congo": "cd",
  Argentina: "ar",
  "Cape Verde": "cv",
  Colombia: "co",
  Ghana: "gh",
};

export const TEAM_ABBR: Record<string, string> = {
  "South Africa": "RSA",
  Canada: "CAN",
  Brazil: "BRA",
  Japan: "JPN",
  Germany: "GER",
  Paraguay: "PAR",
  Netherlands: "NED",
  Morocco: "MAR",
  "Ivory Coast": "CIV",
  Norway: "NOR",
  France: "FRA",
  Sweden: "SWE",
  Mexico: "MEX",
  Ecuador: "ECU",
  USA: "USA",
  "Bosnia & Herz.": "BIH",
  Australia: "AUS",
  Egypt: "EGY",
  Spain: "ESP",
  Austria: "AUT",
  Portugal: "POR",
  Croatia: "CRO",
  Algeria: "ALG",
  Switzerland: "SUI",
  Senegal: "SEN",
  Belgium: "BEL",
  England: "ENG",
  "DR Congo": "COD",
  Argentina: "ARG",
  "Cape Verde": "CPV",
  Colombia: "COL",
  Ghana: "GHA",
};

export function getTeamAbbr(team: string): string {
  return TEAM_ABBR[team] ?? team.slice(0, 3).toUpperCase();
}

export function getFlagCode(team: string): string | null {
  return FLAG_CODES[team] ?? null;
}

export function getFlagUrl(team: string, width = 40): string | null {
  const code = getFlagCode(team);
  if (!code) return null;
  return `https://flagcdn.com/w${width}/${code}.png`;
}
