export const metadata = {
  title: "Edit Listing | BashaVara",
};

export default async function EditListingPage({ params }) {
  const { id } = await params;
  // TODO: fetch existing listing data for editing
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Edit Listing #{id}</h1>
      {/* TODO: <ListingForm mode="edit" listingId={id} /> */}
    </main>
  );
}
