"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { GitBranch, Globe, FolderGit2, RefreshCw, AlertCircle } from "lucide-react";
import { Submission } from "@/types/submission";
import {
  updateSubmissionSchema,
  UpdateSubmissionInput,
} from "@/lib/validations/submission.schema";
import { updateAndResubmitAction } from "@/actions/submission.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/shared/form-field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ResubmitFormProps {
  submission: Submission;
}

export function ResubmitForm({ submission }: ResubmitFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [descLength, setDescLength] = React.useState(submission.description?.length || 0);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UpdateSubmissionInput>({
    resolver: zodResolver(updateSubmissionSchema),
    defaultValues: {
      projectName: submission.projectName,
      repoUrl: submission.repoUrl,
      liveUrl: submission.liveUrl,
      description: submission.description,
    },
  });

  const onSubmit = (data: UpdateSubmissionInput) => {
    setServerError(null);
    startTransition(async () => {
      const res = await updateAndResubmitAction(submission.id, data);

      if (!res.success) {
        setServerError(res.message);
        toast.error(res.message);
        if (res.fieldErrors) {
          const allowedFields: Array<keyof UpdateSubmissionInput> = [
            "projectName",
            "repoUrl",
            "liveUrl",
            "description",
          ];
          for (const [key, msgs] of Object.entries(res.fieldErrors)) {
            if (msgs?.[0] && allowedFields.includes(key as keyof UpdateSubmissionInput)) {
              setError(key as keyof UpdateSubmissionInput, { message: msgs[0] });
            }
          }
        }
        return;
      }

      toast.success("Project updated and resubmitted successfully! Status reset to Pending.");
      router.refresh();
    });
  };

  const descRegister = register("description");

  return (
    <Card className="border-amber-200/80 dark:border-amber-900/40 shadow-xs">
      <CardHeader>
        <CardTitle className="text-lg">Edit and Resubmit Project</CardTitle>
        <CardDescription>
          Make required revisions based on mentor feedback and submit for re-evaluation. Status will return to Pending.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {serverError && (
          <div className="flex items-center gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3 mb-6 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            id="projectName"
            label="Project Name"
            required
            error={errors.projectName?.message}
          >
            <div className="relative">
              <FolderGit2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="projectName"
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
          >
            <div className="relative">
              <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="repoUrl"
                type="url"
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
          >
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="liveUrl"
                type="url"
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
                Description & Revision Notes <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-mono text-zinc-400">
                {descLength} / 1000 chars
              </span>
            </div>
            <Textarea
              id="description"
              rows={4}
              error={!!errors.description}
              aria-invalid={!!errors.description}
              {...descRegister}
              onChange={(e) => {
                descRegister.onChange(e);
                setDescLength(e.target.value.length);
              }}
            />
            {errors.description && (
              <p className="text-xs font-medium text-rose-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="gap-2 font-semibold shadow-sm"
              isLoading={isPending}
              disabled={isPending}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Resubmit Project</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
