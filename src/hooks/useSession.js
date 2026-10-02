"use client";

import { useSession as useBetterAuthSession } from "@/lib/auth-client";

/**
 * Client-side hook that wraps Better Auth's useSession.
 * @returns {{ session: object|null, loading: boolean, refresh: () => void }}
 */
export function useSession() {
  const { data, isPending, error } = useBetterAuthSession();

  // Normalize to the shape the rest of the app expects
  return {
    session: data?.user ?? null,
    loading: isPending,
    refresh: () => {}, // Better Auth's useSession is reactive and auto-refreshes
  };
}
