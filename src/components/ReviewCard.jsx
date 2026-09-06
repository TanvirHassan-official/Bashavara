import StarRating from "./StarRating";

export default function ReviewCard({ review }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">{review?.authorName ?? "Anonymous"}</span>
        <StarRating value={review?.rating ?? 0} />
      </div>
      <p className="mt-2 text-sm text-zinc-600">{review?.comment ?? ""}</p>
    </div>
  );
}
