"use server";

import { revalidatePath } from "next/cache";
import { ActionResult } from "@/types/action-result";
import { Mentor } from "@/types/mentor";
import {
  createMentorSchema,
  CreateMentorInput,
} from "@/lib/validations/mentor.schema";
import {
  createMentorService,
  updateMentorStatusService,
  resetMentorPasswordService,
} from "@/services/mentor.service";
import { ApiError } from "@/lib/api-client";

export async function createMentorAction(
  input: CreateMentorInput,
): Promise<ActionResult<Mentor>> {
  const parsed = createMentorSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid mentor details",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const mentor = await createMentorService(parsed.data);
    revalidatePath("/dashboard/mentors");
    return {
      success: true,
      message: "Mentor created successfully. Temporary credentials have been emailed.",
      data: mentor,
    };
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      if (err.status === 409) {
        return {
          success: false,
          message: "A user with this email address already exists.",
          status: 409,
          fieldErrors: {
            email: ["Email already in use"],
          },
        };
      }
      if (err.status === 502 || err.status === 500) {
        return {
          success: false,
          message:
            err.message ||
            "Unable to send credentials email. Account creation was rolled back.",
          status: err.status,
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
      message: err instanceof Error ? err.message : "Failed to create mentor",
    };
  }
}

export async function toggleMentorStatusAction(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  try {
    await updateMentorStatusService(id, isActive);
    revalidatePath("/dashboard/mentors");
    return {
      success: true,
      message: isActive ? "Mentor activated successfully" : "Mentor deactivated successfully",
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
      message: err instanceof Error ? err.message : "Failed to update mentor status",
    };
  }
}

export async function resetMentorPasswordAction(id: string): Promise<ActionResult> {
  try {
    await resetMentorPasswordService(id);
    revalidatePath("/dashboard/mentors");
    return {
      success: true,
      message: "A new temporary password has been sent to the mentor's email address.",
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
      message: err instanceof Error ? err.message : "Failed to reset mentor password",
    };
  }
}
