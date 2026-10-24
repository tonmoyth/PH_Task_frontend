"use server";

import { revalidatePath } from "next/cache";
import { ActionResult } from "@/types/action-result";
import { Submission } from "@/types/submission";
import {
  reviewSubmissionSchema,
  ReviewSubmissionInput,
} from "@/lib/validations/submission.schema";
import { reviewSubmissionService } from "@/services/review.service";
import { ApiError } from "@/lib/api-client";

export async function reviewSubmissionAction(
  id: string,
  input: ReviewSubmissionInput,
): Promise<ActionResult<Submission>> {
  const parsed = reviewSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid review decision or reason",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await reviewSubmissionService(id, parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/submissions");
    revalidatePath(`/dashboard/submissions/${id}`);
    return {
      success: true,
      message: `Submission ${input.status === "APPROVED" ? "approved" : "rejected"} successfully`,
      data: res,
    };
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      if (err.status === 409) {
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/submissions");
        revalidatePath(`/dashboard/submissions/${id}`);
        return {
          success: false,
          message: "Already reviewed by someone else",
          status: 409,
        };
      }

      return {
        success: false,
        message: err.message,
        status: err.status,
        fieldErrors: err.fieldErrors,
      };
    }
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to review submission",
    };
  }
}
