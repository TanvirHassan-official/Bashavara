"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth-client";

/**
 * Client-side hook that fetches and caches the current session.
 * @returns {{ session: object|null, loading: boolean, refresh: () => void }}
 */
export function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getSession();
      setSession(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { session, loading, refresh };
}
