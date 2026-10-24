import Link from "next/link";
import { Plus } from "lucide-react";
import { requireRole } from "@/services/auth.service";
import { getMySubmissionsService } from "@/services/submission.service";
import { PageHeader } from "@/components/shared/page-header";
import { StatusFilterTabs } from "@/components/submissions/status-filter-tabs";
import { StudentSubmissionsList } from "@/components/submissions/student-submissions-list";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/config/constants";

interface MySubmissionsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    status?: string;
  }>;
}

export default async function MySubmissionsPage({
  searchParams,
}: MySubmissionsPageProps) {
  await requireRole("student");

  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || String(DEFAULT_PAGE), 10);
  const limit = parseInt(resolvedParams.limit || String(DEFAULT_PAGE_SIZE), 10);
  const status = resolvedParams.status || undefined;

  const res = await getMySubmissionsService({
    page,
    limit,
    status,
  });

  const submissions = res?.data || [];
  const total = res?.total || submissions.length;
  const totalPages = res?.totalPages || Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Submissions"
        description="View status, review decisions, and resubmit projects requiring revisions."
      >
        <Link href="/dashboard/submit">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Submit New Project</span>
          </Button>
        </Link>
      </PageHeader>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between pb-2">
        <StatusFilterTabs />
      </div>

      {/* Table / List */}
      <StudentSubmissionsList submissions={submissions} />

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
