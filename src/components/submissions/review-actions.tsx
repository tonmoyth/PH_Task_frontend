import { Submission } from "@/types/submission";
import { ApproveButton } from "./approve-button";
import { RejectDialog } from "./reject-dialog";
import { formatDateShort } from "@/lib/utils";

interface ReviewActionsProps {
  submission: Submission;
}

export function ReviewActions({ submission }: ReviewActionsProps) {
  if (submission.status === "PENDING") {
    return (
      <div className="flex items-center gap-2">
        <ApproveButton
          submissionId={submission.id}
          projectName={submission.projectName}
        />
        <RejectDialog
          submissionId={submission.id}
          projectName={submission.projectName}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col text-xs text-zinc-500 dark:text-zinc-400">
      <span className="font-medium text-zinc-700 dark:text-zinc-300">
        {submission.reviewedBy ? `By ${submission.reviewedBy.name}` : "Reviewed"}
      </span>
      {submission.reviewedAt && (
        <span className="text-[11px] text-zinc-400">
          {formatDateShort(submission.reviewedAt)}
        </span>
      )}
    </div>
  );
}
