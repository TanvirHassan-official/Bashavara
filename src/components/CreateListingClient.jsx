"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DEPARTMENTS = [
  "Any",
  "Computer Science",
  "Engineering",
  "Business",
  "Medicine",
  "Law",
  "Arts",
  "Science",
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

const EMPTY_FORM = {
  title: "",
  address: "",
  description: "",
  rent: "",
  utilityCharge: "0",
  bedrooms: "1",
  bathrooms: "1",
  distance: "",
  departmentRelevance: "Any",
  photoUrl: "",
  availableFrom: "",
  amenities: [],
};

export default function CreateListingClient({ editListing }) {
  const isEdit = !!editListing;
  const router = useRouter();

  const [form, setForm] = useState(
    isEdit
      ? {
          title: editListing.title,
          address: editListing.address,
          description: editListing.description,
          rent: String(editListing.rent),
          utilityCharge: String(editListing.utilityCharge),
          bedrooms: String(editListing.bedrooms),
          bathrooms: String(editListing.bathrooms),
          distance: String(editListing.distance),
          departmentRelevance: editListing.departmentRelevance,
          photoUrl: editListing.photoUrl,
          availableFrom: editListing.availableFrom,
          amenities: [...editListing.amenities],
        }
      : EMPTY_FORM
  );

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function toggleAmenity(a) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));
  }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.rent || Number(form.rent) <= 0)
      errs.rent = "Enter a valid monthly rent";
    if (!form.distance || Number(form.distance) <= 0)
      errs.distance = "Enter distance to campus in miles";
    if (!form.availableFrom.trim())
      errs.availableFrom = "Availability date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1000);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-12 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="font-heading text-2xl font-bold text-slate-900 mb-3">
            {isEdit ? "Listing updated!" : "Listing published!"}
          </h2>
          <p className="text-slate-500 mb-8">
            {isEdit
              ? "Your listing has been updated and is live for students to browse."
              : "Your listing is now live. Students on BashaVara can find and request contact on it."}
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/landlord-dashboard"
              className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors inline-block"
            >
              Back to dashboard
            </Link>
            {!isEdit && (
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm(EMPTY_FORM);
                }}
                className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl text-sm hover:bg-slate-50 transition-colors"
              >
                Add another listing
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/landlord-dashboard")}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="font-heading text-lg font-bold text-slate-900">
                {isEdit ? "Edit listing" : "Create new listing"}
              </h1>
              <p className="text-xs text-slate-400">
                Fill in your property details
              </p>
            </div>
          </div>
          <button
            form="listing-form"
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Saving...
              </>
            ) : isEdit ? (
              "Save changes"
            ) : (
              "Publish listing"
            )}
          </button>
        </div>
      </div>

      <form id="listing-form" onSubmit={handleSubmit}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* Basic info */}
          <Section
            title="Basic information"
            desc="How your listing will appear to students"
          >
            <div className="space-y-4">
              <Field label="Listing title" required error={errors.title}>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Sunny 2BR near MIT Campus"
                  className={inputCls(!!errors.title)}
                />
              </Field>

              <Field label="Full address" required error={errors.address}>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="e.g. 15 Dunster St, Cambridge, MA 02138"
                  className={inputCls(!!errors.address)}
                />
              </Field>

              <Field label="Description" required error={errors.description}>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe your property — layout, condition, nearby transit, what makes it great for students..."
                  className={`${inputCls(!!errors.description)} resize-none`}
                />
                <p className="text-xs text-slate-400 mt-1">
                  {form.description.length} characters
                </p>
              </Field>
            </div>
          </Section>

          {/* Pricing */}
          <Section
            title="Pricing & utilities"
            desc="Rent is displayed prominently on the listing card"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Monthly rent ($)" required error={errors.rent}>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={form.rent}
                    onChange={(e) => set("rent", e.target.value)}
                    placeholder="1200"
                    className={`${inputCls(!!errors.rent)} pl-7`}
                  />
                </div>
              </Field>

              <Field
                label="Monthly utility charge ($)"
                hint="Enter 0 if utilities are included in rent"
              >
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={form.utilityCharge}
                    onChange={(e) => set("utilityCharge", e.target.value)}
                    placeholder="0"
                    className={`${inputCls(false)} pl-7`}
                  />
                </div>
              </Field>
            </div>
          </Section>

          {/* Property details */}
          <Section
            title="Property details"
            desc="Help students understand what they are renting"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Field label="Bedrooms">
                <select
                  value={form.bedrooms}
                  onChange={(e) => set("bedrooms", e.target.value)}
                  className={inputCls(false)}
                >
                  <option value="0">Studio</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} Bedroom{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Bathrooms">
                <select
                  value={form.bathrooms}
                  onChange={(e) => set("bathrooms", e.target.value)}
                  className={inputCls(false)}
                >
                  {[1, 1.5, 2, 2.5, 3].map((n) => (
                    <option key={n} value={n}>
                      {n} Bath{n > 1 ? "rooms" : "room"}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Distance to campus (mi)"
                required
                error={errors.distance}
                hint="Walking distance in miles"
              >
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={form.distance}
                  onChange={(e) => set("distance", e.target.value)}
                  placeholder="0.5"
                  className={inputCls(!!errors.distance)}
                />
              </Field>

              <Field label="Department relevance">
                <select
                  value={form.departmentRelevance}
                  onChange={(e) => set("departmentRelevance", e.target.value)}
                  className={inputCls(false)}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <Field
                label="Available from"
                required
                error={errors.availableFrom}
              >
                <input
                  type="text"
                  value={form.availableFrom}
                  onChange={(e) => set("availableFrom", e.target.value)}
                  placeholder="e.g. Aug 1, 2025 or Immediately"
                  className={inputCls(!!errors.availableFrom)}
                />
              </Field>

              <Field
                label="Photo URL"
                hint="Link to an externally hosted image (Imgur, Google Photos, etc.)"
              >
                <input
                  type="url"
                  value={form.photoUrl}
                  onChange={(e) => set("photoUrl", e.target.value)}
                  placeholder="https://i.imgur.com/..."
                  className={inputCls(false)}
                />
              </Field>
            </div>

            {form.photoUrl && (
              <div className="mt-3">
                <p className="text-xs text-slate-500 mb-2">Preview</p>
                <div className="h-40 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={form.photoUrl}
                    alt="Listing preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}
          </Section>

          {/* Amenities */}
          <Section
            title="Amenities"
            desc="Check everything that applies — students filter by these"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {AMENITY_OPTIONS.map((a) => {
                const checked = form.amenities.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm text-left transition-colors ${
                      checked
                        ? "border-orange-500 bg-orange-50 text-orange-700 font-medium"
                        : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                        checked
                          ? "bg-orange-500 border-orange-500"
                          : "border-slate-300"
                      }`}
                    >
                      {checked && (
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>
                    {a}
                  </button>
                );
              })}
            </div>
            {form.amenities.length > 0 && (
              <p className="text-xs text-orange-600 mt-3 font-medium">
                {form.amenities.length} amenities selected
              </p>
            )}
          </Section>

          {/* Submit footer */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              Your listing will be visible to all verified students on BashaVara
              immediately after publishing.
            </p>
            <div className="flex gap-3 shrink-0">
              <button
                type="button"
                onClick={() => router.push("/landlord-dashboard")}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-60"
              >
                {isEdit ? "Save changes" : "Publish listing"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function inputCls(hasError) {
  return `w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white transition-colors ${
    hasError ? "border-red-300 bg-red-50" : "border-slate-200"
  }`;
}

function Section({ title, desc, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <h2 className="font-heading font-semibold text-slate-900 text-base mb-1">
        {title}
      </h2>
      <p className="text-xs text-slate-400 mb-5">{desc}</p>
      {children}
    </div>
  );
}

function Field({ label, required, error, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-slate-400 mt-1">{hint}</p>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
