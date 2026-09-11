"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top accent bar with shimmer */}
      <div className="h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
            animation: "loading-shimmer 1.5s ease-in-out infinite",
          }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          {/* Animated house loader */}
          <div className="relative mx-auto w-20 h-20 mb-8">
            {/* Outer pulse ring */}
            <div
              className="absolute inset-0 rounded-2xl bg-orange-100"
              style={{ animation: "loading-pulse-ring 2s ease-in-out infinite" }}
            />

            {/* Inner container */}
            <div className="relative w-full h-full rounded-2xl bg-orange-50 flex items-center justify-center">
              {/* House icon */}
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                className="text-orange-500"
                style={{
                  animation: "loading-house-bounce 1.8s ease-in-out infinite",
                }}
              >
                <path
                  d="M12 3L2 12h3v8h6v-5h2v5h6v-8h3L12 3z"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M12 3L2 12h3v8h6v-5h2v5h6v-8h3L12 3z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/* Loading text */}
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <span className="font-heading text-lg font-semibold text-slate-900">
              Loading
            </span>
            {/* Animated dots */}
            <span className="flex gap-0.5 items-end h-5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-orange-500"
                  style={{
                    animation: `loading-dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </span>
          </div>

          <p className="text-sm text-slate-400">
            Finding the best housing for you
          </p>
        </div>
      </div>

      {/* Inline keyframe styles — using <style> in a client component is fine */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes loading-shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            @keyframes loading-pulse-ring {
              0%, 100% { transform: scale(1); opacity: 0.5; }
              50% { transform: scale(1.15); opacity: 0; }
            }
            @keyframes loading-house-bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }
            @keyframes loading-dot-bounce {
              0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
              30% { transform: translateY(-6px); opacity: 1; }
            }
          `,
        }}
      />
    </div>
  );
}
