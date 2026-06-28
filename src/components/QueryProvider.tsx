"use client";

import { createContext, useCallback, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

interface QueryContextValue {
  refresh: () => void;
}

const QueryContext = createContext<QueryContextValue>({ refresh: () => {} });

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    const interval = setInterval(refresh, 60000);
    return () => clearInterval(interval);
  }, [refresh]);

  return <QueryContext.Provider value={{ refresh }}>{children}</QueryContext.Provider>;
}

export function useQueryRefresh() {
  return useContext(QueryContext);
}
