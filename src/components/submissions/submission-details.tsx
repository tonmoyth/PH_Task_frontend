import Link from "next/link";
import {
  ExternalLink,
  Calendar,
  User,
  Mail,
  GitBranch,
  Globe,
  Clock,
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { Submission } from "@/types/submission";
import { Role } from "@/types/user";
import { StatusBadge } from "./status-badge";
import { ApproveButton } from "./approve-button";
import { RejectDialog } from "./reject-dialog";
import { DeleteSubmissionButton } from "./delete-submission-button";
import { ResubmitForm } from "./resubmit-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface SubmissionDetailsProps {
  submission: Submission;
  currentRole: Role;
}

export function SubmissionDetails({
  submission,
  currentRole,
}: SubmissionDetailsProps) {
  const isStudent = currentRole === "student";
  const backHref = isStudent ? "/dashboard/my-submissions" : "/dashboard/submissions";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <Link href={backHref}>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to {isStudent ? "My Submissions" : "All Submissions"}</span>
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <StatusBadge status={submission.status} />
          {/* Action buttons */}
          {submission.status === "PENDING" && (
            <>
              {isStudent ? (
                <DeleteSubmissionButton
                  submissionId={submission.id}
                  projectName={submission.projectName}
                  redirectOnSuccess={true}
                />
              ) : (
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
              )}
            </>
          )}
        </div>
      </div>

      {/* Prominent Rejection Banner if REJECTED */}
      {submission.status === "REJECTED" && (
        <div className="rounded-xl border border-rose-300 bg-rose-50/90 dark:border-rose-900/50 dark:bg-rose-950/40 p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <h3 className="font-semibold text-rose-900 dark:text-rose-200 text-sm">
                Project Rejected by Reviewer
              </h3>
              <div className="rounded-lg bg-white/70 dark:bg-zinc-900/60 p-3.5 border border-rose-200/80 dark:border-rose-900/40 text-sm text-zinc-800 dark:text-zinc-200 font-normal">
                {submission.rejectionReason || "No specific comments provided."}
              </div>
              {isStudent && (
                <p className="text-xs text-rose-700 dark:text-rose-300 pt-1">
                  Please review the feedback above, address the requested changes in your codebase, and use the resubmission form below.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Info Card */}
      <Card className="shadow-xs">
        <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div>
              <CardTitle className="text-xl sm:text-2xl">
                {submission.projectName}
              </CardTitle>
              {submission.resubmitCount > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Resubmitted revision #{submission.resubmitCount}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/40">
            {/* Student Info */}
            {submission.student && (
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Student
                </span>
                <div className="flex items-center gap-2 text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                  <User className="h-4 w-4 text-zinc-400" />
                  <span>{submission.student.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <Mail className="h-3.5 w-3.5 text-zinc-400" />
                  <span>{submission.student.email}</span>
                </div>
              </div>
            )}

            {/* Submission Date */}
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Submitted At
              </span>
              <div className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200 font-medium">
                <Calendar className="h-4 w-4 text-zinc-400" />
                <span>{formatDate(submission.createdAt)}</span>
              </div>
            </div>

            {/* Review Status */}
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Review Decision
              </span>
              <div className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200 font-medium">
                <Clock className="h-4 w-4 text-zinc-400" />
                <span>
                  {submission.reviewedAt ? formatDate(submission.reviewedAt) : "Awaiting review"}
                </span>
              </div>
              {submission.reviewedBy && (
                <span className="text-xs text-zinc-500">
                  By {submission.reviewedBy.name}
                </span>
              )}
            </div>
          </div>

          {/* Links Section */}
          <div className="flex flex-wrap gap-3 pt-2">
            {submission.repoUrl && (
              <a
                href={submission.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <GitBranch className="h-4 w-4" />
                <span>GitHub Repository</span>
                <ExternalLink className="h-3 w-3 opacity-70" />
              </a>
            )}

            {submission.liveUrl && (
              <a
                href={submission.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>View Live Deployment</span>
                <ExternalLink className="h-3 w-3 opacity-70" />
              </a>
            )}
          </div>

          {/* Project Description */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Project Description & Overview
            </h4>
            <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
              {submission.description}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit & Resubmit form for students when submission is REJECTED */}
      {isStudent && submission.status === "REJECTED" && (
        <ResubmitForm submission={submission} />
      )}
    </div>
  );
}
