import type { AppData } from "./types";

let lastGoodData: AppData | null = null;

export function getCachedData(): AppData | null {
  return lastGoodData;
}

export function setCachedData(data: AppData): void {
  lastGoodData = { ...data, stale: undefined };
}
