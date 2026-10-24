"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { User, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { registerSchema, RegisterInput } from "@/lib/validations/auth.schema";
import { registerAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterInput) => {
    setServerError(null);
    startTransition(async () => {
      const res = await registerAction(data);

      if (!res.success) {
        setServerError(res.message);
        toast.error(res.message);
        if (res.fieldErrors) {
          const allowedFields: Array<keyof RegisterInput> = ["name", "email", "password", "confirmPassword"];
          for (const [key, msgs] of Object.entries(res.fieldErrors)) {
            if (msgs?.[0] && allowedFields.includes(key as keyof RegisterInput)) {
              setError(key as keyof RegisterInput, { message: msgs[0] });
            }
          }
        }
        return;
      }

      // If auto sign-in cookie was returned, go straight to dashboard
      if (res.data?.hasCookie) {
        toast.success("Account created successfully! Welcome to Project Hub.");
        router.push("/dashboard");
      } else {
        toast.success("Account created successfully! Please sign in.");
        router.push("/login");
      }
      router.refresh();
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Create student account
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Sign up to submit and track your project assignments
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
          id="name"
          label="Full Name"
          required
          error={errors.name?.message}
        >
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Alex Johnson"
              className="pl-9"
              error={!!errors.name}
              aria-invalid={!!errors.name}
              {...register("name")}
            />
          </div>
        </FormField>

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
              placeholder="alex@university.edu"
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
          helperText="Min. 8 characters with at least one letter and one number"
        >
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="pl-9"
              error={!!errors.password}
              aria-invalid={!!errors.password}
              {...register("password")}
            />
          </div>
        </FormField>

        <FormField
          id="confirmPassword"
          label="Confirm Password"
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
          <span>Create Account</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
