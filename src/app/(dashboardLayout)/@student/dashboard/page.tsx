import Link from "next/link";
import { Plus, CheckCircle2, Clock, XCircle } from "lucide-react";
import { requireRole } from "@/services/auth.service";
import { getMySubmissionsService } from "@/services/submission.service";
import { PageHeader } from "@/components/shared/page-header";
import { RecentSubmissions } from "@/components/dashboard/recent-submissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function StudentDashboardPage() {
  const user = await requireRole("student");
  const res = await getMySubmissionsService({ page: 1, limit: 5 });
  const recentSubmissions = res?.data || [];

  // Summary counts from student's fetched list
  const pendingCount = recentSubmissions.filter((s) => s.status === "PENDING").length;
  const approvedCount = recentSubmissions.filter((s) => s.status === "APPROVED").length;
  const rejectedCount = recentSubmissions.filter((s) => s.status === "REJECTED").length;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user.name}`}
        description="Track your project assignments, inspect mentor feedback, and submit new repositories."
      >
        <Link href="/dashboard/submit">
          <Button className="gap-2 font-semibold shadow-md shadow-indigo-600/20">
            <Plus className="h-4 w-4" />
            <span>Submit a project</span>
          </Button>
        </Link>
      </PageHeader>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                Pending Review
              </p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                {pendingCount}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                Approved
              </p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                {approvedCount}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                Needs Revision
              </p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                {rejectedCount}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
              <XCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions */}
      <RecentSubmissions submissions={recentSubmissions} role="student" />
    </div>
  );
}
