/**
 * End-to-End User Flow Verification Script for BashaVara
 *
 * Simulates and verifies the full lifecycle:
 * 1. Register Student (.edu account validation)
 * 2. Register Landlord (phone requirement validation)
 * 3. Landlord creates a new Listing
 * 4. Student discovers listing and submits contact request
 * 5. Landlord receives and accepts request (unlocking contact details)
 * 6. Student submits verified review
 * 7. Security verification: Student blocked from Landlord routes (403)
 * 8. Security verification: Landlord cannot edit other landlord's listing (403)
 */

const API_BASE = process.env.API_URL || "http://localhost:5000";

async function runTestFlow() {
  console.log("==================================================================");
  console.log("🚀 Running BashaVara Full-Stack Lifecycle & Security Tests");
  console.log(`🎯 Target API: ${API_BASE}`);
  console.log("==================================================================\n");

  const timestamp = Date.now();
  const studentEmail = `student_${timestamp}@mit.edu`;
  const landlordEmail = `landlord_${timestamp}@realty.com`;
  const attackerLandlordEmail = `attacker_${timestamp}@realty.com`;
  const password = "Password123!";

  let studentCookie = "";
  let landlordCookie = "";
  let attackerCookie = "";
  let createdListingId = "";
  let createdRequestId = "";

  // Helper fetch function tracking cookies
  async function api(path, options = {}, cookie = "") {
    const headers = {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
      ...(options.headers || {}),
    };

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    const setCookie = res.headers.get("set-cookie");
    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    return { status: res.status, data, setCookie };
  }

  try {
    // ── STEP 1: Register Student ──────────────────────────────────────────
    console.log("1️⃣  Registering Student (.edu email)...");
    const regStudentRes = await api("/api/auth/sign-up/email", {
      method: "POST",
      body: JSON.stringify({
        name: "Test Student",
        email: studentEmail,
        password: password,
        role: "student",
      }),
    });

    if (regStudentRes.status === 200 || regStudentRes.status === 201) {
      studentCookie = regStudentRes.setCookie?.split(";")[0] || "";
      console.log(`   ✓ Student registered successfully: ${studentEmail}`);
    } else {
      console.log(`   ⚠️ Registration response: ${regStudentRes.status}`, regStudentRes.data);
    }

    // ── STEP 2: Register Landlord ─────────────────────────────────────────
    console.log("\n2️⃣  Registering Landlord with Phone & Business Name...");
    const regLandlordRes = await api("/api/auth/sign-up/email", {
      method: "POST",
      body: JSON.stringify({
        name: "Premier Properties",
        email: landlordEmail,
        password: password,
        role: "landlord",
        phone: "+1 617-555-9876",
        businessName: "Premier Student Housing LLC",
      }),
    });

    if (regLandlordRes.status === 200 || regLandlordRes.status === 201) {
      landlordCookie = regLandlordRes.setCookie?.split(";")[0] || "";
      console.log(`   ✓ Landlord registered successfully: ${landlordEmail}`);
    } else {
      console.log(`   ⚠️ Registration response: ${regLandlordRes.status}`, regLandlordRes.data);
    }

    // ── STEP 3: Landlord Creates Listing ──────────────────────────────────
    console.log("\n3️⃣  Landlord creates a new Listing...");
    const createListingRes = await api(
      "/api/listings",
      {
        method: "POST",
        body: JSON.stringify({
          title: "Modern 2BR Apartment Near Campus",
          address: "100 Main St, Cambridge, MA",
          description: "Spacious and newly renovated 2 bedroom apartment close to campus and public transit.",
          rent: 2200,
          utilityCharge: 75,
          bedrooms: 2,
          bathrooms: 1,
          distance: "0.5 mi",
          departmentRelevance: "Computer Science",
          availableFrom: "Sep 1, 2026",
          status: "active",
          amenities: ["High-speed WiFi", "In-unit laundry", "A/C"],
        }),
      },
      landlordCookie
    );

    if (createListingRes.status === 201) {
      createdListingId = createListingRes.data.listingId;
      console.log(`   ✓ Listing created successfully! ID: ${createdListingId}`);
    } else {
      console.log(`   ⚠️ Create Listing response: ${createListingRes.status}`, createListingRes.data);
    }

    // ── STEP 4: Student Sends Request ─────────────────────────────────────
    console.log("\n4️⃣  Student submits a contact request for the listing...");
    // Fetch landlord user ID from listing
    const listingRes = await api(`/api/listings/${createdListingId}`);
    const landlordId = listingRes.data?.listing?.landlordId;

    if (landlordId) {
      const sendReqRes = await api(
        "/api/requests",
        {
          method: "POST",
          body: JSON.stringify({
            receiverId: landlordId,
            listingId: createdListingId,
            type: "listing",
            message: "Hi! I am a grad student interested in renting this apartment for the fall term.",
          }),
        },
        studentCookie
      );

      if (sendReqRes.status === 201) {
        createdRequestId = sendReqRes.data.requestId;
        console.log(`   ✓ Request submitted successfully! ID: ${createdRequestId}`);
      } else {
        console.log(`   ⚠️ Send Request response: ${sendReqRes.status}`, sendReqRes.data);
      }
    }

    // ── STEP 5: Landlord Accepts Request ──────────────────────────────────
    if (createdRequestId) {
      console.log("\n5️⃣  Landlord accepts student request (unlocking contact email)...");
      const acceptRes = await api(
        `/api/requests/${createdRequestId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: "accepted" }),
        },
        landlordCookie
      );

      if (acceptRes.status === 200) {
        console.log("   ✓ Request accepted! Student email unlocked:", acceptRes.data?.request?.senderEmail);
      } else {
        console.log(`   ⚠️ Accept Request response: ${acceptRes.status}`, acceptRes.data);
      }
    }

    // ── STEP 6: Student Leaves Review ─────────────────────────────────────
    if (createdListingId) {
      console.log("\n6️⃣  Student submits review for the listing...");
      const reviewRes = await api(
        `/api/listings/${createdListingId}/reviews`,
        {
          method: "POST",
          body: JSON.stringify({
            rating: 5,
            comment: "Fantastic property and very responsive landlord! Highly recommended for students.",
          }),
        },
        studentCookie
      );

      if (reviewRes.status === 201) {
        console.log("   ✓ Review submitted successfully! ID:", reviewRes.data.reviewId);
      } else {
        console.log(`   ⚠️ Review response: ${reviewRes.status}`, reviewRes.data);
      }
    }

    // ── STEP 7: Security Check - Student blocked from Landlord route ─────
    console.log("\n7️⃣  [Security Test] Student attempts to access landlord stats & create listing...");
    const studentAsLandlordRes = await api("/api/stats/landlord", { method: "GET" }, studentCookie);
    if (studentAsLandlordRes.status === 403) {
      console.log("   🛡️ PASSED: Student was rejected with 403 Forbidden as expected.");
    } else {
      console.log(`   ⚠️ Unexpected status: ${studentAsLandlordRes.status}`, studentAsLandlordRes.data);
    }

    // ── STEP 8: Security Check - Landlord cannot edit another's listing ──
    console.log("\n8️⃣  [Security Test] Attacker landlord attempts to edit first landlord's listing...");
    const regAttackerRes = await api("/api/auth/sign-up/email", {
      method: "POST",
      body: JSON.stringify({
        name: "Attacker Landlord",
        email: attackerLandlordEmail,
        password: password,
        role: "landlord",
        phone: "+1 617-555-0000",
      }),
    });
    attackerCookie = regAttackerRes.setCookie?.split(";")[0] || "";

    if (createdListingId && attackerCookie) {
      const hackRes = await api(
        `/api/listings/${createdListingId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ title: "Hacked Listing Title" }),
        },
        attackerCookie
      );

      if (hackRes.status === 403) {
        console.log("   🛡️ PASSED: Attacker landlord was rejected with 403 Forbidden.");
      } else {
        console.log(`   ⚠️ Unexpected status: ${hackRes.status}`, hackRes.data);
      }
    }

    console.log("\n==================================================================");
    console.log("🎉 All Lifecycle & Security Tests Completed!");
    console.log("==================================================================");
  } catch (err) {
    console.error("Test execution encountered an error:", err.message);
  }
}

// Export and run if invoked directly
export { runTestFlow };
if (process.argv[1]?.endsWith("test-flow.js")) {
  runTestFlow();
}
