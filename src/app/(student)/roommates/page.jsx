import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { readFileSync } from "fs";
import { join } from "path";
import RoommatesClient from "./RoommatesClient";

export const metadata = {
  title: "Roommates | BashaVara",
  description: "Find compatible roommates based on budget, sleep schedule, and lifestyle preferences",
};

// Load mock data at render time (server component)
const mockData = JSON.parse(
  readFileSync(join(process.cwd(), "public", "data.json"), "utf-8")
);

export default async function RoommatesPage() {
  const sessionData = await getSession();

  if (!sessionData || !sessionData.user) {
    redirect("/login");
  }

  const { currentUser, users } = mockData;

  // Use session user information merged with preferences
  const activeStudent = {
    ...currentUser,
    id: sessionData.user.id,
    name: sessionData.user.name || currentUser.name,
    email: sessionData.user.email || currentUser.email,
  };

  return <RoommatesClient currentUser={activeStudent} users={users} />;
}
