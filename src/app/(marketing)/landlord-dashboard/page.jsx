import { readFileSync } from "fs";
import { join } from "path";
import LandlordDashboardClient from "./LandlordDashboardClient";

export const metadata = {
  title: "Landlord Dashboard | BashaVara",
  description: "Manage your listings and student requests",
};

// Load mock data at render time (server component)
const mockData = JSON.parse(
  readFileSync(join(process.cwd(), "public", "data.json"), "utf-8")
);

export default async function LandlordDashboardPage() {
  const { currentLandlord, landlordListings, landlordRequests } = mockData;

  return (
    <LandlordDashboardClient
      currentLandlord={currentLandlord}
      initialListings={landlordListings}
      initialRequests={landlordRequests}
    />
  );
}
