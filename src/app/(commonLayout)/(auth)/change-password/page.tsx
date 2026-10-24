import { Metadata } from "next";
import { requireUser } from "@/services/auth.service";
import { ChangePasswordForm } from "@/components/auth/change-password-form";

export const metadata: Metadata = {
  title: "Change Password",
  description: "Update your account password",
};

export default async function ChangePasswordPage() {
  const user = await requireUser();

  return (
    <ChangePasswordForm mustChangePassword={user.mustChangePassword} />
  );
}
