import { notFound } from "next/navigation";
import { requireRole } from "@/services/auth.service";
import { getMySubmissionByIdService } from "@/services/submission.service";
import { SubmissionDetails } from "@/components/submissions/submission-details";
import { Submission } from "@/types/submission";

interface StudentSubmissionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentSubmissionDetailPage({
  params,
}: StudentSubmissionDetailPageProps) {
  await requireRole("student");
  const { id } = await params;

  let submission: Submission | null = null;
  try {
    submission = await getMySubmissionByIdService(id);
  } catch {
    submission = null;
  }

  if (!submission) {
    notFound();
  }

  return <SubmissionDetails submission={submission} currentRole="student" />;
}
