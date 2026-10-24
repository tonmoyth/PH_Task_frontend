import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Student Registration",
  description: "Create a student account to submit your project assignments",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
