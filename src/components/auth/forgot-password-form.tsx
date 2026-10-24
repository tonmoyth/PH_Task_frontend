"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import {
  forgotPasswordSchema,
  ForgotPasswordInput,
} from "@/lib/validations/auth.schema";
import { forgotPasswordAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = React.useTransition();
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    startTransition(async () => {
      await forgotPasswordAction(data);
      setIsSubmitted(true);
      toast.success("Instructions sent if account exists");
    });
  };

  if (isSubmitted) {
    return (
      <div className="w-full space-y-6 text-center">
        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Check your email
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            If an account exists for that email address, we have dispatched instructions and a reset token to your inbox.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/login">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Sign In</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Forgot your password?
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Enter your registered email and we&apos;ll send you instructions to reset it
        </p>
      </div>

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
              placeholder="user@example.com"
              className="pl-9"
              error={!!errors.email}
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </div>
        </FormField>

        <Button
          type="submit"
          className="w-full gap-2 font-semibold shadow-md shadow-indigo-600/20"
          isLoading={isPending}
          disabled={isPending}
        >
          <span>Send Reset Instructions</span>
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
