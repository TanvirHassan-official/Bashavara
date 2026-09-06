import { readFileSync } from "fs";
import { join } from "path";
import ListingsClient from "./ListingsClient";

export const metadata = {
  title: "Listings | BashaVara",
  description: "Browse available rental listings near your campus",
};

// Load mock data at render time (server component)
const mockData = JSON.parse(
  readFileSync(join(process.cwd(), "public", "data.json"), "utf-8")
);

// Pre-compute average ratings per listing
function buildRatings(listings, reviews) {
  const map = {};
  for (const listing of listings) {
    const relevant = reviews.filter((r) => r.listingId === listing.id);
    map[listing.id] =
      relevant.length > 0
        ? relevant.reduce((sum, r) => sum + r.rating, 0) / relevant.length
        : 0;
  }
  return map;
}

export default async function ListingsPage() {
  const { listings, departments, amenityOptions, reviews } = mockData;
  const ratings = buildRatings(listings, reviews);

  return (
    <ListingsClient
      listings={listings}
      departments={departments}
      amenityOptions={amenityOptions}
      ratings={ratings}
    />
  );
}
