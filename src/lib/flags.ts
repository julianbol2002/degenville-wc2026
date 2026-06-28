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

export function getFlagCode(team: string): string | null {
  return FLAG_CODES[team] ?? null;
}

export function getFlagUrl(team: string, width = 40): string | null {
  const code = getFlagCode(team);
  if (!code) return null;
  return `https://flagcdn.com/w${width}/${code}.png`;
}
