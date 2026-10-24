import Link from "next/link";
import { ExternalLink, Eye, ArrowUpRight } from "lucide-react";
import { Submission } from "@/types/submission";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "./status-badge";
import { ReviewActions } from "./review-actions";
import { formatDateShort } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SubmissionsTableProps {
  submissions: Submission[];
}

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  if (submissions.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
        No submissions match your current filters.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project & Student</TableHead>
            <TableHead>Repository</TableHead>
            <TableHead>Live Demo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((sub) => (
            <TableRow key={sub.id}>
              {/* Project & Student */}
              <TableCell className="font-medium max-w-[240px]">
                <div className="flex flex-col min-w-0">
                  <Link
                    href={`/dashboard/submissions/${sub.id}`}
                    className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate flex items-center gap-1 group"
                  >
                    <span>{sub.projectName}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {sub.student ? sub.student.name : "Unknown student"}
                    {sub.student?.email && ` (${sub.student.email})`}
                  </span>
                </div>
              </TableCell>

              {/* Repo Link */}
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
                  <ReviewActions submission={sub} />
                  <Link href={`/dashboard/submissions/${sub.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Details">
                      <Eye className="h-4 w-4 text-zinc-500" />
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
