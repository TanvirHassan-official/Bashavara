import { readFileSync } from "fs";
import { join } from "path";
import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard | BashaVara",
  description: "Your student dashboard",
};

// Load mock data at render time (server component)
const mockData = JSON.parse(
  readFileSync(join(process.cwd(), "public", "data.json"), "utf-8")
);

export default async function DashboardPage() {
  const { requests } = mockData;

  return <DashboardClient requests={requests} />;
}
