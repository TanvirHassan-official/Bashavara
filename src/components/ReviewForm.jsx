"use client";

import { useState } from "react";

export default function ReviewForm({ listingId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: POST review to API
    onSubmitted?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* TODO: interactive star rating + textarea */}
      <button type="submit" className="btn btn-primary btn-sm">
        Submit Review
      </button>
    </form>
  );
}
