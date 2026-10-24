import { StatsCardsSkeleton } from "@/components/dashboard/stats-cards";
import { RecentSubmissionsSkeleton } from "@/components/dashboard/recent-submissions";

export default function MentorDashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <StatsCardsSkeleton />
      <RecentSubmissionsSkeleton />
    </div>
  );
}
