import Link from "next/link";

export default function ListingCard({ listing }) {
  // TODO: image, price, location, amenity tags
  return (
    <Link
      href={`/listings/${listing?.id}`}
      className="card bg-base-100 shadow-md transition-shadow hover:shadow-lg"
    >
      <div className="card-body">
        <h2 className="card-title">{listing?.title ?? "Listing"}</h2>
        <p className="text-sm text-zinc-500">{listing?.location ?? "Location"}</p>
      </div>
    </Link>
  );
}
