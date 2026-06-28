import * as XLSX from "xlsx";
import type { Game, GamePick } from "./types";
import { computePoints } from "./scoring";
import { RESULTS_TAB } from "./participants";

const SYSTEM_SHEETS = new Set(["Leaderboard", "Results (Enter Here)", "Rules"]);

const FETCH_OPTIONS: RequestInit = { next: { revalidate: 60 } };

export function getWorkbookUrl(): string {
  const base = process.env.SHEET_BASE_URL;
  if (!base) throw new Error("SHEET_BASE_URL is not configured");
  return base.replace("output=csv", "output=xlsx").replace(/&sheet=[^&]*/g, "");
}

export async function fetchWorkbook(): Promise<XLSX.WorkBook> {
  const url = getWorkbookUrl();
  const res = await fetch(url, { ...FETCH_OPTIONS, redirect: "follow" });
  if (!res.ok) throw new Error(`Failed to fetch spreadsheet: ${res.status}`);
  const buffer = await res.arrayBuffer();
  return XLSX.read(buffer, { type: "array" });
}

export function getParticipantTabNames(workbook: XLSX.WorkBook): string[] {
  return workbook.SheetNames.filter((name) => !SYSTEM_SHEETS.has(name));
}

function getSheetRows(workbook: XLSX.WorkBook, sheetName: string): unknown[][] {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) throw new Error(`Sheet not found: ${sheetName}`);
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: true }) as unknown[][];
}

function cellValue(row: unknown[] | undefined, index: number): string {
  if (!row || index >= row.length) return "";
  const value = row[index];
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

export function parseNumberCell(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return isNaN(value) ? null : value;
  const parsed = parseFloat(String(value).trim());
  return isNaN(parsed) ? null : parsed;
}

export function parseResultsSheet(workbook: XLSX.WorkBook): Game[] {
  const rows = getSheetRows(workbook, RESULTS_TAB);
  const games: Game[] = [];

  for (let i = 5; i <= 20; i++) {
    const row = rows[i] as unknown[] | undefined;
    if (!row) continue;

    const id = parseNumberCell(row[0]);
    if (id === null) continue;

    const statusRaw = cellValue(row, 7).toLowerCase();
    const status = statusRaw === "done" ? "Done" : "Pending";

    games.push({
      id,
      date: cellValue(row, 1),
      team1: cellValue(row, 2),
      team2: cellValue(row, 4),
      actualT1: parseNumberCell(row[5]),
      actualT2: parseNumberCell(row[6]),
      status,
    });
  }

  return games.sort((a, b) => a.id - b.id);
}

export interface ParsedParticipantSheet {
  championPick: string | null;
  finalist1: string | null;
  finalist2: string | null;
  picks: GamePick[];
}

export function parseParticipantSheet(
  workbook: XLSX.WorkBook,
  tabName: string,
  games: Game[]
): ParsedParticipantSheet {
  const rows = getSheetRows(workbook, tabName);
  const bonusRow = rows[1] as unknown[] | undefined;

  const championPick = cellValue(bonusRow, 4) || null;
  const finalist1 = cellValue(bonusRow, 7) || null;
  const finalist2 = cellValue(bonusRow, 8) || null;

  const picks: GamePick[] = [];

  for (let i = 5; i <= 20; i++) {
    const row = rows[i] as unknown[] | undefined;
    if (!row) continue;

    const gameId = parseNumberCell(row[0]);
    if (gameId === null) continue;

    const predT1 = parseNumberCell(row[4]);
    const predT2 = parseNumberCell(row[5]);

    const game = games.find((g) => g.id === gameId);
    const actualT1 = game?.actualT1 ?? parseNumberCell(row[6]);
    const actualT2 = game?.actualT2 ?? parseNumberCell(row[7]);

    picks.push({
      gameId,
      predT1,
      predT2,
      points: computePoints(predT1, predT2, actualT1, actualT2),
    });
  }

  return {
    championPick,
    finalist1,
    finalist2,
    picks: picks.sort((a, b) => a.gameId - b.gameId),
  };
}
