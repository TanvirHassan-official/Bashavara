import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
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
  const sessionData = await getSession();

  if (!sessionData || !sessionData.user) {
    redirect("/login");
  }

  if (sessionData.user.role === "landlord") {
    redirect("/landlord");
  }

  const { requests } = mockData;

  return <DashboardClient requests={requests} currentUser={sessionData.user} />;
}
