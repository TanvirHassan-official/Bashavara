"use client";

import { useState } from "react";

export default function AuthForm({ mode = "login" }) {
  const [role, setRole] = useState("student"); // "student" | "landlord"

  // TODO: form state, validation, submit to auth-client

  return (
    <form className="flex flex-col gap-4">
      {/* Role toggle */}
      <div className="tabs tabs-box">
        <button
          type="button"
          className={`tab ${role === "student" ? "tab-active" : ""}`}
          onClick={() => setRole("student")}
        >
          Student
        </button>
        <button
          type="button"
          className={`tab ${role === "landlord" ? "tab-active" : ""}`}
          onClick={() => setRole("landlord")}
        >
          Landlord
        </button>
      </div>

      {/* TODO: email, password, name (register only) fields */}

      <button type="submit" className="btn btn-primary">
        {mode === "login" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}
