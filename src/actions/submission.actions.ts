"use server";

import { revalidatePath } from "next/cache";
import { ActionResult } from "@/types/action-result";
import { Submission } from "@/types/submission";
import {
  createSubmissionSchema,
  updateSubmissionSchema,
  CreateSubmissionInput,
  UpdateSubmissionInput,
} from "@/lib/validations/submission.schema";
import {
  createSubmissionService,
  updateAndResubmitService,
  withdrawSubmissionService,
} from "@/services/submission.service";
import { ApiError } from "@/lib/api-client";

export async function createSubmissionAction(
  input: CreateSubmissionInput,
): Promise<ActionResult<Submission>> {
  const parsed = createSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the validation errors",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const submission = await createSubmissionService(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/my-submissions");
    return {
      success: true,
      message: "Project submitted successfully!",
      data: submission,
    };
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      // On 409 set an error on the Repo URL field
      if (err.status === 409) {
        return {
          success: false,
          message: "This repository has already been submitted",
          status: 409,
          fieldErrors: {
            repoUrl: ["This repository has already been submitted"],
          },
        };
      }

      return {
        success: false,
        message: err.message,
        status: err.status,
        fieldErrors: err.fieldErrors,
        retryAfter: err.retryAfter,
      };
    }
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to create submission",
    };
  }
}

export async function updateAndResubmitAction(
  id: string,
  input: UpdateSubmissionInput,
): Promise<ActionResult<Submission>> {
  const parsed = updateSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the validation errors",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const submission = await updateAndResubmitService(id, parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/my-submissions");
    revalidatePath(`/dashboard/my-submissions/${id}`);
    return {
      success: true,
      message: "Project updated and resubmitted successfully!",
      data: submission,
    };
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      if (err.status === 409) {
        return {
          success: false,
          message: "This repository has already been submitted",
          status: 409,
          fieldErrors: {
            repoUrl: ["This repository has already been submitted"],
          },
        };
      }
      return {
        success: false,
        message: err.message,
        status: err.status,
        fieldErrors: err.fieldErrors,
        retryAfter: err.retryAfter,
      };
    }
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to update submission",
    };
  }
}

export async function withdrawSubmissionAction(id: string): Promise<ActionResult> {
  try {
    await withdrawSubmissionService(id);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/my-submissions");
    return {
      success: true,
      message: "Submission withdrawn successfully",
    };
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return {
        success: false,
        message: err.message,
        status: err.status,
      };
    }
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to withdraw submission",
    };
  }
}
