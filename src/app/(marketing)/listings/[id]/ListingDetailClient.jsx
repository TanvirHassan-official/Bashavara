"use client";

import { useState } from "react";
import Link from "next/link";
import StarRating from "@/components/StarRating";

export default function ListingDetailClient({ listing, reviews, avgRating }) {
  const [requestSent, setRequestSent] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  function handleRequest() {
    // TODO: check auth — redirect to /login if not logged in
    setRequestSent(true);
  }

  function handleReviewSubmit(e) {
    e.preventDefault();
    setReviewSubmitted(true);
    setShowReviewForm(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back nav */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/listings"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to listings
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo */}
            <div className="rounded-2xl overflow-hidden h-72 sm:h-96 bg-slate-100">
              {listing.photoUrl ? (
                <img
                  src={listing.photoUrl}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-50 to-slate-100 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-slate-300"
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
            </div>

            {/* Title & quick stats */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-slate-900 mb-1">
                    {listing.title}
                  </h1>
                  <p className="text-slate-500 text-sm flex items-center gap-1">
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {listing.address}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-heading text-3xl font-bold text-orange-500">
                    ${listing.rent.toLocaleString()}
                    <span className="text-lg text-slate-400 font-normal">
                      /mo
                    </span>
                  </div>
                  {listing.utilityCharge > 0 && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      +${listing.utilityCharge}/mo utilities
                    </p>
                  )}
                  {listing.utilityCharge === 0 && (
                    <p className="text-xs text-green-500 mt-0.5 font-medium">
                      All bills included
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    label: "Type",
                    value:
                      listing.bedrooms === 0
                        ? "Studio"
                        : `${listing.bedrooms} Bedroom`,
                  },
                  { label: "Bathrooms", value: `${listing.bathrooms} Bath` },
                  {
                    label: "Distance",
                    value: `${listing.distance} mi to campus`,
                  },
                  { label: "Available", value: listing.availableFrom },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {avgRating > 0 && (
                <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                  <StarRating rating={avgRating} size="md" />
                  <span className="font-semibold text-slate-700">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-slate-400 text-sm">
                    ({reviews.length} review
                    {reviews.length !== 1 ? "s" : ""})
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-heading font-semibold text-slate-900 text-lg mb-4">
                About this place
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {listing.description}
              </p>

              <div className="mt-6">
                <h3 className="font-heading font-semibold text-slate-900 text-sm mb-3">
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map((a) => (
                    <span
                      key={a}
                      className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full"
                    >
                      <svg
                        className="w-3.5 h-3.5 text-orange-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50">
                <p className="text-sm text-slate-500">
                  <span className="font-medium text-slate-700">
                    Best for:{" "}
                  </span>
                  {listing.departmentRelevance}
                </p>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-semibold text-slate-900 text-lg">
                  Reviews {reviews.length > 0 && `(${reviews.length})`}
                </h2>
                {!reviewSubmitted && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
                  >
                    {showReviewForm ? "Cancel" : "Write a review"}
                  </button>
                )}
              </div>

              {reviewSubmitted && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 text-sm font-medium">
                  Your review has been submitted. Thank you!
                </div>
              )}

              {showReviewForm && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="bg-orange-50 rounded-xl p-5 mb-6 space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Your rating
                    </label>
                    <StarRating
                      rating={reviewRating}
                      size="lg"
                      interactive
                      onChange={setReviewRating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Your review
                    </label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with this property or landlord..."
                      className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={reviewRating === 0}
                    className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit review
                  </button>
                </form>
              )}

              {reviews.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <p className="text-sm">
                    No reviews yet. Be the first to share your experience.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-slate-50 pb-5 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm font-semibold font-heading">
                            {review.reviewerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {review.reviewerName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {new Date(review.createdAt).toLocaleDateString(
                                "en-US",
                                { month: "short", year: "numeric" }
                              )}
                            </p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed pl-12">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Contact card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-20">
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-50">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold font-heading text-sm">
                  {listing.posterName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {listing.posterName}
                  </p>
                  <p className="text-xs text-slate-400">Listing posted by</p>
                </div>
              </div>

              {requestSent ? (
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="w-6 h-6 text-green-500"
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
                  </div>
                  <p className="font-heading font-semibold text-slate-800">
                    Request sent!
                  </p>
                  <p className="text-xs text-slate-500">
                    {listing.posterName} will review your request. You will be
                    notified once they respond.
                  </p>
                  <Link
                    href="/dashboard"
                    className="block w-full py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm text-center hover:bg-slate-50 transition-colors"
                  >
                    View in Dashboard
                  </Link>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleRequest}
                    className="w-full py-3.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-100 mb-3"
                  >
                    Request Contact
                  </button>
                  <p className="text-xs text-slate-400 text-center">
                    Contact info is shared once your request is accepted
                  </p>
                </>
              )}

              <div className="mt-5 pt-5 border-t border-slate-50 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Available from</p>
                    <p className="font-medium text-slate-700">
                      {listing.availableFrom}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-orange-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">
                      Distance to campus
                    </p>
                    <p className="font-medium text-slate-700">
                      {listing.distance} miles
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety note */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-1">
                    Stay safe
                  </p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Never send money before viewing a property in person.
                    BashaVara never asks for payment on this platform.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
