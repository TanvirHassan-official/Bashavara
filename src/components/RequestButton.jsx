"use client";

export default function RequestButton({ listingId, type = "contact" }) {
  const handleRequest = async () => {
    // TODO: POST request to API
  };

  return (
    <button onClick={handleRequest} className="btn btn-primary">
      {type === "contact" ? "Request Contact" : "Connect"}
    </button>
  );
}
