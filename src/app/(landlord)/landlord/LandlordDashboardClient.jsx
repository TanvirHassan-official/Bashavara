"use client";

import { useState } from "react";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import { api } from "@/lib/api";

const STATUS_BADGE = {
  active: "bg-green-50 text-green-600 border-green-200",
  rented: "bg-slate-100 text-slate-500 border-slate-200",
  paused: "bg-amber-50 text-amber-600 border-amber-200",
};

const REQ_BADGE = {
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  accepted: "bg-green-50 text-green-600 border-green-200",
  rejected: "bg-red-50 text-red-500 border-red-200",
  Pending: "bg-amber-50 text-amber-600 border-amber-200",
  Accepted: "bg-green-50 text-green-600 border-green-200",
  Rejected: "bg-red-50 text-red-500 border-red-200",
};

const REQ_ICONS = {
  pending: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  accepted: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  rejected: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

export default function LandlordDashboardClient({
  currentLandlord,
  initialListings = [],
  initialRequests = [],
}) {
  const [tab, setTab] = useState("listings");
  const [listings, setListings] = useState(initialListings);
  const [requests, setRequests] = useState(initialRequests);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const activeCount = listings.filter((l) => (l.status || l.listingStatus) === "active").length;
  const pendingRequests = requests.filter((r) => (r.status || "").toLowerCase() === "pending").length;
  const acceptedCount = requests.filter((r) => (r.status || "").toLowerCase() === "accepted").length;

  function showSuccess(msg) {
    setActionSuccess(msg);
    setTimeout(() => {
      setActionSuccess(null);
    }, 4000);
  }

  async function toggleListingStatus(id, newStatus) {
    setActionLoading(true);
    setActionLoadingId(id);
    setActionError(null);
    try {
      await api.patch(`/api/listings/${id}/status`, { status: newStatus });
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus, listingStatus: newStatus } : l))
      );
      const statusText =
        newStatus === "rented"
          ? "Listing marked as Rented."
          : newStatus === "active"
          ? "Listing activated."
          : "Listing paused.";
      showSuccess(statusText);
    } catch (err) {
      console.error("Failed to update listing status:", err);
      setActionError(err.message || "Failed to update listing status.");
    } finally {
      setActionLoading(false);
      setActionLoadingId(null);
    }
  }

  async function deleteListing(target) {
    const id = typeof target === "object" ? target?.id : target;
    if (!id) return;

    setActionLoading(true);
    setActionLoadingId(id);
    setActionError(null);
    try {
      await api.delete(`/api/listings/${id}`);
      setListings((prev) => prev.filter((l) => l.id !== id));
      setRequests((prev) => prev.filter((r) => r.listingId !== id));
      setDeleteConfirm(null);
      showSuccess("Listing deleted successfully.");
    } catch (err) {
      console.error("Failed to delete listing:", err);
      setActionError(err.message || "Failed to delete listing.");
    } finally {
      setActionLoading(false);
      setActionLoadingId(null);
    }
  }

  async function updateRequestStatus(id, newStatus) {
    setActionLoading(true);
    setActionLoadingId(id);
    setActionError(null);
    try {
      const res = await api.patch(`/api/requests/${id}`, { status: newStatus });
      const updatedData = res.request;

      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: newStatus,
                senderEmail: updatedData?.senderEmail || r.senderEmail,
              }
            : r
        )
      );
      showSuccess(`Request ${newStatus.toLowerCase()} successfully.`);
    } catch (err) {
      console.error("Failed to update request:", err);
      setActionError(err.message || "Failed to update request.");
    } finally {
      setActionLoading(false);
      setActionLoadingId(null);
    }
  }

  const requestsByListing = listings.map((l) => ({
    listing: l,
    reqs: requests.filter((r) => r.listingId === l.id),
  }));

  const initials = (currentLandlord?.name || "L")
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-heading font-bold text-lg shrink-0">
                {initials}
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold text-slate-900">
                  {currentLandlord.name}
                </h1>
                <p className="text-sm text-slate-400">
                  {currentLandlord.businessName} · {currentLandlord.email}
                </p>
              </div>
            </div>
            <Link
              href="/landlord/listings/new"
              className="inline-flex items-center gap-2 px-5 py-3 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-sm shadow-orange-100"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New listing
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Toast / Notification Banners */}
        {actionSuccess && (
          <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{actionSuccess}</span>
            </div>
            <button
              onClick={() => setActionSuccess(null)}
              className="text-emerald-600 hover:text-emerald-800 p-1 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {actionError && (
          <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-medium animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{actionError}</span>
            </div>
            <button
              onClick={() => setActionError(null)}
              className="text-red-600 hover:text-red-800 p-1 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total listings",
              value: listings.length,
              sub: `${activeCount} active`,
              icon: "🏠",
            },
            {
              label: "Pending inquiries",
              value: pendingRequests,
              sub: "awaiting response",
              icon: "📬",
              alert: pendingRequests > 0,
            },
            {
              label: "Accepted connections",
              value: acceptedCount,
              sub: "emails shared",
              icon: "🤝",
            },
            {
              label: "Avg. rating",
              value: "4.6★",
              sub: "from 14 reviews",
              icon: "⭐",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`bg-white rounded-2xl border p-5 ${
                s.alert ? "border-orange-200" : "border-slate-100"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-400">{s.label}</p>
                <span className="text-xl">{s.icon}</span>
              </div>
              <p
                className={`font-heading text-3xl font-bold ${
                  s.alert ? "text-orange-500" : "text-slate-900"
                }`}
              >
                {s.value}
              </p>
              <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setTab("listings")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                tab === "listings"
                  ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50/50"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              My Listings
              <span className="text-xs text-slate-400">
                ({listings.length})
              </span>
            </button>
            <button
              onClick={() => setTab("requests")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                tab === "requests"
                  ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50/50"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Student Requests
              {pendingRequests > 0 && (
                <span className="bg-orange-500 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                  {pendingRequests}
                </span>
              )}
            </button>
          </div>

          {tab === "listings" ? (
            <ListingsTab
              listings={listings}
              actionLoadingId={actionLoadingId}
              onToggleStatus={toggleListingStatus}
              onDelete={(target) => setDeleteConfirm(target)}
            />
          ) : (
            <RequestsTab
              requestsByListing={requestsByListing}
              onUpdateStatus={updateRequestStatus}
            />
          )}
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-scaleIn">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-center text-lg mb-2">
              Delete this listing?
            </h3>
            <p className="text-sm text-slate-600 text-center mb-1 font-medium">
              {typeof deleteConfirm === "object" ? `"${deleteConfirm.title}"` : "This property"}
            </p>
            <p className="text-xs text-slate-400 text-center mb-6">
              This action cannot be undone. All associated requests and reviews will also be removed.
            </p>
            <div className="flex gap-3">
              <button
                disabled={actionLoading}
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={() => deleteListing(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ListingsTab({ listings, actionLoadingId, onToggleStatus, onDelete }) {
  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <p className="font-heading font-semibold text-slate-700 mb-1">
          No listings yet
        </p>
        <p className="text-sm text-slate-400 mb-6">
          Create your first listing to start receiving student inquiries.
        </p>
        <Link
          href="/landlord/listings/new"
          className="px-5 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors inline-block"
        >
          Create first listing
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-50">
      {listings.map((listing) => (
        <ListingRow
          key={listing.id}
          listing={listing}
          isLoading={actionLoadingId === listing.id}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function ListingRow({ listing, isLoading, onToggleStatus, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = (listing.status || listing.listingStatus || "active").toLowerCase();
  const statusBadge = STATUS_BADGE[status] || STATUS_BADGE.active;
  const statusLabel = status ? status.charAt(0).toUpperCase() + status.slice(1) : "Active";

  const rawDist = String(listing.distance || "").trim();
  const displayDist = rawDist
    ? rawDist.toLowerCase().includes("mi") || rawDist.toLowerCase().includes("km")
      ? `${rawDist} to campus`
      : `${rawDist} mi to campus`
    : "Near campus";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 hover:bg-slate-50/50 transition-colors">
      {/* Photo */}
      <div className="w-full sm:w-24 h-40 sm:h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
        {listing.photoUrl ? (
          <img
            src={listing.photoUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap mb-1">
          <p className="font-semibold text-slate-800 text-sm truncate">
            {listing.title}
          </p>
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusBadge}`}
          >
            {statusLabel}
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-2">{listing.address}</p>
        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          <span className="font-semibold text-orange-500">
            ${Number(listing.rent || 0).toLocaleString()}/mo
          </span>
          <span>
            {listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms}BR`} ·{" "}
            {listing.bathrooms}BA
          </span>
          <span>{displayDist}</span>
          <span>Available {listing.availableFrom || "Immediately"}</span>
        </div>
      </div>

      {/* Rating */}
      <div className="hidden lg:block text-center">
        <StarRating rating={Number(listing.avgRating || 0) || 4.5} size="sm" />
        <p className="text-xs text-slate-400 mt-1">
          {listing.avgRating ? Number(listing.avgRating).toFixed(1) : "New"}{" "}
          ({listing.reviewCount || 0} reviews)
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {status === "active" ? (
          <button
            disabled={isLoading}
            onClick={() => onToggleStatus(listing.id, "paused")}
            className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Pause"}
          </button>
        ) : status === "paused" ? (
          <button
            disabled={isLoading}
            onClick={() => onToggleStatus(listing.id, "active")}
            className="px-3 py-1.5 text-xs font-medium border border-green-200 rounded-lg text-green-600 bg-green-50 hover:bg-green-100 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Activate"}
          </button>
        ) : (
          <button
            disabled={isLoading}
            onClick={() => onToggleStatus(listing.id, "active")}
            className="px-3 py-1.5 text-xs font-medium border border-orange-200 rounded-lg text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Re-list"}
          </button>
        )}

        {/* 3-dots Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl border border-slate-100 shadow-xl py-1.5 z-20">
                <Link
                  href={`/landlord/listings/${listing.id}/edit`}
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit listing
                </Link>

                {/* Mark as Rented or Mark as Available */}
                {status !== "rented" ? (
                  <button
                    onClick={() => {
                      onToggleStatus(listing.id, "rented");
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Mark as rented
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onToggleStatus(listing.id, "active");
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mark as available (Active)
                  </button>
                )}

                {/* Status Toggle helper in menu */}
                {status === "active" && (
                  <button
                    onClick={() => {
                      onToggleStatus(listing.id, "paused");
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                    </svg>
                    Pause listing
                  </button>
                )}

                {status === "paused" && (
                  <button
                    onClick={() => {
                      onToggleStatus(listing.id, "active");
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                    Activate listing
                  </button>
                )}

                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      onDelete(listing);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete listing
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function RequestsTab({ requestsByListing, onUpdateStatus }) {
  const allRequests = requestsByListing.flatMap((g) => g.reqs);

  if (allRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-slate-400">
          No student requests yet. They will appear here once students inquire
          about your listings.
        </p>
      </div>
    );
  }

  return (
    <div>
      {requestsByListing
        .filter((g) => g.reqs.length > 0)
        .map(({ listing, reqs }) => (
          <div key={listing.id}>
            {/* Listing group header */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                {listing.photoUrl && (
                  <img
                    src={listing.photoUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700 truncate">
                  {listing.title}
                </p>
                <p className="text-xs text-slate-400">
                  {reqs.length} request{reqs.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-50">
              {reqs.map((req) => (
                <RequestRow
                  key={req.id}
                  req={req}
                  onUpdateStatus={onUpdateStatus}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

function RequestRow({ req, onUpdateStatus }) {
  const initials = (req.senderName || "S")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("");

  const statusKey = (req.status || "Pending").toLowerCase();
  const badgeClass =
    REQ_BADGE[req.status] ||
    REQ_BADGE[statusKey] ||
    "bg-amber-50 text-amber-600 border-amber-200";
  const icon = REQ_ICONS[req.status] || REQ_ICONS[statusKey] || REQ_ICONS.pending;
  const statusLabel =
    statusKey.charAt(0).toUpperCase() + statusKey.slice(1);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-semibold font-heading shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-slate-800">
              {req.senderName || "Student"}
            </p>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${badgeClass}`}
            >
              {icon}
              {statusLabel}
            </span>
          </div>
          {statusKey === "accepted" ? (
            <div className="flex items-center gap-1.5 mt-0.5">
              <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-green-700 font-medium">
                {req.senderEmail || "Email shared"}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 mt-0.5">
              Requested{" "}
              {req.createdAt
                ? new Date(req.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "recently"}
            </p>
          )}
        </div>
      </div>

      {statusKey === "pending" && (
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onUpdateStatus(req.id, "rejected")}
            className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-xl hover:bg-slate-50 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={() => onUpdateStatus(req.id, "accepted")}
            className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors"
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );
}
