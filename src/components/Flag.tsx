"use client";

import { useState } from "react";
import Image from "next/image";
import { getFlagUrl } from "@/lib/flags";

interface FlagProps {
  team: string;
  size?: 24 | 32 | 48;
  className?: string;
}

const SIZE_MAP = { 24: 24, 32: 32, 48: 48 };

export default function Flag({ team, size = 24, className = "" }: FlagProps) {
  const [failed, setFailed] = useState(false);
  const url = getFlagUrl(team, size <= 24 ? 20 : size <= 32 ? 40 : 80);
  const px = SIZE_MAP[size];

  if (!url || failed || !team || team === "TBD") {
    return (
      <span
        className={`inline-flex items-center justify-center rounded border border-border bg-card text-xs ${className}`}
        style={{ width: px, height: px }}
        title={team || "TBD"}
      >
        ⚽
      </span>
    );
  }

  return (
    <Image
      src={url}
      alt={`${team} flag`}
      width={px}
      height={px}
      className={`rounded border border-border object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
