import RegisterForm from "@/components/RegisterForm";

export const metadata = {
  title: "Register | BashaVara",
  description: "Create your BashaVara account",
};

export default async function RegisterPage({ searchParams }) {
  const params = await searchParams;
  const initialRole = params?.role === "landlord" ? "landlord" : "student";

  return <RegisterForm initialRole={initialRole} />;
}
