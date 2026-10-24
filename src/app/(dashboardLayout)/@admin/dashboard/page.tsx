import { Suspense } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { requireRole } from "@/services/auth.service";
import {
  getSubmissionStatsService,
  getAllSubmissionsService,
} from "@/services/submission.service";
import { PageHeader } from "@/components/shared/page-header";
import {
  StatsCards,
  StatsCardsSkeleton,
} from "@/components/dashboard/stats-cards";
import {
  RecentSubmissions,
  RecentSubmissionsSkeleton,
} from "@/components/dashboard/recent-submissions";
import { CreateMentorDialog } from "@/components/mentors/create-mentor-dialog";
import { Button } from "@/components/ui/button";

async function StatsSection() {
  const stats = await getSubmissionStatsService();
  return <StatsCards stats={stats} />;
}

async function RecentPendingSection() {
  const res = await getAllSubmissionsService({
    status: "PENDING",
    page: 1,
    limit: 5,
  });
  return <RecentSubmissions submissions={res?.data || []} role="admin" />;
}

export default async function AdminDashboardPage() {
  const user = await requireRole("admin");

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Admin Overview — ${user.name}`}
        description="Monitor system submission throughput, audit reviews, and manage faculty mentors."
      >
        <div className="flex items-center gap-2.5">
          <Link href="/dashboard/mentors">
            <Button variant="outline" size="sm" className="gap-2">
              <Users className="h-4 w-4" />
              <span>Manage Mentors</span>
            </Button>
          </Link>
          <CreateMentorDialog />
        </div>
      </PageHeader>

      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsSection />
      </Suspense>

      <Suspense fallback={<RecentSubmissionsSkeleton />}>
        <RecentPendingSection />
      </Suspense>
    </div>
  );
}
