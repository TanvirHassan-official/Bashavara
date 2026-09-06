"use client";

import { useState } from "react";

export default function ListingForm({ mode = "create", initialData = {} }) {
  const [formData, setFormData] = useState({
    title: initialData.title ?? "",
    description: initialData.description ?? "",
    price: initialData.price ?? "",
    location: initialData.location ?? "",
    // TODO: amenities, images, etc.
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: POST/PUT to API
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* TODO: form fields */}
      <button type="submit" className="btn btn-primary">
        {mode === "create" ? "Publish Listing" : "Save Changes"}
      </button>
    </form>
  );
}
