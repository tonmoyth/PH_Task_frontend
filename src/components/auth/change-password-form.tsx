"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Lock, ArrowRight, ShieldAlert, ArrowLeft } from "lucide-react";
import {
  changePasswordSchema,
  ChangePasswordInput,
} from "@/lib/validations/auth.schema";
import { changePasswordAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";

interface ChangePasswordFormProps {
  mustChangePassword?: boolean;
}

export function ChangePasswordForm({
  mustChangePassword = false,
}: ChangePasswordFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordInput) => {
    setServerError(null);
    startTransition(async () => {
      const res = await changePasswordAction(data);

      if (!res.success) {
        setServerError(res.message);
        toast.error(res.message);
        if (res.fieldErrors?.currentPassword) {
          setError("currentPassword", {
            message: res.fieldErrors.currentPassword[0],
          });
        }
        if (res.fieldErrors?.newPassword) {
          setError("newPassword", {
            message: res.fieldErrors.newPassword[0],
          });
        }
        return;
      }

      toast.success("Password changed successfully!");
      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <div className="w-full space-y-6">
      {mustChangePassword && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-200">
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <p className="font-semibold">Password change required</p>
            <p className="opacity-90">
              You are currently logged in with a temporary password. You must set a new secure password before accessing the system.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Change Password
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {mustChangePassword
            ? "Create a new permanent password for your account"
            : "Update your existing account password"}
        </p>
      </div>

      {serverError && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          id="currentPassword"
          label={mustChangePassword ? "Temporary / Current Password" : "Current Password"}
          required
          error={errors.currentPassword?.message}
        >
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="pl-9"
              error={!!errors.currentPassword}
              aria-invalid={!!errors.currentPassword}
              {...register("currentPassword")}
            />
          </div>
        </FormField>

        <FormField
          id="newPassword"
          label="New Password"
          required
          error={errors.newPassword?.message}
          helperText="Min. 8 characters with at least one letter and one number"
        >
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="pl-9"
              error={!!errors.newPassword}
              aria-invalid={!!errors.newPassword}
              {...register("newPassword")}
            />
          </div>
        </FormField>

        <FormField
          id="confirmPassword"
          label="Confirm New Password"
          required
          error={errors.confirmPassword?.message}
        >
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="pl-9"
              error={!!errors.confirmPassword}
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
          </div>
        </FormField>

        <Button
          type="submit"
          className="w-full gap-2 font-semibold shadow-md shadow-indigo-600/20"
          isLoading={isPending}
          disabled={isPending}
        >
          <span>Update Password</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {!mustChangePassword && (
        <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Cancel and return to dashboard</span>
          </Link>
        </div>
      )}
    </div>
  );
}
