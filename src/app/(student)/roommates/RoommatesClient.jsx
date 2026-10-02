"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { api } from "@/lib/api";

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
  const budgetDiff = Math.abs((candidate.budget || 1000) - (currentUser.budget || 1000));
  if (budgetDiff < 200) score += 20;
  else if (budgetDiff < 500) score += 10;
  if (candidate.department === currentUser.department) score += 10;
  return score;
}

export default function RoommatesClient({ currentUser, users }) {
  const [budget, setBudget] = useState(currentUser.budget || 1200);
  const [sleep, setSleep] = useState(currentUser.sleepSchedule || "Flexible");
  const [smoking, setSmoking] = useState(currentUser.smokingPreference || "Non-Smoker");
  const [department, setDepartment] = useState(currentUser.department || "Computer Science");
  const [bio, setBio] = useState(currentUser.bio || "");

  const [requestSent, setRequestSent] = useState({});
  const [requestLoading, setRequestLoading] = useState({});
  const [requestError, setRequestError] = useState({});
  const [activeTab, setActiveTab] = useState("matches");

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const router = useRouter();
  const { session } = useSession();

  const me = {
    ...currentUser,
    budget,
    sleepSchedule: sleep,
    smokingPreference: smoking,
    department,
    bio,
  };

  const matches = useMemo(
    () =>
      users
        .map((u) => ({ user: u, score: getCompatibilityScore(me, u) }))
        .sort((a, b) => b.score - a.score),
    [users, budget, sleep, smoking, department]
  );

  async function handleSaveProfile() {
    setSaveLoading(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      await api.put("/api/me/profile", {
        budget,
        department,
        sleepSchedule: sleep,
        smokingPreference: smoking,
        bio,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err.message || "Failed to save preferences.");
    } finally {
      setSaveLoading(false);
    }
  }

  async function handleRequest(userId) {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    setRequestLoading((prev) => ({ ...prev, [userId]: true }));
    setRequestError((prev) => ({ ...prev, [userId]: null }));
    try {
      await api.post("/api/requests", {
        receiverId: userId,
        type: "roommate",
        message: "Hi! I came across your profile on BashaVara and would love to connect about finding a place together.",
      });
      setRequestSent((prev) => ({ ...prev, [userId]: true }));
    } catch (err) {
      setRequestError((prev) => ({ ...prev, [userId]: err.message || "Failed to send request" }));
    } finally {
      setRequestLoading((prev) => ({ ...prev, [userId]: false }));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-heading text-3xl font-bold text-slate-900 mb-1">
            Roommate Matching
          </h1>
          <p className="text-slate-500">
            Set your preferences to find compatible students near campus
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
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6 lg:sticky lg:top-20 shadow-sm">
              <div className="text-center pb-5 border-b border-slate-50">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl font-heading font-bold mx-auto mb-3">
                  {(currentUser.name || "S")
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
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Bio / Notes
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short bio or study habits..."
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>

              <div className="space-y-4">
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
                    min={400}
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
                        type="button"
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
                        type="button"
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
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {saveError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg p-2.5">
                  {saveError}
                </div>
              )}

              {saveSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg p-2.5 font-medium text-center">
                  Preferences updated successfully! ✓
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saveLoading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {saveLoading ? "Saving..." : "Save Preferences"}
              </button>
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
                <span className="bg-green-50 text-green-600 px-2.5 py-1 rounded-full font-medium">
                  High match ≥70
                </span>
                <span className="bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-full font-medium">
                  Mid match 40–69
                </span>
              </div>
            </div>

            {matches.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
                <p className="text-sm">No other student profiles found at this time.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {matches.map(({ user, score }) => (
                  <RoommateCard
                    key={user.id}
                    user={user}
                    score={score}
                    requestSent={!!requestSent[user.id]}
                    requestLoading={!!requestLoading[user.id]}
                    requestError={requestError[user.id]}
                    onRequest={() => handleRequest(user.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RoommateCard({ user, score, requestSent, requestLoading, requestError, onRequest }) {
  const isHigh = score >= 70;
  const isMid = score >= 40 && score < 70;

  const scoreBadge = isHigh
    ? "bg-green-50 text-green-700 border-green-200"
    : isMid
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col justify-between hover:border-orange-200 hover:shadow-md transition-all">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-semibold font-heading shrink-0">
              {(user.name || "U")
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
              <p className="text-xs text-slate-400">{user.department}</p>
            </div>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${scoreBadge} shrink-0`}
          >
            {score}% match
          </span>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
            "{user.bio}"
          </p>
        )}

        {/* Preferences tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-xs bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg">
            ${(user.budget || 1000).toLocaleString()}/mo
          </span>
          <span className="text-xs bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg">
            {user.sleepSchedule}
          </span>
          <span className="text-xs bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg">
            {user.smokingPreference}
          </span>
        </div>
      </div>

      <div>
        {requestError && (
          <p className="text-xs text-red-500 mb-2">{requestError}</p>
        )}
        {requestSent ? (
          <button
            disabled
            className="w-full py-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-xl"
          >
            Request Sent ✓
          </button>
        ) : (
          <button
            onClick={onRequest}
            disabled={requestLoading}
            className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-70"
          >
            {requestLoading ? "Connecting..." : "Connect"}
          </button>
        )}
      </div>
    </div>
  );
}
