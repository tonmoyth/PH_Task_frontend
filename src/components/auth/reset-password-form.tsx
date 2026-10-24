"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Lock, ArrowRight, AlertTriangle, ArrowLeft } from "lucide-react";
import {
  resetPasswordSchema,
  ResetPasswordInput,
} from "@/lib/validations/auth.schema";
import { resetPasswordAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";

interface ResetPasswordFormProps {
  token?: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // If token is missing, show invalid link state
  if (!token) {
    return (
      <div className="w-full space-y-6 text-center">
        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Invalid or Expired Link
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            This password reset link is invalid or has expired. Please request a new password reset link.
          </p>
        </div>
        <div>
          <Link href="/forgot-password">
            <Button className="gap-2">
              <span>Request New Link</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = (data: ResetPasswordInput) => {
    setServerError(null);
    startTransition(async () => {
      const res = await resetPasswordAction({
        ...data,
        token,
      });

      if (!res.success) {
        setServerError(res.message);
        toast.error(res.message);
        if (res.fieldErrors?.newPassword) {
          setError("newPassword", { message: res.fieldErrors.newPassword[0] });
        }
        return;
      }

      toast.success("Password reset successfully! Please log in.");
      router.push("/login");
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Reset your password
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Choose a new secure password for your account
        </p>
      </div>

      {serverError && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <input type="hidden" value={token} {...register("token")} />

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

      <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to sign in</span>
        </Link>
      </div>
    </div>
  );
}
