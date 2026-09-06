"use client";

import { useState, useMemo } from "react";

const AVATAR_COLORS = [
  "from-orange-400 to-orange-600",
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
  "from-teal-400 to-teal-600",
  "from-rose-400 to-rose-600",
  "from-emerald-400 to-emerald-600",
  "from-indigo-400 to-indigo-600",
];

function getCompatibilityScore(currentUser, candidate) {
  let score = 0;
  if (candidate.smokingPreference === currentUser.smokingPreference) score += 40;
  if (candidate.sleepSchedule === currentUser.sleepSchedule) score += 30;
  const budgetDiff = Math.abs(candidate.budget - currentUser.budget);
  if (budgetDiff < 200) score += 20;
  else if (budgetDiff < 500) score += 10;
  if (candidate.department === currentUser.department) score += 10;
  return score;
}

export default function RoommatesClient({ currentUser, users }) {
  const [budget, setBudget] = useState(currentUser.budget);
  const [sleep, setSleep] = useState(currentUser.sleepSchedule);
  const [smoking, setSmoking] = useState(currentUser.smokingPreference);
  const [department, setDepartment] = useState(currentUser.department);
  const [requestSent, setRequestSent] = useState({});
  const [activeTab, setActiveTab] = useState("matches");

  const me = {
    ...currentUser,
    budget,
    sleepSchedule: sleep,
    smokingPreference: smoking,
    department,
  };

  const matches = useMemo(
    () =>
      users
        .map((u) => ({ user: u, score: getCompatibilityScore(me, u) }))
        .sort((a, b) => b.score - a.score),
    [users, budget, sleep, smoking, department]
  );

  function handleRequest(userId) {
    // TODO: check auth — redirect to /login if not logged in
    setRequestSent((prev) => ({ ...prev, [userId]: true }));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-heading text-3xl font-bold text-slate-900 mb-1">
            Roommate Matching
          </h1>
          <p className="text-slate-500">
            Set your preferences to find compatible students
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile tabs */}
        <div className="flex lg:hidden gap-1 bg-slate-100 rounded-xl p-1 mb-6">
          {["matches", "profile"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors capitalize ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              {tab === "matches"
                ? `Matches (${matches.length})`
                : "My Profile"}
            </button>
          ))}
        </div>

        <div className="flex gap-8">
          {/* Profile sidebar */}
          <aside
            className={`${
              activeTab === "profile" ? "block" : "hidden"
            } lg:block w-full lg:w-80 shrink-0`}
          >
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6 lg:sticky lg:top-20">
              <div className="text-center pb-5 border-b border-slate-50">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl font-heading font-bold mx-auto mb-3">
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="font-heading font-semibold text-slate-900">
                  {currentUser.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {currentUser.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Bio
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {currentUser.bio}
                </p>
              </div>

              <div className="space-y-5">
                {/* Budget */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Monthly Budget
                    </label>
                    <span className="text-sm font-semibold text-orange-500">
                      ${budget.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={3000}
                    step={50}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-orange-500"
                  />
                </div>

                {/* Sleep schedule */}
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Sleep Schedule
                  </label>
                  <div className="flex gap-2">
                    {["Early Bird", "Night Owl", "Flexible"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSleep(s)}
                        className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${
                          sleep === s
                            ? "border-orange-500 bg-orange-50 text-orange-600 font-medium"
                            : "border-slate-200 text-slate-500 hover:border-orange-200"
                        }`}
                      >
                        {s === "Early Bird"
                          ? "🌅"
                          : s === "Night Owl"
                          ? "🦉"
                          : "🔄"}{" "}
                        {s.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Smoking preference */}
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Smoking Preference
                  </label>
                  <div className="flex gap-2">
                    {["Non-Smoker", "Smoker"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSmoking(s)}
                        className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${
                          smoking === s
                            ? "border-orange-500 bg-orange-50 text-orange-600 font-medium"
                            : "border-slate-200 text-slate-500 hover:border-orange-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
                <strong className="text-orange-600">Matching tip:</strong>{" "}
                Smoking preference and sleep schedule are weighted highest in
                compatibility scoring. Make sure they reflect your actual
                lifestyle.
              </div>
            </div>
          </aside>

          {/* Matches list */}
          <div
            className={`${
              activeTab === "matches" ? "block" : "hidden"
            } lg:block flex-1 min-w-0`}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-semibold text-slate-900">
                {matches.length} Compatible Students
              </h2>
              <div className="hidden lg:flex gap-2 text-xs text-slate-400">
                <span className="bg-green-50 text-green-600 px-2.5 py-1 rounded-full">
                  High match ≥70
                </span>
                <span className="bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-full">
                  Mid match 40–69
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {matches.map(({ user, score }) => (
                <RoommateCard
                  key={user.id}
                  user={user}
                  score={score}
                  requestSent={!!requestSent[user.id]}
                  onRequest={() => handleRequest(user.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Roommate card                                                      */
/* ------------------------------------------------------------------ */

function RoommateCard({ user, score, requestSent, onRequest }) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("");
  const scoreColor =
    score >= 70
      ? "bg-green-50 text-green-700 border-green-200"
      : score >= 40
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-slate-100 text-slate-500 border-slate-200";
  const scoreLabel =
    score >= 70 ? "Great match" : score >= 40 ? "Good match" : "Low match";

  const colorIdx =
    user.id.charCodeAt(user.id.length - 1) % AVATAR_COLORS.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col hover:border-orange-200 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 bg-gradient-to-br ${AVATAR_COLORS[colorIdx]} rounded-full flex items-center justify-center text-white font-heading font-bold text-base shrink-0`}
          >
            {initials}
          </div>
          <div>
            <h3 className="font-heading font-semibold text-slate-900 text-sm leading-tight">
              {user.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 leading-tight">
              {user.department}
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${scoreColor}`}
        >
          {score}%
        </span>
      </div>

      {/* Bio */}
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
        {user.bio}
      </p>

      {/* Tags */}
      <div className="flex flex-col gap-1.5 mb-5">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="w-5 text-center">💰</span>
          <span className="font-medium">
            ${user.budget.toLocaleString()}
            <span className="text-slate-400 font-normal">/mo budget</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="w-5 text-center">
            {user.sleepSchedule === "Early Bird"
              ? "🌅"
              : user.sleepSchedule === "Night Owl"
              ? "🦉"
              : "🔄"}
          </span>
          <span>{user.sleepSchedule}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="w-5 text-center">
            {user.smokingPreference === "Non-Smoker" ? "🚭" : "🚬"}
          </span>
          <span>{user.smokingPreference}</span>
        </div>
      </div>

      {/* Match label */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              score >= 70
                ? "bg-green-400"
                : score >= 40
                ? "bg-amber-400"
                : "bg-slate-300"
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="text-xs text-slate-400 shrink-0">{scoreLabel}</span>
      </div>

      {/* Action */}
      <div className="mt-auto">
        {requestSent ? (
          <div className="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            Request sent
          </div>
        ) : (
          <button
            onClick={onRequest}
            className="w-full py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
