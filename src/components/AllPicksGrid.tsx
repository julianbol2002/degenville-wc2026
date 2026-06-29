"use client";

import { useState } from "react";
import type { AppData } from "@/lib/types";
import { getPickResult } from "@/lib/scoring";
import { getConsensusPick, isSoleCorrectPick } from "@/lib/stats-utils";
import Flag from "./Flag";

function cellClass(result: ReturnType<typeof getPickResult>): string {
  switch (result) {
    case "exact":
      return "text-yellow-900 dark:text-yellow-100";
    case "winner":
      return "text-green-900 dark:text-green-100";
    case "wrong":
      return "text-red-900 dark:text-red-100";
    case "pending":
    case "unpicked":
      return "text-secondary";
  }
}

function cellBg(result: ReturnType<typeof getPickResult>): string {
  switch (result) {
    case "exact":
      return "#854d0e33";
    case "winner":
      return "#16a34a22";
    case "wrong":
      return "#dc262622";
    case "pending":
    case "unpicked":
      return "transparent";
  }
}

function formatPick(predT1: number | null, predT2: number | null): string {
  if (predT1 === null || predT2 === null) return "—";
  return `${predT1}-${predT2}`;
}

interface AllPicksGridProps {
  data: AppData;
}

export default function AllPicksGrid({ data }: AllPicksGridProps) {
  const [mobileParticipant, setMobileParticipant] = useState(0);
  const { games, participants } = data;
  const active = participants[mobileParticipant];

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl lg:block">
        <div className="glass-card max-h-[80vh] overflow-auto">
          <table className="w-full min-w-max border-collapse text-sm">
            <thead>
              <tr className="bg-navy text-paper">
                <th className="sticky left-0 top-0 z-20 bg-navy px-3 py-3 text-left font-semibold">
                  Game
                </th>
                {participants.map((p) => (
                  <th
                    key={p.slug}
                    className="sticky top-0 z-10 min-w-[72px] bg-navy px-2 py-3 text-center text-xs font-semibold"
                  >
                    {p.displayName.split(" ").pop()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id} className="border-b border-border/50">
                  <td className="sticky left-0 z-10 bg-card px-3 py-2 font-medium text-primary">
                    <div>G{game.id}</div>
                    <div className="flex flex-wrap
