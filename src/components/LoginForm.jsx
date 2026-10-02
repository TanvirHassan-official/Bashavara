"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signOut } from "@/lib/auth-client";

const STUDENT_PERKS = [
  "Browse landlord-verified listings with real distances",
  "Get matched with compatible roommates",
  "Read honest student reviews on landlords",
];

const LANDLORD_PERKS = [
  "Post listings directly to verified student renters",
  "Manage inquiries and accept applicants",
  "Build trust through transparent student reviews",
];

export default function LoginForm({ initialRole = "student" }) {
  const router = useRouter();

  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isLandlord = role === "landlord";

  function resetFields() {
    setEmail("");
    setPassword("");
    setErrors({});
  }

  function switchRole(r) {
    setRole(r);
    resetFields();
  }

  function validate() {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!isLandlord && !email.endsWith(".edu"))
      errs.email = "Only university .edu emails are allowed";
    else if (isLandlord && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email address";
    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Minimum 8 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    const { data, error } = await signIn.email({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setErrors({ form: error.message || "Invalid email or password" });
      return;
    }

    const actualRole = data?.user?.role || "student";
    if (actualRole !== role) {
      await signOut();
      setLoading(false);
      setErrors({
        form: `This account is registered as a ${actualRole}. Please switch to the ${actualRole} tab to log in.`,
      });
      return;
    }

    router.push(actualRole === "landlord" ? "/landlord" : "/listings");
    router.refresh();
  }

  const perks = isLandlord ? LANDLORD_PERKS : STUDENT_PERKS;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div
        className={`hidden lg:flex lg:w-5/12 flex-col justify-between p-12 transition-colors duration-300 ${
          isLandlord ? "bg-slate-900" : "bg-orange-500"
        }`}
      >
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 group w-fit"
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isLandlord ? "bg-orange-500" : "bg-white/20"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L2 8v8h5v-5h4v5h5V8L9 2z" fill="white" />
            </svg>
          </div>
          <span className="font-heading text-2xl font-bold text-white group-hover:opacity-80 transition-opacity">
            BashaVara
          </span>
        </button>

        <div>
          <p
            className={`text-xs font-semibold uppercase tracking-widest mb-4 ${
              isLandlord ? "text-orange-400" : "text-white/60"
            }`}
          >
            {isLandlord
              ? "For landlords & property managers"
              : "For university students"}
          </p>
          <h2 className="font-heading text-4xl font-bold text-white leading-tight mb-8">
            {isLandlord
              ? "Reach thousands of verified student renters."
              : "Your next home is one .edu away."}
          </h2>
          <ul className="space-y-4">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isLandlord ? "bg-orange-500/30" : "bg-white/20"
                  }`}
                >
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-white/85 text-sm leading-relaxed">
                  {perk}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonial */}
        <div
          className={`rounded-2xl p-5 ${
            isLandlord ? "bg-white/10 border border-white/10" : "bg-white/20"
          }`}
        >
          {isLandlord ? (
            <>
              <p className="text-white/80 text-sm italic leading-relaxed">
                "Listed my two units on BashaVara and had three qualified student
                inquiries within the first week. No broker, no hassle."
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-8 h-8 bg-orange-500/40 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  MO
                </div>
                <div>
                  <p className="text-white text-sm font-medium">
                    Margaret Okafor
                  </p>
                  <p className="text-white/50 text-xs">
                    Okafor Property Group · Cambridge, MA
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-white/80 text-sm italic leading-relaxed">
                "Found a great studio 0.3 miles from Stata in three days. The
                landlord reviews told me exactly what to expect."
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  KR
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Kavya Reddy</p>
                  <p className="text-white/50 text-xs">CS PhD · MIT</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 mb-8 lg:hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L2 8v8h5v-5h4v5h5V8L9 2z" fill="white" />
              </svg>
            </div>
            <span className="font-heading text-xl font-bold text-slate-900">
              BashaVara
            </span>
          </button>

          {/* Role toggle */}
          <div className="bg-slate-100 rounded-xl p-1 flex mb-7">
            <button
              type="button"
              onClick={() => switchRole("student")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                role === "student"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
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
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
              Student
            </button>
            <button
              type="button"
              onClick={() => switchRole("landlord")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                role === "landlord"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Landlord
            </button>
          </div>

          <h1 className="font-heading text-3xl font-bold text-slate-900 mb-1">
            Welcome back
          </h1>
          <p className="text-slate-500 text-sm mb-7">
            {isLandlord
              ? "Log in to manage your listings and requests"
              : "Log in to continue your housing search"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address <span className="text-red-400">*</span>
                {!isLandlord && (
                  <span className="text-orange-500 font-normal ml-1">
                    (.edu only)
                  </span>
                )}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  isLandlord ? "you@yourcompany.com" : "you@university.edu"
                }
                className={inp(!!errors.email)}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inp(!!errors.password)}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {errors.form && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600">{errors.form}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-sm shadow-orange-100 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href={isLandlord ? "/register?role=landlord" : "/register"}
              className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
            >
              Sign up free
            </Link>
          </p>

          <p className="text-center text-xs text-slate-400 mt-4">
            By continuing you agree to our{" "}
            <a href="#" className="underline hover:text-slate-600">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-slate-600">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function inp(hasError) {
  return `w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white transition-colors ${
    hasError ? "border-red-300 bg-red-50" : "border-slate-200"
  }`;
}
