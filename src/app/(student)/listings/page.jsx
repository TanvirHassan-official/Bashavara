import { api } from "@/lib/api";
import ListingsClient from "./ListingsClient";

export const metadata = {
  title: "Listings | BashaVara",
  description: "Browse available rental listings near your campus",
};

const DEPARTMENTS = [
  "Any",
  "Computer Science / EECS",
  "Engineering / Sciences",
  "Business / Law / Social Sciences",
  "Medicine / Public Health",
  "Arts / Design / Humanities",
  "Law / Business",
  "Design / Fine Arts",
];

const AMENITY_OPTIONS = [
  "High-speed WiFi",
  "In-unit laundry",
  "Laundry in building",
  "Dishwasher",
  "A/C",
  "Heating included",
  "Parking included",
  "Bike storage",
  "Gym",
  "Rooftop deck",
  "Backyard / yard",
  "Pet-friendly",
  "Furnished",
  "Storage unit",
  "Doorman",
  "Elevator",
  "All utilities included",
  "Private entrance",
];

export default async function ListingsPage() {
  let listings = [];
  const ratings = {};

  try {
    const data = await api.get("/api/listings?status=active");
    listings = data.listings || [];
    for (const item of listings) {
      ratings[item.id] = item.avgRating || 0;
    }
  } catch (error) {
    console.error("Failed to load listings from API, trying fallback:", error.message);
  }

  return (
    <ListingsClient
      listings={listings}
      departments={DEPARTMENTS}
      amenityOptions={AMENITY_OPTIONS}
      ratings={ratings}
    />
  );
}
