import Link from "next/link";
import { ExternalLink, ArrowRight, Send, AlertCircle } from "lucide-react";
import { Submission } from "@/types/submission";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "./status-badge";
import { DeleteSubmissionButton } from "./delete-submission-button";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDateShort } from "@/lib/utils";

interface StudentSubmissionsListProps {
  submissions: Submission[];
}

export function StudentSubmissionsList({
  submissions,
}: StudentSubmissionsListProps) {
  if (submissions.length === 0) {
    return (
      <EmptyState
        title="No project submissions found"
        description="You haven't submitted any projects yet, or no submissions match your selected filter."
        action={
          <Link href="/dashboard/submit">
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              <span>Submit a Project</span>
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Repository</TableHead>
            <TableHead>Live Link</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((sub) => (
            <TableRow key={sub.id}>
              {/* Project Name & Rejection Alert snippet if rejected */}
              <TableCell className="font-medium max-w-[220px]">
                <div className="flex flex-col min-w-0">
                  <Link
                    href={`/dashboard/my-submissions/${sub.id}`}
                    className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate"
                  >
                    {sub.projectName}
                  </Link>
                  {sub.resubmitCount > 0 && (
                    <span className="text-[11px] text-zinc-400">
                      Resubmitted {sub.resubmitCount} time{sub.resubmitCount > 1 ? "s" : ""}
                    </span>
                  )}
                  {sub.status === "REJECTED" && sub.rejectionReason && (
                    <span className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 mt-0.5 truncate">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span className="truncate">Feedback provided</span>
                    </span>
                  )}
                </div>
              </TableCell>

              {/* GitHub */}
              <TableCell>
                {sub.repoUrl ? (
                  <a
                    href={sub.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:underline"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-zinc-400">—</span>
                )}
              </TableCell>

              {/* Live Link */}
              <TableCell>
                {sub.liveUrl ? (
                  <a
                    href={sub.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:underline"
                  >
                    <span>Live App</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-zinc-400">—</span>
                )}
              </TableCell>

              {/* Status */}
              <TableCell>
                <StatusBadge status={sub.status} />
              </TableCell>

              {/* Submitted Date */}
              <TableCell className="text-xs text-zinc-500 whitespace-nowrap">
                {formatDateShort(sub.createdAt)}
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                  {sub.status === "PENDING" && (
                    <DeleteSubmissionButton
                      submissionId={sub.id}
                      projectName={sub.projectName}
                    />
                  )}

                  <Link href={`/dashboard/my-submissions/${sub.id}`}>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                      <span>View</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
