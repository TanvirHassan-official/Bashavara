import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { api } from "@/lib/api";
import LandlordDashboardClient from "./LandlordDashboardClient";

export const metadata = {
  title: "Landlord Dashboard | BashaVara",
  description: "Manage your listings and student requests",
};

export default async function LandlordDashboardPage() {
  const sessionData = await getSession();

  if (!sessionData || !sessionData.user) {
    redirect("/login?role=landlord");
  }

  if (sessionData.user.role !== "landlord") {
    redirect("/dashboard");
  }

  let listings = [];
  let requests = [];

  try {
    const [listingsRes, requestsRes] = await Promise.all([
      api.get(`/api/listings?landlordId=${sessionData.user.id}&status=all`),
      api.get("/api/requests/incoming"),
    ]);

    listings = listingsRes.listings || [];
    requests = requestsRes.requests || [];
  } catch (error) {
    console.error("Failed to load landlord dashboard data:", error.message);
  }

  return (
    <LandlordDashboardClient
      currentLandlord={sessionData.user}
      initialListings={listings}
      initialRequests={requests}
    />
  );
}
