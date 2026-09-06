"use client";

import { useState } from "react";
import Link from "next/link";

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-600 border-amber-200",
  Accepted: "bg-green-50 text-green-600 border-green-200",
  Rejected: "bg-red-50 text-red-500 border-red-200",
};

const STATUS_ICONS = {
  Pending: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Accepted: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Rejected: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

export default function DashboardClient({ requests: initialRequests }) {
  const [tab, setTab] = useState("incoming");
  const [requests, setRequests] = useState(initialRequests);

  const incoming = requests.filter((r) => r.receiverId === "u0");
  const outgoing = requests.filter((r) => r.senderId === "u0");
  const pendingCount = incoming.filter((r) => r.status === "Pending").length;

  function updateStatus(id, status) {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  }

  const stats = [
    {
      label: "Incoming",
      value: incoming.length,
      sub: `${pendingCount} pending`,
    },
    {
      label: "Outgoing",
      value: outgoing.length,
      sub: `${outgoing.filter((r) => r.status === "Pending").length} pending`,
    },
    {
      label: "Accepted",
      value: requests.filter((r) => r.status === "Accepted").length,
      sub: "connections made",
    },
    { label: "Listings viewed", value: 12, sub: "this month" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-heading text-3xl font-bold text-slate-900 mb-1">
            Dashboard
          </h1>
          <p className="text-slate-500">
            Manage your housing requests and connections
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-slate-100 p-5"
            >
              <p className="text-xs text-slate-400 mb-1">{s.label}</p>
              <p className="font-heading text-3xl font-bold text-slate-900">
                {s.value}
              </p>
              <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Requests panel */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setTab("incoming")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                tab === "incoming"
                  ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50/50"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Incoming Requests
              {pendingCount > 0 && (
                <span className="bg-orange-500 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab("outgoing")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                tab === "outgoing"
                  ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50/50"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Outgoing Requests
              <span className="text-slate-400 text-xs">
                ({outgoing.length})
              </span>
            </button>
          </div>

          {/* Request list */}
          {tab === "incoming" ? (
            <RequestList
              requests={incoming}
              type="incoming"
              onStatusChange={updateStatus}
            />
          ) : (
            <RequestList
              requests={outgoing}
              type="outgoing"
              onStatusChange={updateStatus}
            />
          )}
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/listings"
            className="group bg-white rounded-2xl border border-slate-100 p-5 text-left hover:border-orange-200 hover:shadow-md transition-all block"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <div>
                <p className="font-heading font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                  Browse Listings
                </p>
                <p className="text-sm text-slate-400">
                  10 new listings this week
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/roommates"
            className="group bg-white rounded-2xl border border-slate-100 p-5 text-left hover:border-orange-200 hover:shadow-md transition-all block"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-heading font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Find Roommates
                </p>
                <p className="text-sm text-slate-400">
                  7 new compatible students
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Request list                                                       */
/* ------------------------------------------------------------------ */

function RequestList({ requests, type, onStatusChange }) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
          <svg
            className="w-6 h-6 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <p className="text-sm text-slate-500">No {type} requests yet</p>
        {type === "outgoing" && (
          <Link
            href="/listings"
            className="mt-4 text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            Browse listings to send your first request →
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-50">
      {requests.map((req) => (
        <div
          key={req.id}
          className="p-5 sm:p-6 hover:bg-slate-50/50 transition-colors"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Avatar + name */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center text-white text-sm font-semibold font-heading shrink-0">
                {(type === "incoming" ? req.senderName : req.receiverName)
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-800 text-sm">
                    {type === "incoming" ? req.senderName : req.receiverName}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${STATUS_STYLES[req.status]}`}
                  >
                    {STATUS_ICONS[req.status]}
                    {req.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      req.type === "listing"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-purple-50 text-purple-600"
                    }`}
                  >
                    {req.type === "listing" ? "🏠 Listing" : "👥 Roommate"}
                  </span>
                  {req.listingTitle && (
                    <span className="text-xs text-slate-400 truncate max-w-48">
                      {req.listingTitle}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:shrink-0">
              <span className="text-xs text-slate-400">
                {new Date(req.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>

              {/* Accepted: show email */}
              {req.status === "Accepted" && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                  <svg
                    className="w-4 h-4 text-green-500 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-green-700 font-medium">
                    {type === "incoming"
                      ? req.senderEmail
                      : `${req.receiverName
                          .toLowerCase()
                          .replace(" ", ".")}@edu.example`}
                  </span>
                </div>
              )}

              {/* Incoming + pending: accept/reject */}
              {type === "incoming" && req.status === "Pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onStatusChange(req.id, "Rejected")}
                    className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => onStatusChange(req.id, "Accepted")}
                    className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    Accept
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
