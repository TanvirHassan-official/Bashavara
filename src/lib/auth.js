import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { createPool } from "mysql2/promise";

export const auth = betterAuth({
  database: createPool({
    uri: process.env.DATABASE_URL,
    timezone: "Z",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});
