"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { signOut } from "@/lib/auth-client";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const { session, loading } = useSession();

  const isLoggedIn = !!session;
  const isLandlord = session?.role === "landlord";

  const profileName = session?.name ?? "User";
  const profileEmail = session?.email ?? "";
  const initials = profileName
    .split(" ")
    .map((n) => n[0])
    .join("");

  const studentLinks = [
    { label: "Find Housing", href: "/listings" },
    { label: "Find Roommates", href: "/roommates" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  const landlordLinks = [
    { label: "New Listing", href: "/landlord/listings/new" },
    { label: "Dashboard", href: "/landlord" },
  ];

  const navLinks = isLandlord ? landlordLinks : studentLinks;

  const handleLogout = async () => {
    await signOut();
    setProfileOpen(false);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L2 8v8h5v-5h4v5h5V8L9 2z" fill="white" />
              </svg>
            </div>
            <span className="font-heading text-xl font-bold text-slate-900 group-hover:text-orange-500 transition-colors">
              BashaVara
            </span>
            {isLandlord && (
              <span className="hidden sm:inline-flex items-center text-xs font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                Landlord
              </span>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === link.href
                  ? "bg-orange-50 text-orange-600"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {isLandlord && (
              <Link
                href="/landlord/listings/new"
                className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New listing
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
            ) : isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${isLandlord ? "bg-slate-800" : "bg-orange-500"
                      }`}
                  >
                    {initials}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-700">
                    {profileName.split(" ")[0]}
                  </span>
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-100 shadow-lg py-1 z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {profileName}
                        </p>
                        {isLandlord && (
                          <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
                            Landlord
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{profileEmail}</p>
                      {isLandlord && session?.businessName && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {session.businessName}
                        </p>
                      )}
                    </div>

                    {isLandlord ? (
                      <>
                        <Link
                          href="/landlord"
                          onClick={() => setProfileOpen(false)}
                          className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          My Dashboard
                        </Link>
                        <Link
                          href="/landlord/listings/new"
                          onClick={() => setProfileOpen(false)}
                          className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          + New Listing
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          My Dashboard
                        </Link>
                        <Link
                          href="/roommates"
                          onClick={() => setProfileOpen(false)}
                          className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          My Profile
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-100 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-50 text-slate-600"
            >
              {menuOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === link.href
                  ? "bg-orange-50 text-orange-600"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {isLandlord && (
              <Link
                href="/landlord/listings/new"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-orange-600 bg-orange-50"
              >
                + New Listing
              </Link>
            )}
            {!isLoggedIn && (
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-left px-4 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                >
                  Student log in
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-left px-4 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                >
                  Landlord log in
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
