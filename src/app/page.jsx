import Link from "next/link";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";

export const metadata = {
  title: "BashaVara — Student Housing Made Easy",
  description:
    "Find affordable rentals, connect with landlords, and discover compatible roommates near your university.",
};

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Verified Students Only",
    desc: "Every account requires a valid .edu email address. No scammers, no outsiders — just a trusted community of university students.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Smart Roommate Matching",
    desc: "Our matching algorithm pairs you with compatible students based on budget, sleep schedule, department, and lifestyle preferences.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: "Honest Landlord Reviews",
    desc: "Read and write transparent reviews on landlords and properties. Students hold each other — and landlords — accountable.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Campus Distance Metrics",
    desc: "Every listing shows the exact walking distance to campus so you can find the right balance of proximity and price.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Simple Connection Requests",
    desc: "Send a contact request to any listing or roommate profile. Once accepted, both parties exchange emails — no middleman needed.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
    ),
    title: "Powerful Filters",
    desc: "Filter listings by maximum rent, walking distance to campus, and department relevance to find exactly what you need.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Create your profile",
    desc: "Sign up with your .edu email and tell us your budget, department, and lifestyle preferences.",
  },
  {
    step: "02",
    title: "Browse landlord listings",
    desc: "Landlords post verified properties with real rent, walking distance, and available dates — no student re-listings.",
  },
  {
    step: "03",
    title: "Connect & move in",
    desc: "Send a request, get accepted, exchange contact info directly with the landlord, and secure your home.",
  },
];

export default async function HomePage() {
  let stats = {
    activeListings: 14,
    verifiedStudents: 8,
    verifiedLandlords: 1,
    averageRating: 4.8,
    successfulMatches: 4,
  };
  let recentListings = [];

  try {
    const statsRes = await api.get("/api/stats");
    if (statsRes.stats) stats = statsRes.stats;
  } catch (err) {
    console.error("Failed to load stats on homepage:", err.message);
  }

  try {
    const listingsRes = await api.get("/api/listings?status=active");
    if (listingsRes.listings) {
      recentListings = listingsRes.listings.slice(0, 3);
    }
  } catch (err) {
    console.error("Failed to load recent listings on homepage:", err.message);
  }

  const statItems = [
    { value: `${stats.activeListings || 10}+`, label: "Active listings" },
    { value: "0.9 mi", label: "Median walk" },
    { value: `${stats.averageRating || 4.8}★`, label: "Avg. rating" },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[88vh] py-16 lg:py-0">
              {/* Left — copy */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 mb-5">
                  For verified .edu students
                </span>

                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] text-slate-900 mt-5">
                  Off-campus housing you can actually trust.
                </h1>

                <p className="mt-5 max-w-xl text-lg text-slate-500 leading-relaxed">
                  Landlords post verified listings directly on BashaVara — real
                  rents, real walking distances, real reviews — so you can find
                  your next home and a compatible roommate all in one place.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/listings"
                    className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Browse listings
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/roommates"
                    className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Find a roommate
                  </Link>
                </div>

                <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
                  {statItems.map((stat) => (
                    <div key={stat.label}>
                      <dt className="font-heading text-2xl font-bold text-slate-900">
                        {stat.value}
                      </dt>
                      <dd className="text-sm text-slate-500 mt-0.5">
                        {stat.label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Right — hero photo */}
              <div className="relative">
                <div className="rounded-3xl overflow-hidden bg-slate-100 shadow-2xl shadow-slate-200/60">
                  <img
                    src="./hero-housing.jpg"
                    alt="Bright student apartment"
                    className="w-full h-full object-cover aspect-[4/3]"
                  />
                </div>
                {/* Floating verified badge */}
                <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl border border-slate-100 px-5 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Student-verified</p>
                    <p className="font-heading font-bold text-slate-900 text-sm">
                      {stats.verifiedStudents || 8}+ Verified Students
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">
                Everything you need, nothing you don&apos;t
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                BashaVara is purpose-built for students. We stripped out
                complexity and focused on what actually matters when you are
                finding a place to live.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="group p-6 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-5 group-hover:bg-orange-100 transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-slate-900 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent listings preview */}
        {recentListings.length > 0 && (
          <section className="py-16 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="font-heading text-3xl font-bold text-slate-900 mb-2">
                    Recently added
                  </h2>
                  <p className="text-slate-500">
                    Fresh listings from landlords across the network
                  </p>
                </div>
                <Link
                  href="/listings"
                  className="hidden sm:flex items-center gap-2 text-orange-500 font-medium hover:text-orange-600 transition-colors text-sm"
                >
                  View all listings
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {recentListings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-200 text-left block"
                  >
                    <div className="relative h-44 bg-slate-100 overflow-hidden">
                      {listing.photoUrl ? (
                        <img
                          src={listing.photoUrl}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-50 to-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <svg
                            className="w-10 h-10 text-slate-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                          </svg>
                        </div>
                      )}
                      {listing.distance && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-white text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                            {listing.distance} to campus
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="font-heading font-semibold text-slate-900 text-base mb-1 group-hover:text-orange-600 transition-colors">
                        {listing.title}
                      </p>
                      <p className="text-slate-400 text-xs mb-3">
                        {listing.address}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-heading text-2xl font-bold text-orange-500">
                            ${Number(listing.rent).toLocaleString()}
                          </span>
                          <span className="text-slate-400 text-sm">/mo</span>
                        </div>
                        <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
                          {listing.bedrooms === 0
                            ? "Studio"
                            : `${listing.bedrooms}BR`}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How it works */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">
                How it works
              </h2>
              <p className="text-lg text-slate-500">
                Three steps to your next home
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200" />
              {STEPS.map((step) => (
                <div key={step.step} className="relative text-center px-6">
                  <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-100">
                    <span className="font-heading text-white font-bold text-lg">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Student CTA */}
        <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-heading text-4xl font-bold text-white mb-4">
              Ready to find your place?
            </h2>
            <p className="text-orange-100 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of students who found their home through BashaVara.
              All you need is your .edu email.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-white text-orange-500 rounded-xl font-semibold hover:bg-orange-50 transition-colors shadow-lg"
              >
                Get started — it&apos;s free
              </Link>
              <Link
                href="/listings"
                className="px-8 py-4 border-2 border-white/40 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Browse listings
              </Link>
            </div>
          </div>
        </section>

        {/* Landlord CTA */}
        <section className="py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  For landlords &amp; property managers
                </span>
                <h2 className="font-heading text-4xl font-bold text-white leading-tight mb-5">
                  List your property. Reach verified student renters.
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  BashaVara gives landlords direct access to a pre-screened
                  community of university students. Post listings, manage
                  inquiries, and connect — all in one place.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Create landlord account
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h14m-7-7 7 7-7 7"
                      />
                    </svg>
                  </Link>
                  <Link
                    href="/login"
                    className="px-6 py-3.5 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
                  >
                    Landlord log in
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: "🎯",
                    title: "Qualified leads only",
                    desc: "Every inquiry comes from a verified .edu student — no scammers, no wasted time.",
                  },
                  {
                    icon: "📋",
                    title: "Manage requests",
                    desc: "Accept or decline applicants from your dashboard. Share contact info when ready.",
                  },
                  {
                    icon: "⭐",
                    title: "Build trust",
                    desc: "Student reviews build your reputation as a reliable, responsive landlord.",
                  },
                  {
                    icon: "🆓",
                    title: "Free to list",
                    desc: "No broker fees, no listing charges. BashaVara is free for landlords at MVP.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="font-heading font-semibold text-white text-sm mt-3 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
