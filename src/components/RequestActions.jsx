"use client";

export default function RequestActions({ requestId, onUpdate }) {
  const handleAccept = async () => {
    // TODO: PATCH request status to "accepted"
  };

  const handleDecline = async () => {
    // TODO: PATCH request status to "declined"
  };

  return (
    <div className="flex gap-2">
      <button onClick={handleAccept} className="btn btn-success btn-sm">
        Accept
      </button>
      <button onClick={handleDecline} className="btn btn-error btn-sm">
        Decline
      </button>
    </div>
  );
}
