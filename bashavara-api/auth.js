import "dotenv/config";
import { betterAuth } from "better-auth";
import { createPool } from "mysql2/promise";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: createPool({
    uri: process.env.DATABASE_URL || "mysql://root:password@localhost:3306/bashavara",
    timezone: "Z",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "student",
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      businessName: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const role = user.role || "student";

          // 1. Whitelist role to student or landlord
          if (!["student", "landlord"].includes(role)) {
            throw new Error("Invalid role. Must be 'student' or 'landlord'.");
          }

          // 2. Reject non-.edu emails when role is student
          if (role === "student" && !user.email.endsWith(".edu")) {
            throw new Error("Students must register with a .edu email address");
          }

          // 3. Require phone for landlords
          if (role === "landlord" && (!user.phone || !user.phone.trim())) {
            throw new Error("Landlords must provide a valid phone number");
          }

          return { data: { ...user, role } };
        },
      },
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000"],
  advanced: {
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
});
