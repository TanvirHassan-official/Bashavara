import { readFileSync } from "fs";
import { join } from "path";
import { notFound } from "next/navigation";
import CreateListingClient from "@/components/CreateListingClient";

export const metadata = {
  title: "Edit Listing | BashaVara",
  description: "Edit your property listing",
};

// Load mock data at render time (server component)
const mockData = JSON.parse(
  readFileSync(join(process.cwd(), "public", "data.json"), "utf-8")
);

export default async function EditListingPage({ searchParams }) {
  const params = await searchParams;
  const listingId = params.listingId;

  if (!listingId) {
    notFound();
  }

  // Find the listing in the landlord's listings
  const editListing = mockData.landlordListings.find(
    (l) => l.id === listingId
  );

  if (!editListing) {
    notFound();
  }

  return <CreateListingClient editListing={editListing} />;
}
