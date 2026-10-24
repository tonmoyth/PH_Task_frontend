"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UserPlus, User, Mail, Info, AlertCircle } from "lucide-react";
import {
  createMentorSchema,
  CreateMentorInput,
} from "@/lib/validations/mentor.schema";
import { createMentorAction } from "@/actions/mentor.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function CreateMentorDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateMentorInput>({
    resolver: zodResolver(createMentorSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = (data: CreateMentorInput) => {
    setServerError(null);
    startTransition(async () => {
      const res = await createMentorAction(data);

      if (!res.success) {
        setServerError(res.message);
        toast.error(res.message);
        if (res.fieldErrors?.email) {
          setError("email", { message: res.fieldErrors.email[0] });
        }
        return;
      }

      toast.success(res.message || "Mentor created successfully!");
      setOpen(false);
      reset();
      router.refresh();
    });
  };

  return (
    <>
      <Button
        onClick={() => {
          reset();
          setServerError(null);
          setOpen(true);
        }}
        className="gap-2 shadow-sm font-semibold"
      >
        <UserPlus className="h-4 w-4" />
        <span>Create Mentor</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Add New Mentor</DialogTitle>
          <DialogDescription>
            Register a mentor to review student submissions. Temporary login credentials will be generated and emailed directly.
          </DialogDescription>
        </DialogHeader>

        {serverError && (
          <div className="flex items-center gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3 mb-4 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{serverError}</p>
          </div>
        )}

        <div className="rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 p-3 mb-4 flex items-start gap-2.5 text-xs text-indigo-900 dark:text-indigo-300">
          <Info className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
          <p>
            The mentor will receive a secure temporary password via email and will be required to change it on their first login.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            id="mentor-name"
            label="Full Name"
            required
            error={errors.name?.message}
          >
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="mentor-name"
                placeholder="Dr. Sarah Connor"
                className="pl-9"
                error={!!errors.name}
                aria-invalid={!!errors.name}
                {...register("name")}
              />
            </div>
          </FormField>

          <FormField
            id="mentor-email"
            label="Email Address"
            required
            error={errors.email?.message}
          >
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="mentor-email"
                type="email"
                placeholder="mentor@university.edu"
                className="pl-9"
                error={!!errors.email}
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </div>
          </FormField>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isPending}
              disabled={isPending}
              className="gap-2"
            >
              <span>Create Mentor</span>
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}
