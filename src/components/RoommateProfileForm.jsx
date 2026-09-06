"use client";

import { useState } from "react";

export default function RoommateProfileForm({ initialProfile = {} }) {
  const [profile, setProfile] = useState({
    budget: initialProfile.budget ?? "",
    sleepSchedule: initialProfile.sleepSchedule ?? "",
    smoking: initialProfile.smoking ?? false,
    // TODO: more preferences
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: PUT to API
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* TODO: budget, sleep, smoking, bio fields */}
      <button type="submit" className="btn btn-primary">
        Save Profile
      </button>
    </form>
  );
}
