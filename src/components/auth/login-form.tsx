"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { loginSchema, LoginInput } from "@/lib/validations/auth.schema";
import { loginAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    setServerError(null);
    startTransition(async () => {
      const res = await loginAction(data);

      if (!res.success) {
        if (res.status === 429) {
          const waitMsg = res.retryAfter
            ? `Too many attempts. Please try again in ${res.retryAfter} seconds.`
            : "Too many attempts, please try again later.";
          setServerError(waitMsg);
          toast.error(waitMsg);
        } else {
          setServerError(res.message);
          toast.error(res.message);
        }

        if (res.fieldErrors) {
          for (const [key, msgs] of Object.entries(res.fieldErrors)) {
            if (msgs?.[0] && (key === "email" || key === "password")) {
              setError(key, { message: msgs[0] });
            }
          }
        }
        return;
      }

      toast.success("Welcome back!");

      if (res.data?.mustChangePassword) {
        router.push("/change-password");
      } else {
        const from = searchParams.get("from");
        router.push(from || "/dashboard");
      }
      router.refresh();
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Sign in to your account
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Enter your credentials below to access your workspace
        </p>
      </div>

      {serverError && (
        <div className="flex items-center gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          id="email"
          label="Email address"
          required
          error={errors.email?.message}
        >
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="student@example.com"
              className="pl-9"
              error={!!errors.email}
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </div>
        </FormField>

        <FormField
          id="password"
          label="Password"
          required
          error={errors.password?.message}
        >
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="pl-9"
              error={!!errors.password}
              aria-invalid={!!errors.password}
              {...register("password")}
            />
          </div>
        </FormField>

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full gap-2 font-semibold shadow-md shadow-indigo-600/20"
          isLoading={isPending}
          disabled={isPending}
        >
          <span>Sign In</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          Sign up as a Student
        </Link>
      </div>
    </div>
  );
}
