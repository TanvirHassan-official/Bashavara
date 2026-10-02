import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { api } from "@/lib/api";
import RoommatesClient from "./RoommatesClient";

export const metadata = {
  title: "Roommates | BashaVara",
  description: "Find compatible roommates based on budget, sleep schedule, and lifestyle preferences",
};

export default async function RoommatesPage() {
  const sessionData = await getSession();

  if (!sessionData || !sessionData.user) {
    redirect("/login");
  }

  let profile = {
    id: sessionData.user.id,
    name: sessionData.user.name || "Student",
    email: sessionData.user.email,
    budget: 1200,
    department: "Computer Science",
    sleepSchedule: "Flexible",
    smokingPreference: "Non-Smoker",
    bio: "",
  };

  let candidates = [];

  try {
    const [profileRes, roommatesRes] = await Promise.all([
      api.get("/api/me/profile"),
      api.get("/api/roommates"),
    ]);

    if (profileRes.profile) {
      profile = {
        ...profile,
        ...profileRes.profile,
      };
    }

    candidates = roommatesRes.roommates || [];
  } catch (err) {
    console.error("Failed to load roommate data:", err.message);
  }

  return <RoommatesClient currentUser={profile} users={candidates} />;
}
