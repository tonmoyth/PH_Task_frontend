import { z } from "zod";

const GITHUB_REPO_REGEX = /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(\/)?$/;

export const createSubmissionSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(80, "Project name cannot exceed 80 characters"),
  repoUrl: z
    .string()
    .trim()
    .min(1, "Repository URL is required")
    .regex(
      GITHUB_REPO_REGEX,
      "Repository URL must match https://github.com/{owner}/{repo}",
    ),
  liveUrl: z
    .string()
    .trim()
    .min(1, "Live link URL is required")
    .url("Must be a valid URL")
    .refine(
      (val) => val.startsWith("https://") || val.startsWith("http://"),
      "Live link must start with https:// or http://",
    ),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;

export const updateSubmissionSchema = createSubmissionSchema;
export type UpdateSubmissionInput = z.infer<typeof updateSubmissionSchema>;

export const reviewSubmissionSchema = z
  .object({
    status: z.enum(["APPROVED", "REJECTED"]),
    reason: z.string().trim().max(1000, "Reason cannot exceed 1000 characters").optional(),
  })
  .refine(
    (data) => {
      if (data.status === "REJECTED") {
        return !!data.reason && data.reason.length >= 10;
      }
      return true;
    },
    {
      message: "A rejection reason of at least 10 characters is required when rejecting",
      path: ["reason"],
    },
  );

export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionSchema>;
