import { readFileSync } from "fs";
import { join } from "path";
import { notFound } from "next/navigation";
import ListingDetailClient from "./ListingDetailClient";

// Load mock data at render time (server component)
const mockData = JSON.parse(
  readFileSync(join(process.cwd(), "public", "data.json"), "utf-8")
);

export async function generateMetadata({ params }) {
  const { id } = await params;
  const listing =
    mockData.listings.find((l) => l.id === id) ??
    mockData.landlordListings.find((l) => l.id === id);

  return {
    title: listing
      ? `${listing.title} | BashaVara`
      : "Listing Not Found | BashaVara",
    description: listing?.description?.slice(0, 160) ?? "",
  };
}

export default async function ListingDetailPage({ params }) {
  const { id } = await params;

  // Search both student listings and landlord listings
  const listing =
    mockData.listings.find((l) => l.id === id) ??
    mockData.landlordListings.find((l) => l.id === id);

  if (!listing) {
    notFound();
  }

  const reviews = mockData.reviews.filter((r) => r.listingId === id);
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <ListingDetailClient
      listing={listing}
      reviews={reviews}
      avgRating={avgRating}
    />
  );
}
