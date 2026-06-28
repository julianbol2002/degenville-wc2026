import { NextResponse } from "next/server";

export const revalidate = 60;

interface FootballMatch {
  homeTeam: { name: string; shortName?: string };
  awayTeam: { name: string; shortName?: string };
  score: { fullTime?: { home: number | null; away: number | null } };
  status: string;
  minute?: number;
  utcDate: string;
}

export async function GET() {
  const key = process.env.FOOTBALL_DATA_API_KEY;
  if (!key) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    const res = await fetch("https://api.football-data.org/v4/competitions/WC/matches", {
      headers: { "X-Auth-Token": key },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return new NextResponse(null, { status: 204 });
    }

    const data = (await res.json()) as { matches?: FootballMatch[] };
    const matches = (data.matches ?? []).slice(0, 20).map((m) => ({
      home: m.homeTeam.shortName || m.homeTeam.name,
      away: m.awayTeam.shortName || m.awayTeam.name,
      homeScore: m.score.fullTime?.home,
      awayScore: m.score.fullTime?.away,
      status: m.status,
      minute: m.minute,
      utcDate: m.utcDate,
    }));

    return NextResponse.json({ matches });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
