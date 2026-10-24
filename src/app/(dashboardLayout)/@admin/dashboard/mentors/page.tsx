import { requireRole } from "@/services/auth.service";
import { getMentorsService } from "@/services/mentor.service";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { CreateMentorDialog } from "@/components/mentors/create-mentor-dialog";
import { MentorsTable } from "@/components/mentors/mentors-table";
import { Pagination } from "@/components/shared/pagination";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/config/constants";

interface AdminMentorsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
  }>;
}

export default async function AdminMentorsPage({
  searchParams,
}: AdminMentorsPageProps) {
  await requireRole("admin");

  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || String(DEFAULT_PAGE), 10);
  const limit = parseInt(resolvedParams.limit || String(DEFAULT_PAGE_SIZE), 10);
  const search = resolvedParams.search || undefined;

  const res = await getMentorsService({
    page,
    limit,
    search,
  });

  const mentors = res?.data || [];
  const total = res?.total || mentors.length;
  const totalPages = res?.totalPages || Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mentor Management"
        description="Onboard new faculty mentors, manage account access, and reset temporary credentials."
      >
        <CreateMentorDialog />
      </PageHeader>

      {/* Search Input */}
      <div className="flex items-center justify-between pb-2">
        <SearchInput placeholder="Search mentor by name or email..." />
      </div>

      {/* Mentors Table */}
      <MentorsTable mentors={mentors} />

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
