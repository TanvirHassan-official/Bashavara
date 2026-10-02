import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import ListingDetailClient from "./ListingDetailClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const data = await api.get(`/api/listings/${id}`);
    const listing = data.listing;
    return {
      title: listing ? `${listing.title} | BashaVara` : "Listing Not Found | BashaVara",
      description: listing?.description?.slice(0, 160) ?? "",
    };
  } catch {
    return {
      title: "Listing | BashaVara",
      description: "Rental property details",
    };
  }
}

export default async function ListingDetailPage({ params }) {
  const { id } = await params;

  try {
    const data = await api.get(`/api/listings/${id}`);
    const listing = data.listing;

    if (!listing) {
      notFound();
    }

    return (
      <ListingDetailClient
        listing={listing}
        reviews={listing.reviews || []}
        avgRating={listing.avgRating || 0}
      />
    );
  } catch (error) {
    if (error.status === 404) {
      notFound();
    }
    console.error("Failed to fetch listing detail:", error.message);
    notFound();
  }
}
