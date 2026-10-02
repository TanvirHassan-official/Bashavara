import { notFound } from "next/navigation";
import CreateListingClient from "@/components/CreateListingClient";
import { api } from "@/lib/api";

export const metadata = {
  title: "Edit Listing | BashaVara",
  description: "Edit your property listing",
};

export default async function EditListingPage({ params }) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  let editListing = null;
  try {
    const data = await api.get(`/api/listings/${id}`);
    if (data?.listing) {
      editListing = data.listing;
    }
  } catch (err) {
    console.error("Failed to fetch listing for edit:", err);
    notFound();
  }

  if (!editListing) {
    notFound();
  }

  return <CreateListingClient editListing={editListing} />;
}
