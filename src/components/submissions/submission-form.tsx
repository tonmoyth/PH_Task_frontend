"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { GitBranch, Globe, FolderGit2, Send, AlertCircle } from "lucide-react";
import {
  createSubmissionSchema,
  CreateSubmissionInput,
} from "@/lib/validations/submission.schema";
import { createSubmissionAction } from "@/actions/submission.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/shared/form-field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function SubmissionForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [descLength, setDescLength] = React.useState(0);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateSubmissionInput>({
    resolver: zodResolver(createSubmissionSchema),
    defaultValues: {
      projectName: "",
      repoUrl: "",
      liveUrl: "",
      description: "",
    },
  });

  const onSubmit = (data: CreateSubmissionInput) => {
    setServerError(null);
    startTransition(async () => {
      const res = await createSubmissionAction(data);

      if (!res.success) {
        if (res.status === 429) {
          const waitMsg = res.retryAfter
            ? `Rate limit exceeded. Please wait ${res.retryAfter}s before submitting again.`
            : "Rate limit exceeded. Maximum 5 submissions per hour.";
          setServerError(waitMsg);
          toast.error(waitMsg);
        } else if (res.status === 409) {
          setError("repoUrl", {
            message: "This repository has already been submitted",
          });
          toast.error("This repository has already been submitted");
        } else {
          setServerError(res.message);
          toast.error(res.message);
        }

        if (res.fieldErrors) {
          const allowedFields: Array<keyof CreateSubmissionInput> = [
            "projectName",
            "repoUrl",
            "liveUrl",
            "description",
          ];
          for (const [key, msgs] of Object.entries(res.fieldErrors)) {
            if (msgs?.[0] && allowedFields.includes(key as keyof CreateSubmissionInput)) {
              setError(key as keyof CreateSubmissionInput, { message: msgs[0] });
            }
          }
        }
        return;
      }

      toast.success("Project submitted successfully for mentor review!");
      router.push("/dashboard/my-submissions");
      router.refresh();
    });
  };

  const descRegister = register("description");

  return (
    <Card className="max-w-2xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle>Submit Project Assignment</CardTitle>
        <CardDescription>
          Provide your project details, GitHub repository, and live deployment link for review.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {serverError && (
          <div className="flex items-center gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3.5 mb-6 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <FormField
            id="projectName"
            label="Project Name"
            required
            error={errors.projectName?.message}
            helperText="Between 3 and 80 characters"
          >
            <div className="relative">
              <FolderGit2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="projectName"
                placeholder="E-Commerce Microservices Platform"
                className="pl-9"
                error={!!errors.projectName}
                aria-invalid={!!errors.projectName}
                {...register("projectName")}
              />
            </div>
          </FormField>

          <FormField
            id="repoUrl"
            label="GitHub Repository URL"
            required
            error={errors.repoUrl?.message}
            helperText="Format: https://github.com/owner/repository"
          >
            <div className="relative">
              <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="repoUrl"
                type="url"
                placeholder="https://github.com/username/project-repo"
                className="pl-9"
                error={!!errors.repoUrl}
                aria-invalid={!!errors.repoUrl}
                {...register("repoUrl")}
              />
            </div>
          </FormField>

          <FormField
            id="liveUrl"
            label="Live Deployment Link"
            required
            error={errors.liveUrl?.message}
            helperText="Working live URL (e.g. Vercel, Netlify, or custom domain)"
          >
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="liveUrl"
                type="url"
                placeholder="https://my-project.vercel.app"
                className="pl-9"
                error={!!errors.liveUrl}
                aria-invalid={!!errors.liveUrl}
                {...register("liveUrl")}
              />
            </div>
          </FormField>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="description" className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                Description & Technical Overview <span className="text-rose-500">*</span>
              </label>
              <span
                className={`text-xs font-mono ${
                  descLength > 1000 || (descLength > 0 && descLength < 20)
                    ? "text-rose-500 font-semibold"
                    : "text-zinc-400"
                }`}
              >
                {descLength} / 1000 chars
              </span>
            </div>
            <div className="relative">
              <Textarea
                id="description"
                rows={4}
                placeholder="Briefly describe architecture, tech stack used, key features implemented, and any special instructions for testing..."
                error={!!errors.description}
                aria-invalid={!!errors.description}
                {...descRegister}
                onChange={(e) => {
                  descRegister.onChange(e);
                  setDescLength(e.target.value.length);
                }}
              />
            </div>
            {errors.description ? (
              <p className="text-xs font-medium text-rose-500">
                {errors.description.message}
              </p>
            ) : (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Minimum 20 characters, maximum 1000 characters
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full gap-2 shadow-md shadow-indigo-600/20"
              isLoading={isPending}
              disabled={isPending}
            >
              <Send className="h-4 w-4" />
              <span>Submit Project Assignment</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
