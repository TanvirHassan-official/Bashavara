import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Navbar from "@/components/Navbar";

export default async function LandlordLayout({ children }) {
  const sessionData = await getSession();

  if (!sessionData || !sessionData.user) {
    redirect("/login?role=landlord");
  }

  if (sessionData.user.role !== "landlord") {
    redirect("/dashboard");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
