import { Metadata } from "next";
import { requireRole } from "@/services/auth.service";
import { PageHeader } from "@/components/shared/page-header";
import { SubmissionForm } from "@/components/submissions/submission-form";

export const metadata: Metadata = {
  title: "Submit Project Assignment",
  description: "Submit your GitHub project for mentor review and evaluation",
};

export default async function SubmitProjectPage() {
  await requireRole("student");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Submit Project Assignment"
        description="Provide your repository details and live deployment link for mentor review."
      />
      <SubmissionForm />
    </div>
  );
}
