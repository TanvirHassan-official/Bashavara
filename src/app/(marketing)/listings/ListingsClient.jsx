"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import StarRating from "@/components/StarRating";

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "rent-asc", label: "Rent: Low to High" },
  { value: "rent-desc", label: "Rent: High to Low" },
  { value: "distance", label: "Nearest First" },
  { value: "rating", label: "Highest Rated" },
];

export default function ListingsClient({
  listings,
  departments,
  amenityOptions,
  ratings,
}) {
  const [maxRent, setMaxRent] = useState(3000);
  const [maxDistance, setMaxDistance] = useState(3);
  const [department, setDepartment] = useState("Any");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sort, setSort] = useState("recent");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = listings.filter(
      (l) =>
        l.rent <= maxRent &&
        l.distance <= maxDistance &&
        (department === "Any" || l.departmentRelevance === department) &&
        selectedAmenities.every((a) => l.amenities.includes(a))
    );

    const getAvg = (id) => ratings[id] ?? 0;

    switch (sort) {
      case "rent-asc":
        result = [...result].sort((a, b) => a.rent - b.rent);
        break;
      case "rent-desc":
        result = [...result].sort((a, b) => b.rent - a.rent);
        break;
      case "distance":
        result = [...result].sort((a, b) => a.distance - b.distance);
        break;
      case "rating":
        result = [...result].sort(
          (a, b) => getAvg(b.id) - getAvg(a.id)
        );
        break;
      default:
        result = [...result].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return result;
  }, [listings, maxRent, maxDistance, department, selectedAmenities, sort, ratings]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-slate-900">
                Housing Listings
              </h1>
              <p className="text-slate-500 mt-1">
                {filtered.length} properties available
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white hover:bg-slate-50"
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
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <FilterPanel
              maxRent={maxRent}
              setMaxRent={setMaxRent}
              maxDistance={maxDistance}
              setMaxDistance={setMaxDistance}
              department={department}
              setDepartment={setDepartment}
              selectedAmenities={selectedAmenities}
              setSelectedAmenities={setSelectedAmenities}
              departments={departments}
              amenityOptions={amenityOptions}
              onReset={() => {
                setMaxRent(3000);
                setMaxDistance(3);
                setDepartment("Any");
                setSelectedAmenities([]);
              }}
            />
          </aside>

          {/* Mobile sidebar drawer */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="absolute left-0 inset-y-0 w-80 bg-white shadow-xl overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <h3 className="font-heading font-semibold text-slate-900">
                    Filters
                  </h3>
                  <button onClick={() => setSidebarOpen(false)}>
                    <svg
                      className="w-5 h-5 text-slate-400"
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
                  </button>
                </div>
                <div className="p-5">
                  <FilterPanel
                    maxRent={maxRent}
                    setMaxRent={setMaxRent}
                    maxDistance={maxDistance}
                    setMaxDistance={setMaxDistance}
                    department={department}
                    setDepartment={setDepartment}
                    selectedAmenities={selectedAmenities}
                    setSelectedAmenities={setSelectedAmenities}
                    departments={departments}
                    amenityOptions={amenityOptions}
                    onReset={() => {
                      setMaxRent(3000);
                      setMaxDistance(3);
                      setDepartment("Any");
                      setSelectedAmenities([]);
                    }}
                  />
                </div>
                <div className="p-5 border-t border-slate-100">
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="w-full py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
                  >
                    Show {filtered.length} results
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Listings grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="font-heading font-semibold text-slate-900 text-lg mb-2">
                  No listings match your filters
                </h3>
                <p className="text-slate-500 text-sm">
                  Try adjusting your rent or distance range.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    avgRating={ratings[listing.id] ?? 0}
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

/* ------------------------------------------------------------------ */
/*  Filter panel                                                       */
/* ------------------------------------------------------------------ */

function FilterPanel({
  maxRent,
  setMaxRent,
  maxDistance,
  setMaxDistance,
  department,
  setDepartment,
  selectedAmenities,
  setSelectedAmenities,
  departments,
  amenityOptions,
  onReset,
}) {
  function toggleAmenity(amenity) {
    setSelectedAmenities(
      selectedAmenities.includes(amenity)
        ? selectedAmenities.filter((a) => a !== amenity)
        : [...selectedAmenities, amenity]
    );
  }

  const activeCount =
    (maxRent < 3000 ? 1 : 0) +
    (maxDistance < 3 ? 1 : 0) +
    (department !== "Any" ? 1 : 0) +
    selectedAmenities.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-semibold text-slate-900">
            Filters
          </h3>
          {activeCount > 0 && (
            <span className="text-xs font-semibold bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        <button
          onClick={onReset}
          className="text-xs text-orange-500 hover:text-orange-600 font-medium"
        >
          Reset all
        </button>
      </div>

      {/* Max Rent */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">Max Rent</label>
          <span className="text-sm font-semibold text-orange-500">
            ${maxRent.toLocaleString()}/mo
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={3000}
          step={50}
          value={maxRent}
          onChange={(e) => setMaxRent(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-orange-500"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>$500</span>
          <span>$3,000</span>
        </div>
      </div>

      {/* Max Distance */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">
            Max Distance
          </label>
          <span className="text-sm font-semibold text-orange-500">
            {maxDistance} mi
          </span>
        </div>
        <input
          type="range"
          min={0.1}
          max={3}
          step={0.1}
          value={maxDistance}
          onChange={(e) => setMaxDistance(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-orange-500"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>0.1 mi</span>
          <span>3 mi</span>
        </div>
      </div>

      {/* Department */}
      <div>
        <label className="text-sm font-medium text-slate-700 block mb-3">
          Department
        </label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Type */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-3">Type</p>
        <div className="flex flex-wrap gap-2">
          {["Any", "Studio", "1BR", "2BR+"].map((type) => (
            <button
              key={type}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600 transition-colors"
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-slate-700">Amenities</p>
          {selectedAmenities.length > 0 && (
            <button
              onClick={() => setSelectedAmenities([])}
              className="text-xs text-orange-500 hover:text-orange-600 font-medium"
            >
              Clear ({selectedAmenities.length})
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {amenityOptions.map((amenity) => {
            const active = selectedAmenities.includes(amenity);
            return (
              <button
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-150 ${
                  active
                    ? "bg-orange-500 border-orange-500 text-white font-medium shadow-sm"
                    : "border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600 bg-white"
                }`}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Listing card                                                       */
/* ------------------------------------------------------------------ */

function ListingCard({ listing, avgRating }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-200 text-left block"
    >
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        {listing.photoUrl ? (
          <img
            src={listing.photoUrl}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-50 to-slate-100 flex items-center justify-center">
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
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
            {listing.distance} mi
          </span>
          {listing.utilityCharge === 0 && (
            <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              Bills incl.
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            ${listing.rent.toLocaleString()}/mo
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-heading font-semibold text-slate-900 text-sm leading-snug mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
          {listing.title}
        </h3>
        <p className="text-slate-400 text-xs mb-3 truncate">
          {listing.address}
        </p>

        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-slate-500">
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms}BR`} ·{" "}
            {listing.bathrooms}BA
          </span>
          {listing.utilityCharge > 0 && (
            <span className="text-xs text-slate-400">
              +${listing.utilityCharge} util.
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
          {avgRating > 0 ? (
            <div className="flex items-center gap-1.5">
              <StarRating rating={avgRating} size="sm" />
              <span className="text-xs text-slate-400">
                {avgRating.toFixed(1)}
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-400">No reviews yet</span>
          )}
          <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
            {listing.departmentRelevance.split("/")[0].trim()}
          </span>
        </div>
      </div>
    </Link>
  );
}
