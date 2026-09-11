import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          {/* Animated house illustration */}
          <div className="relative mx-auto w-48 h-48 mb-8">
            {/* Background circle */}
            <div className="absolute inset-0 bg-orange-50 rounded-full animate-pulse" />

            {/* House SVG */}
            <svg
              className="relative w-full h-full"
              viewBox="0 0 200 200"
              fill="none"
            >
              {/* Ground line */}
              <line
                x1="30"
                y1="155"
                x2="170"
                y2="155"
                stroke="#e2e8f0"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* House body */}
              <rect
                x="55"
                y="95"
                width="90"
                height="60"
                rx="4"
                fill="#f8fafc"
                stroke="#cbd5e1"
                strokeWidth="2"
              />

              {/* Roof */}
              <path
                d="M45 100L100 55L155 100"
                fill="#fff7ed"
                stroke="#f97316"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Door */}
              <rect
                x="88"
                y="120"
                width="24"
                height="35"
                rx="3"
                fill="#fed7aa"
                stroke="#f97316"
                strokeWidth="1.5"
              />

              {/* Door knob */}
              <circle cx="106" cy="140" r="2.5" fill="#f97316" />

              {/* Left window */}
              <rect
                x="63"
                y="105"
                width="18"
                height="18"
                rx="2"
                fill="#fff7ed"
                stroke="#fdba74"
                strokeWidth="1.5"
              />
              <line
                x1="72"
                y1="105"
                x2="72"
                y2="123"
                stroke="#fdba74"
                strokeWidth="1"
              />
              <line
                x1="63"
                y1="114"
                x2="81"
                y2="114"
                stroke="#fdba74"
                strokeWidth="1"
              />

              {/* Right window */}
              <rect
                x="119"
                y="105"
                width="18"
                height="18"
                rx="2"
                fill="#fff7ed"
                stroke="#fdba74"
                strokeWidth="1.5"
              />
              <line
                x1="128"
                y1="105"
                x2="128"
                y2="123"
                stroke="#fdba74"
                strokeWidth="1"
              />
              <line
                x1="119"
                y1="114"
                x2="137"
                y2="114"
                stroke="#fdba74"
                strokeWidth="1"
              />

              {/* Question mark floating above house */}
              <text
                x="100"
                y="42"
                textAnchor="middle"
                className="animate-bounce"
                fontSize="24"
                fontWeight="bold"
                fill="#f97316"
              >
                ?
              </text>

              {/* Small cloud left */}
              <ellipse cx="35" cy="50" rx="15" ry="8" fill="#f1f5f9" />
              <ellipse cx="28" cy="52" rx="10" ry="6" fill="#f1f5f9" />

              {/* Small cloud right */}
              <ellipse cx="165" cy="40" rx="12" ry="6" fill="#f1f5f9" />
              <ellipse cx="160" cy="42" rx="8" ry="5" fill="#f1f5f9" />
            </svg>
          </div>

          {/* Error code */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8 bg-slate-200" />
            <span className="text-sm font-medium text-orange-500 tracking-wider uppercase">
              Error 404
            </span>
            <span className="h-px w-8 bg-slate-200" />
          </div>

          {/* Heading */}
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            This page doesn&apos;t exist
          </h1>

          {/* Description */}
          <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-md mx-auto mb-8">
            Looks like you&apos;ve wandered off the map. The page you&apos;re
            looking for might have been moved or no longer exists.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
                />
              </svg>
              Back to Home
            </Link>
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Browse Listings
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          {/* Quick links */}
          <div className="border-t border-slate-100 pt-8">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-4">
              Popular pages
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { label: "Find Housing", href: "/listings" },
                { label: "Find Roommates", href: "/roommates" },
                { label: "Login", href: "/login" },
                { label: "Register", href: "/register" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-100 bg-white px-4 py-2 text-xs font-medium text-slate-500 hover:border-orange-200 hover:text-orange-600 hover:bg-orange-50/30 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
