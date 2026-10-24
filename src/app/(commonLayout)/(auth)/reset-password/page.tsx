import { Suspense } from "react";
import { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your Project Hub account",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string; otp?: string; code?: string }>;
}

async function ResetPasswordContent({
  searchParams,
}: ResetPasswordPageProps) {
  const resolvedParams = await searchParams;
  const token = resolvedParams.token || resolvedParams.otp || resolvedParams.code;
  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage(props: ResetPasswordPageProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      }
    >
      <ResetPasswordContent {...props} />
    </Suspense>
  );
}
