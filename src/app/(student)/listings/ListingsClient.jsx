"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import { api } from "@/lib/api";

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "rent-asc", label: "Rent: Low to High" },
  { value: "rent-desc", label: "Rent: High to Low" },
  { value: "distance", label: "Nearest First" },
  { value: "rating", label: "Highest Rated" },
];

const BEDROOM_OPTIONS = [
  { value: "all", label: "All Beds" },
  { value: "0", label: "Studio" },
  { value: "1", label: "1 Bed" },
  { value: "2", label: "2 Beds" },
  { value: "3+", label: "3+ Beds" },
];

function parseDistance(val) {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const match = String(val).match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

function formatDistance(val) {
  if (!val && val !== 0) return "Near campus";
  const str = String(val).trim();
  if (str.toLowerCase().includes("mi") || str.toLowerCase().includes("km")) {
    return str;
  }
  return `${str} mi`;
}

export default function ListingsClient({
  listings: initialListings = [],
  departments = [],
  amenityOptions = [],
  ratings = {},
}) {
  const [listings, setListings] = useState(initialListings);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [maxRent, setMaxRent] = useState(5000);
  const [maxDistance, setMaxDistance] = useState(5);
  const [bedroomFilter, setBedroomFilter] = useState("all");
  const [department, setDepartment] = useState("Any");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sort, setSort] = useState("recent");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync initialListings if updated from server or fetch on client if empty
  useEffect(() => {
    if (initialListings && initialListings.length > 0) {
      setListings(initialListings);
    } else {
      refetchListings();
    }
  }, [initialListings]);

  async function refetchListings() {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await api.get("/api/listings?status=active");
      if (data && Array.isArray(data.listings)) {
        setListings(data.listings);
      }
    } catch (err) {
      console.error("Failed to load listings:", err);
      setFetchError(err.message || "Failed to load listings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleResetFilters() {
    setSearchTerm("");
    setMaxRent(5000);
    setMaxDistance(5);
    setBedroomFilter("all");
    setDepartment("Any");
    setSelectedAmenities([]);
    setSort("recent");
  }

  const filtered = useMemo(() => {
    let result = (listings || []).filter((l) => {
      if (!l) return false;
      const rent = Number(l.rent) || 0;
      const dist = parseDistance(l.distance);

      // Rent filter
      if (rent > maxRent) return false;

      // Distance filter
      if (dist > maxDistance) return false;

      // Bedrooms filter
      if (bedroomFilter !== "all") {
        const beds = Number(l.bedrooms);
        if (bedroomFilter === "0" && beds !== 0) return false;
        if (bedroomFilter === "1" && beds !== 1) return false;
        if (bedroomFilter === "2" && beds !== 2) return false;
        if (bedroomFilter === "3+" && beds < 3) return false;
      }

      // Department filter
      if (department !== "Any") {
        const deptRel = (l.departmentRelevance || "Any").toLowerCase();
        const selected = department.toLowerCase();
        const matches =
          deptRel === "any" ||
          deptRel.includes(selected) ||
          selected.includes(deptRel);
        if (!matches) return false;
      }

      // Amenities filter
      if (selectedAmenities.length > 0) {
        const listingAmenities = Array.isArray(l.amenities)
          ? l.amenities
          : typeof l.amenities === "string"
          ? l.amenities.split(",").map((s) => s.trim())
          : [];
        const normalized = listingAmenities.map((a) => a.toLowerCase());
        const hasAll = selectedAmenities.every((a) =>
          normalized.includes(a.toLowerCase())
        );
        if (!hasAll) return false;
      }

      // Search keyword filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const matchTitle = (l.title || "").toLowerCase().includes(term);
        const matchAddress = (l.address || "").toLowerCase().includes(term);
        const matchDesc = (l.description || "").toLowerCase().includes(term);
        const matchPoster = (l.posterName || "").toLowerCase().includes(term);
        const matchBusiness = (l.businessName || "").toLowerCase().includes(term);
        if (!matchTitle && !matchAddress && !matchDesc && !matchPoster && !matchBusiness) {
          return false;
        }
      }

      return true;
    });

    const getAvg = (item) => {
      if (item.avgRating !== undefined && item.avgRating !== null) {
        return Number(item.avgRating);
      }
      return Number(ratings[item.id] || 0);
    };

    switch (sort) {
      case "rent-asc":
        result = [...result].sort((a, b) => (Number(a.rent) || 0) - (Number(b.rent) || 0));
        break;
      case "rent-desc":
        result = [...result].sort((a, b) => (Number(b.rent) || 0) - (Number(a.rent) || 0));
        break;
      case "distance":
        result = [...result].sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance));
        break;
      case "rating":
        result = [...result].sort((a, b) => getAvg(b) - getAvg(a));
        break;
      default:
        result = [...result].sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
    }

    return result;
  }, [
    listings,
    maxRent,
    maxDistance,
    bedroomFilter,
    department,
    selectedAmenities,
    searchTerm,
    sort,
    ratings,
  ]);

  const activeFiltersCount =
    (searchTerm ? 1 : 0) +
    (maxRent < 5000 ? 1 : 0) +
    (maxDistance < 5 ? 1 : 0) +
    (bedroomFilter !== "all" ? 1 : 0) +
    (department !== "Any" ? 1 : 0) +
    selectedAmenities.length;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Page header & Search Bar */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Student Housing Listings
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-200/60">
                  {filtered.length} available
                </span>
              </div>
              <p className="text-slate-500 text-sm mt-1">
                Verified apartments, private rooms, and student rentals near campus
              </p>
            </div>

            {/* Top controls: Search & Sort */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {/* Search input */}
              <div className="relative flex-1 sm:w-64 min-w-[200px]">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by area, title..."
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
                <svg
                  className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-0.5"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-sm text-slate-700">
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer pr-1"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 shadow-xs transition-colors"
              >
                <svg
                  className="w-4 h-4 text-slate-500"
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
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-28">
            <FilterPanel
              maxRent={maxRent}
              setMaxRent={setMaxRent}
              maxDistance={maxDistance}
              setMaxDistance={setMaxDistance}
              bedroomFilter={bedroomFilter}
              setBedroomFilter={setBedroomFilter}
              department={department}
              setDepartment={setDepartment}
              selectedAmenities={selectedAmenities}
              setSelectedAmenities={setSelectedAmenities}
              departments={departments}
              amenityOptions={amenityOptions}
              activeFiltersCount={activeFiltersCount}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Mobile Sidebar Drawer */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="absolute left-0 inset-y-0 w-84 max-w-[85vw] bg-white shadow-2xl overflow-y-auto flex flex-col">
                <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-slate-900 text-lg">
                      Filters
                    </h3>
                    {activeFiltersCount > 0 && (
                      <span className="text-xs font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full">
                        {activeFiltersCount} active
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
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
                  </button>
                </div>
                <div className="p-5 flex-1">
                  <FilterPanel
                    maxRent={maxRent}
                    setMaxRent={setMaxRent}
                    maxDistance={maxDistance}
                    setMaxDistance={setMaxDistance}
                    bedroomFilter={bedroomFilter}
                    setBedroomFilter={setBedroomFilter}
                    department={department}
                    setDepartment={setDepartment}
                    selectedAmenities={selectedAmenities}
                    setSelectedAmenities={setSelectedAmenities}
                    departments={departments}
                    amenityOptions={amenityOptions}
                    activeFiltersCount={activeFiltersCount}
                    onReset={handleResetFilters}
                  />
                </div>
                <div className="p-5 border-t border-slate-100 sticky bottom-0 bg-white shadow-md">
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-sm"
                  >
                    Show {filtered.length} {filtered.length === 1 ? "Result" : "Results"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Listings Grid */}
          <div className="flex-1 min-w-0">
            {/* Active Filter Badges Bar */}
            {activeFiltersCount > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2 bg-white rounded-xl border border-slate-100 p-3 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Active Filters:
                </span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                    "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}
                {maxRent < 5000 && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-orange-50 text-orange-700 border border-orange-200/60 px-2.5 py-1 rounded-lg">
                    ≤ ${maxRent.toLocaleString()}/mo
                    <button
                      onClick={() => setMaxRent(5000)}
                      className="hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}
                {maxDistance < 5 && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-orange-50 text-orange-700 border border-orange-200/60 px-2.5 py-1 rounded-lg">
                    ≤ {maxDistance} mi
                    <button
                      onClick={() => setMaxDistance(5)}
                      className="hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}
                {bedroomFilter !== "all" && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-orange-50 text-orange-700 border border-orange-200/60 px-2.5 py-1 rounded-lg">
                    {bedroomFilter === "0" ? "Studio" : `${bedroomFilter} Bed`}
                    <button
                      onClick={() => setBedroomFilter("all")}
                      className="hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}
                {department !== "Any" && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-200/60 px-2.5 py-1 rounded-lg">
                    {department.split("/")[0].trim()}
                    <button
                      onClick={() => setDepartment("Any")}
                      className="hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedAmenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-1 rounded-lg"
                  >
                    {amenity}
                    <button
                      onClick={() =>
                        setSelectedAmenities((prev) => prev.filter((a) => a !== amenity))
                      }
                      className="hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-orange-500 hover:text-orange-600 font-semibold ml-auto"
                >
                  Reset all
                </button>
              </div>
            )}

            {/* Error state */}
            {fetchError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-6">
                <p className="text-red-700 font-medium text-sm mb-3">
                  {fetchError}
                </p>
                <button
                  onClick={refetchListings}
                  className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry Loading
                </button>
              </div>
            )}

            {/* Loading state */}
            {isLoading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse shadow-xs"
                  >
                    <div className="h-48 bg-slate-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                      <div className="h-3 bg-slate-100 rounded-md w-1/2" />
                      <div className="h-3 bg-slate-100 rounded-md w-2/3" />
                      <div className="pt-3 border-t border-slate-50 flex justify-between">
                        <div className="h-3 bg-slate-200 rounded-md w-16" />
                        <div className="h-3 bg-slate-100 rounded-md w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              /* Empty state */
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-xs">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-orange-500"
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
                <h3 className="font-heading font-bold text-slate-900 text-lg mb-1">
                  No listings found
                </h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                  {listings.length === 0
                    ? "There are currently no active rental listings available. Please check back soon!"
                    : "No properties match your active filters. Try adjusting your rent, distance, or search terms."}
                </p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-xs"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              /* Listing Grid */
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    avgRating={
                      listing.avgRating !== undefined
                        ? Number(listing.avgRating)
                        : Number(ratings[listing.id] || 0)
                    }
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
/*  Filter Panel Component                                            */
/* ------------------------------------------------------------------ */

function FilterPanel({
  maxRent,
  setMaxRent,
  maxDistance,
  setMaxDistance,
  bedroomFilter,
  setBedroomFilter,
  department,
  setDepartment,
  selectedAmenities,
  setSelectedAmenities,
  departments,
  amenityOptions,
  activeFiltersCount,
  onReset,
}) {
  function toggleAmenity(amenity) {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-bold text-slate-900 text-base">
            Filter Properties
          </h3>
          {activeFiltersCount > 0 && (
            <span className="text-xs font-bold bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-orange-500 hover:text-orange-600 font-semibold transition-colors"
          >
            Reset all
          </button>
        )}
      </div>

      {/* Bedroom Filter Chips */}
      <div>
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2.5">
          Bedrooms
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {BEDROOM_OPTIONS.map((opt) => {
            const isActive = bedroomFilter === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setBedroomFilter(opt.value)}
                className={`py-1.5 px-2 text-xs rounded-lg font-medium transition-all text-center ${
                  isActive
                    ? "bg-orange-500 text-white font-semibold shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Rent Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Max Rent
          </label>
          <span className="text-sm font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md">
            ${maxRent >= 5000 ? "5,000+" : maxRent.toLocaleString()}/mo
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={5000}
          step={50}
          value={maxRent}
          onChange={(e) => setMaxRent(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-orange-500"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
          <span>$500</span>
          <span>$2,500</span>
          <span>$5,000+</span>
        </div>
      </div>

      {/* Max Distance Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Max Distance to Campus
          </label>
          <span className="text-sm font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md">
            {maxDistance >= 5 ? "5+ mi" : `${maxDistance} mi`}
          </span>
        </div>
        <input
          type="range"
          min={0.2}
          max={5}
          step={0.1}
          value={maxDistance}
          onChange={(e) => setMaxDistance(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-orange-500"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
          <span>0.2 mi</span>
          <span>2.5 mi</span>
          <span>5.0 mi</span>
        </div>
      </div>

      {/* Department Relevance */}
      <div>
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
          Department Preference
        </label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
        >
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Amenities Multi-select */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Amenities
          </label>
          {selectedAmenities.length > 0 && (
            <button
              onClick={() => setSelectedAmenities([])}
              className="text-[11px] text-orange-500 hover:text-orange-600 font-semibold"
            >
              Clear ({selectedAmenities.length})
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
          {amenityOptions.map((amenity) => {
            const active = selectedAmenities.includes(amenity);
            return (
              <button
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className={`px-2.5 py-1 text-xs rounded-lg border transition-all duration-150 ${
                  active
                    ? "bg-orange-500 border-orange-500 text-white font-medium shadow-xs"
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
/*  Listing Card Component                                            */
/* ------------------------------------------------------------------ */

function ListingCard({ listing, avgRating }) {
  const [imgError, setImgError] = useState(false);

  const rent = Number(listing.rent) || 0;
  const utilityCharge = Number(listing.utilityCharge) || 0;
  const bedrooms = Number(listing.bedrooms);
  const bathrooms = Number(listing.bathrooms);

  const deptTag = (listing.departmentRelevance || "General")
    .split("/")[0]
    .trim();

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-orange-200/80 transition-all duration-300 flex flex-col h-full text-left"
    >
      {/* Image container */}
      <div className="relative h-48 bg-slate-100 overflow-hidden shrink-0">
        {listing.photoUrl && !imgError ? (
          <img
            src={listing.photoUrl}
            alt={listing.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap max-w-[85%]">
          <span className="bg-white/95 backdrop-blur-xs text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs">
            {formatDistance(listing.distance)}
          </span>
          {utilityCharge === 0 && (
            <span className="bg-emerald-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
              Bills incl.
            </span>
          )}
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
            ${rent.toLocaleString()}/mo
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-heading font-bold text-slate-900 text-sm leading-snug mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
            {listing.title}
          </h3>
          <p className="text-slate-400 text-xs mb-3 truncate flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5 text-slate-400 shrink-0"
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

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md">
              <svg
                className="w-3.5 h-3.5 text-slate-400"
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
              {bedrooms === 0 ? "Studio" : `${bedrooms} BR`} · {bathrooms || 1} BA
            </span>
            {utilityCharge > 0 && (
              <span className="text-[11px] text-slate-400 font-medium">
                +${utilityCharge} util.
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
          {avgRating > 0 ? (
            <div className="flex items-center gap-1.5">
              <StarRating rating={avgRating} size="sm" />
              <span className="text-xs font-bold text-slate-700">
                {avgRating.toFixed(1)}
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 font-medium">New listing</span>
          )}
          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full max-w-[120px] truncate">
            {deptTag}
          </span>
        </div>
      </div>
    </Link>
  );
}
