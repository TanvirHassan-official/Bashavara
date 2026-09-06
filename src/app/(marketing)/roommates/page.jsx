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
  const { currentUser, users } = mockData;

  return <RoommatesClient currentUser={currentUser} users={users} />;
}
