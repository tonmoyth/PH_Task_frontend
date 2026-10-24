"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { reviewSubmissionAction } from "@/actions/review.actions";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

interface ApproveButtonProps {
  submissionId: string;
  projectName?: string;
}

export function ApproveButton({
  submissionId,
  projectName = "this project",
}: ApproveButtonProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const res = await reviewSubmissionAction(submissionId, {
        status: "APPROVED",
      });

      if (!res.success) {
        toast.error(res.message);
        setOpen(false);
        router.refresh();
        return;
      }

      toast.success("Project approved successfully!");
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <Button
        variant="success"
        size="sm"
        className="h-8 text-xs font-semibold gap-1.5"
        onClick={() => setOpen(true)}
      >
        <Check className="h-3.5 w-3.5" />
        <span>Approve</span>
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Approve Submission"
        description={`Are you sure you want to approve "${projectName}"? This project assignment will be marked as complete.`}
        confirmLabel="Approve Project"
        variant="success"
        isLoading={isPending}
        onConfirm={handleApprove}
      />
    </>
  );
}
