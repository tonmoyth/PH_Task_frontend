"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";
import { reviewSubmissionAction } from "@/actions/review.actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface RejectDialogProps {
  submissionId: string;
  projectName?: string;
}

export function RejectDialog({
  submissionId,
  projectName = "this project",
}: RejectDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const handleReject = () => {
    const trimmed = reason.trim();
    if (!trimmed || trimmed.length < 10) {
      setError("Please provide a constructive rejection reason (minimum 10 characters).");
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await reviewSubmissionAction(submissionId, {
        status: "REJECTED",
        reason: trimmed,
      });

      if (!res.success) {
        toast.error(res.message);
        setOpen(false);
        router.refresh();
        return;
      }

      toast.success("Project rejected with feedback provided.");
      setOpen(false);
      setReason("");
      router.refresh();
    });
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        className="h-8 text-xs font-semibold gap-1.5"
        onClick={() => {
          setReason("");
          setError(null);
          setOpen(true);
        }}
      >
        <X className="h-3.5 w-3.5" />
        <span>Reject</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Reject Submission</DialogTitle>
          <DialogDescription>
            Specify constructive feedback explaining why &quot;{projectName}&quot; was rejected and what improvements the student needs to make.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <label htmlFor="reject-reason" className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Rejection Reason & Required Fixes <span className="text-rose-500">*</span>
          </label>
          <Textarea
            id="reject-reason"
            rows={4}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error && e.target.value.trim().length >= 10) {
                setError(null);
              }
            }}
            placeholder="e.g., The authentication flow crashes when submitting without a password, and the responsive menu doesn't open on mobile..."
            error={!!error}
          />
          <div className="flex items-center justify-between">
            {error ? (
              <p className="text-xs font-medium text-rose-500">{error}</p>
            ) : (
              <p className="text-xs text-zinc-500">Min. 10 characters</p>
            )}
            <span className="text-xs font-mono text-zinc-400">
              {reason.length} chars
            </span>
          </div>
        </div>

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
            type="button"
            variant="destructive"
            isLoading={isPending}
            disabled={isPending}
            onClick={handleReject}
          >
            Confirm Rejection
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
