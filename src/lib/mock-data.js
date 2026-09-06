/**
 * Mock data helpers for frontend development.
 *
 * All data is loaded from /data.json (in the public folder).
 * Import these functions instead of the API client while we
 * are building the frontend without a live backend.
 */

let _cache = null;

/** Fetch and cache the entire data.json payload. */
async function loadData() {
  if (_cache) return _cache;
  const res = await fetch("/data.json");
  if (!res.ok) throw new Error("Failed to load mock data");
  _cache = await res.json();
  return _cache;
}

// ---------------------------------------------------------------------------
// Data accessors
// ---------------------------------------------------------------------------

/** Current logged-in student user */
export async function getCurrentUser() {
  const data = await loadData();
  return data.currentUser;
}

/** All other student users (potential roommates) */
export async function getUsers() {
  const data = await loadData();
  return data.users;
}

/** Find a single user by id (searches currentUser + users) */
export async function getUserById(id) {
  const data = await loadData();
  if (data.currentUser.id === id) return data.currentUser;
  return data.users.find((u) => u.id === id) ?? null;
}

/** Current landlord profile */
export async function getCurrentLandlord() {
  const data = await loadData();
  return data.currentLandlord;
}

/** All landlord listings (includes listingStatus field) */
export async function getLandlordListings() {
  const data = await loadData();
  return data.landlordListings;
}

/** Requests that target the landlord */
export async function getLandlordRequests() {
  const data = await loadData();
  return data.landlordRequests;
}

/** All student listings */
export async function getListings() {
  const data = await loadData();
  return data.listings;
}

/** Find a single listing by id (searches both student & landlord listings) */
export async function getListingById(id) {
  const data = await loadData();
  return (
    data.listings.find((l) => l.id === id) ??
    data.landlordListings.find((l) => l.id === id) ??
    null
  );
}

/** All reviews */
export async function getReviews() {
  const data = await loadData();
  return data.reviews;
}

/** Reviews filtered to a specific listing */
export async function getReviewsForListing(listingId) {
  const data = await loadData();
  return data.reviews.filter((r) => r.listingId === listingId);
}

/** Average rating for a listing (returns 0 if no reviews) */
export async function getAverageRating(listingId) {
  const reviews = await getReviewsForListing(listingId);
  if (!reviews.length) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

/** All requests (sent & received by current user) */
export async function getRequests() {
  const data = await loadData();
  return data.requests;
}

/** Department list for filters/dropdowns */
export async function getDepartments() {
  const data = await loadData();
  return data.departments;
}

/** Amenity options for filters/forms */
export async function getAmenityOptions() {
  const data = await loadData();
  return data.amenityOptions;
}

// ---------------------------------------------------------------------------
// Utility / scoring helpers  (pure — no async needed)
// ---------------------------------------------------------------------------

/**
 * Compute a 0-100 roommate compatibility score.
 * Both params should be user objects with the shape from data.json.
 */
export function getCompatibilityScore(currentUser, candidate) {
  let score = 0;
  if (candidate.smokingPreference === currentUser.smokingPreference) score += 40;
  if (candidate.sleepSchedule === currentUser.sleepSchedule) score += 30;
  const budgetDiff = Math.abs(candidate.budget - currentUser.budget);
  if (budgetDiff < 200) score += 20;
  else if (budgetDiff < 500) score += 10;
  if (candidate.department === currentUser.department) score += 10;
  return score;
}
