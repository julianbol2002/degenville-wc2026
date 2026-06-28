"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AutoRefreshProps {
  lastUpdated: string;
}

export default function AutoRefresh({ lastUpdated }: AutoRefreshProps) {
  const router = useRouter();
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const updateSeconds = () => {
      const diff = Math.floor((Date.now() - new Date(lastUpdated).getTime()) / 1000);
      setSecondsAgo(Math.max(0, diff));
    };

    updateSeconds();
    const tick = setInterval(updateSeconds, 1000);
    const refresh = setInterval(() => router.refresh(), 60000);

    return () => {
      clearInterval(tick);
      clearInterval(refresh);
    };
  }, [lastUpdated, router]);

  return (
    <span className="text-sm text-slate-400">
      Last updated {secondsAgo}s ago
    </span>
  );
}
