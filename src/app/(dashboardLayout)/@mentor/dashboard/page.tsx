import { Suspense } from "react";
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
  return <RecentSubmissions submissions={res?.data || []} role="mentor" />;
}

export default async function MentorDashboardPage() {
  const user = await requireRole("mentor");

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Mentor Console — ${user.name}`}
        description="Monitor system submission metrics and evaluate newly assigned student projects."
      />

      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsSection />
      </Suspense>

      <Suspense fallback={<RecentSubmissionsSkeleton />}>
        <RecentPendingSection />
      </Suspense>
    </div>
  );
}
