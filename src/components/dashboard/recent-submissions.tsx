import Link from "next/link";
import { ArrowRight, ExternalLink, Calendar, User } from "lucide-react";
import { Submission } from "@/types/submission";
import { Role } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/submissions/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateShort } from "@/lib/utils";

interface RecentSubmissionsProps {
  submissions: Submission[];
  role: Role;
}

export function RecentSubmissions({ submissions, role }: RecentSubmissionsProps) {
  const isStudent = role === "student";
  const viewAllHref = isStudent ? "/dashboard/my-submissions" : "/dashboard/submissions";

  return (
    <Card className="shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle>
            {isStudent ? "Recent Submissions" : "Pending Reviews Requiring Attention"}
          </CardTitle>
          <CardDescription>
            {isStudent
              ? "Your latest submitted project assignments"
              : "Submissions awaiting feedback and review"}
          </CardDescription>
        </div>
        <Link href={viewAllHref}>
          <Button variant="ghost" size="sm" className="gap-1 text-xs text-indigo-600 dark:text-indigo-400">
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {submissions.length === 0 ? (
          <div className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
            {isStudent
              ? "You haven't submitted any projects yet."
              : "No pending submissions to review right now."}
          </div>
        ) : (
          <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800">
            {submissions.map((sub) => {
              const detailHref = isStudent
                ? `/dashboard/my-submissions/${sub.id}`
                : `/dashboard/submissions/${sub.id}`;

              return (
                <div
                  key={sub.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors gap-3"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                      <Link
                        href={detailHref}
                        className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate"
                      >
                        {sub.projectName}
                      </Link>
                      <StatusBadge status={sub.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {!isStudent && sub.student && (
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          <span>{sub.student.name}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDateShort(sub.createdAt)}</span>
                      </span>
                      {sub.repoUrl && (
                        <a
                          href={sub.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>GitHub</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link href={detailHref}>
                      <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                        <span>{isStudent ? "Details" : "Review"}</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function RecentSubmissionsSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center py-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-3 w-36" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </Card>
  );
}
