"use client";

export default function ListingRowActions({ listing, onUpdate }) {
  const handlePause = async () => {
    // TODO: PATCH listing status
  };

  const handleDelete = async () => {
    // TODO: DELETE listing
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
        ⋮
      </div>
      <ul tabIndex={0} className="dropdown-content menu rounded-box bg-base-100 p-2 shadow">
        <li>
          <button onClick={handlePause}>
            {listing?.paused ? "Resume" : "Pause"}
          </button>
        </li>
        <li>
          <a href={`/landlord/listings/${listing?.id}/edit`}>Edit</a>
        </li>
        <li>
          <button onClick={handleDelete} className="text-error">
            Delete
          </button>
        </li>
      </ul>
    </div>
  );
}
