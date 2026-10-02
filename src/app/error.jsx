"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global Error Boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="font-heading text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
        <p className="text-slate-500 text-sm mb-6">
          {error?.message || "An unexpected error occurred while loading this page. Please try again."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-orange-100"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
