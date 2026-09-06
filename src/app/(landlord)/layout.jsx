import Navbar from "@/components/Navbar";

export default function LandlordLayout({ children }) {
  // TODO: role guard — check session, redirect if not landlord
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
