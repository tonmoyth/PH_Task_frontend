"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ActionResult } from "@/types/action-result";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from "@/lib/validations/auth.schema";
import {
  loginService,
  signUpService,
  signOutService,
  requestPasswordResetService,
  resetPasswordService,
  changePasswordService,
} from "@/services/auth.service";
import { forwardResponseCookies } from "@/lib/cookies";
import { ApiError } from "@/lib/api-client";

export async function loginAction(
  input: LoginInput,
): Promise<ActionResult<{ mustChangePassword?: boolean }>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid credentials format",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await loginService(parsed.data);
    await forwardResponseCookies(res.rawResponse);

    const mustChange = Boolean(
      res.data?.mustChangePassword || res.data?.user?.mustChangePassword,
    );

    revalidatePath("/dashboard", "layout");
    return {
      success: true,
      message: "Logged in successfully",
      data: { mustChangePassword: mustChange },
    };
  } catch (err: unknown) {
    if (err instanceof ApiError) {
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
      message: err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}

export async function registerAction(
  input: RegisterInput,
): Promise<ActionResult<{ hasCookie: boolean }>> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await signUpService({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    });

    const cookieStore = await cookies();
    const beforeCount = cookieStore.getAll().length;
    await forwardResponseCookies(res.rawResponse);
    const afterCount = (await cookies()).getAll().length;

    revalidatePath("/dashboard", "layout");
    return {
      success: true,
      message: "Account created successfully",
      data: { hasCookie: afterCount > beforeCount || Boolean(res.rawResponse.headers.get("set-cookie")) },
    };
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return {
        success: false,
        message: err.message,
        status: err.status,
        fieldErrors: err.fieldErrors,
      };
    }
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to create account",
    };
  }
}

export async function logoutAction(): Promise<ActionResult> {
  try {
    const res = await signOutService();
    if (res?.rawResponse) {
      await forwardResponseCookies(res.rawResponse);
    }
    const cookieStore = await cookies();
    cookieStore.delete("better-auth.session_token");
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    revalidatePath("/", "layout");
    return {
      success: true,
      message: "Signed out successfully",
    };
  } catch {
    const cookieStore = await cookies();
    cookieStore.delete("better-auth.session_token");
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return {
      success: true,
      message: "Signed out",
    };
  }
}

export async function forgotPasswordAction(
  input: ForgotPasswordInput,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid email",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await requestPasswordResetService(parsed.data.email);
    return {
      success: true,
      message: "If that email exists in our system, we have sent instructions to reset your password.",
    };
  } catch {
    // Always succeed generically
    return {
      success: true,
      message: "If that email exists in our system, we have sent instructions to reset your password.",
    };
  }
}

export async function resetPasswordAction(
  input: ResetPasswordInput,
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await resetPasswordService({
      token: parsed.data.token,
      newPassword: parsed.data.newPassword,
    });
    return {
      success: true,
      message: "Password reset successfully. You can now log in.",
    };
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return {
        success: false,
        message: err.message,
        status: err.status,
        fieldErrors: err.fieldErrors,
      };
    }
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to reset password",
    };
  }
}

export async function changePasswordAction(
  input: ChangePasswordInput,
): Promise<ActionResult> {
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await changePasswordService({
      currentPassword: parsed.data.currentPassword,
      newPassword: parsed.data.newPassword,
    });
    await forwardResponseCookies(res.rawResponse);

    revalidatePath("/dashboard", "layout");
    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return {
        success: false,
        message: err.message,
        status: err.status,
        fieldErrors: err.fieldErrors,
      };
    }
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to change password",
    };
  }
}
