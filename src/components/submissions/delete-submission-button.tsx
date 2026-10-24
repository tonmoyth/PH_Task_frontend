"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { withdrawSubmissionAction } from "@/actions/submission.actions";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

interface DeleteSubmissionButtonProps {
  submissionId: string;
  projectName?: string;
  redirectOnSuccess?: boolean;
}

export function DeleteSubmissionButton({
  submissionId,
  projectName = "this submission",
  redirectOnSuccess = false,
}: DeleteSubmissionButtonProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const handleWithdraw = () => {
    startTransition(async () => {
      const res = await withdrawSubmissionAction(submissionId);
      if (!res.success) {
        toast.error(res.message);
        setOpen(false);
        return;
      }

      toast.success("Submission withdrawn successfully");
      setOpen(false);

      if (redirectOnSuccess) {
        router.push("/dashboard/my-submissions");
      }
      router.refresh();
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 dark:border-rose-900/50 dark:hover:bg-rose-950/40 gap-1.5 h-8 text-xs cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span>Withdraw</span>
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Withdraw Submission"
        description={`Are you sure you want to withdraw "${projectName}"? This action will cancel and remove your pending submission.`}
        confirmLabel="Withdraw Submission"
        variant="destructive"
        isLoading={isPending}
        onConfirm={handleWithdraw}
      />
    </>
  );
}
