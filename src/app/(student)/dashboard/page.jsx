import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { api } from "@/lib/api";
import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard | BashaVara",
  description: "Your student dashboard",
};

export default async function DashboardPage() {
  const sessionData = await getSession();

  if (!sessionData || !sessionData.user) {
    redirect("/login");
  }

  if (sessionData.user.role === "landlord") {
    redirect("/landlord");
  }

  let incomingRequests = [];
  let outgoingRequests = [];

  try {
    const [incomingRes, outgoingRes] = await Promise.all([
      api.get("/api/requests/incoming"),
      api.get("/api/requests/outgoing"),
    ]);

    incomingRequests = incomingRes.requests || [];
    outgoingRequests = outgoingRes.requests || [];
  } catch (error) {
    console.error("Failed to load dashboard requests:", error.message);
  }

  return (
    <DashboardClient
      incomingRequests={incomingRequests}
      outgoingRequests={outgoingRequests}
      currentUser={sessionData.user}
    />
  );
}
