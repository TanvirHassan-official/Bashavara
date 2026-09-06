import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Login | BashaVara",
  description: "Log in to your BashaVara account",
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const initialRole = params?.role === "landlord" ? "landlord" : "student";

  return <LoginForm initialRole={initialRole} />;
}
