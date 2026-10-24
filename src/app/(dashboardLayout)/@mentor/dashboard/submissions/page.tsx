import { Suspense } from "react";
import { requireRole } from "@/services/auth.service";
import {
  getAllSubmissionsService,
  getSubmissionStatsService,
} from "@/services/submission.service";
import { PageHeader } from "@/components/shared/page-header";
import {
  StatsCards,
  StatsCardsSkeleton,
} from "@/components/dashboard/stats-cards";
import { StatusFilterTabs } from "@/components/submissions/status-filter-tabs";
import { SearchInput } from "@/components/shared/search-input";
import { SubmissionsTable } from "@/components/submissions/submissions-table";
import { Pagination } from "@/components/shared/pagination";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/config/constants";

interface MentorSubmissionsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    status?: string;
    search?: string;
  }>;
}

async function StatsBanner() {
  const stats = await getSubmissionStatsService();
  return <StatsCards stats={stats} />;
}

export default async function MentorSubmissionsPage({
  searchParams,
}: MentorSubmissionsPageProps) {
  await requireRole("mentor");

  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || String(DEFAULT_PAGE), 10);
  const limit = parseInt(resolvedParams.limit || String(DEFAULT_PAGE_SIZE), 10);
  const status = resolvedParams.status || undefined;
  const search = resolvedParams.search || undefined;

  const res = await getAllSubmissionsService({
    page,
    limit,
    status,
    search,
  });

  const submissions = res?.data || [];
  const total = res?.total || submissions.length;
  const totalPages = res?.totalPages || Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Submissions"
        description="Filter, search, inspect code, and approve or reject submissions."
      />

      {/* Stats cards above table (unaffected by filters) */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsBanner />
      </Suspense>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        <StatusFilterTabs />
        <SearchInput placeholder="Search project or student name..." />
      </div>

      {/* Submissions Table */}
      <SubmissionsTable submissions={submissions} />

      {/* Pagination */}
      {total > 0 && (
        <Pagination
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
