import { notFound } from "next/navigation";
import { requireRole } from "@/services/auth.service";
import {
  getSubmissionByIdService,
  getSubmissionHistoryService,
} from "@/services/submission.service";
import { SubmissionDetails } from "@/components/submissions/submission-details";
import { ReviewHistory } from "@/components/submissions/review-history";
import { Submission, ReviewHistoryEntry } from "@/types/submission";

interface MentorSubmissionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MentorSubmissionDetailPage({
  params,
}: MentorSubmissionDetailPageProps) {
  await requireRole("mentor");
  const { id } = await params;

  let submission: Submission | null = null;
  let history: ReviewHistoryEntry[] = [];

  try {
    const [subData, historyData] = await Promise.all([
      getSubmissionByIdService(id),
      getSubmissionHistoryService(id),
    ]);
    submission = subData;
    history = historyData;
  } catch {
    submission = null;
  }

  if (!submission) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <SubmissionDetails submission={submission} currentRole="mentor" />
      <ReviewHistory entries={history} />
    </div>
  );
}
