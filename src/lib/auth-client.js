import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  fetchOptions: {
    credentials: "include",
  },
  plugins: [inferAdditionalFields()],
});

export const { signIn, signUp, signOut, useSession } = authClient;