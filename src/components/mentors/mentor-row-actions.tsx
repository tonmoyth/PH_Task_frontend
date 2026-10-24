"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserCheck, UserX, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Mentor } from "@/types/mentor";
import {
  toggleMentorStatusAction,
  resetMentorPasswordAction,
} from "@/actions/mentor.actions";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

interface MentorRowActionsProps {
  mentor: Mentor;
}

export function MentorRowActions({ mentor }: MentorRowActionsProps) {
  const router = useRouter();
  const [statusDialogOpen, setStatusDialogOpen] = React.useState(false);
  const [resetDialogOpen, setResetDialogOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const handleToggleStatus = () => {
    const nextStatus = !mentor.isActive;
    startTransition(async () => {
      const res = await toggleMentorStatusAction(mentor.id, nextStatus);
      if (!res.success) {
        toast.error(res.message);
        setStatusDialogOpen(false);
        return;
      }
      toast.success(res.message);
      setStatusDialogOpen(false);
      router.refresh();
    });
  };

  const handleResetPassword = () => {
    startTransition(async () => {
      const res = await resetMentorPasswordAction(mentor.id);
      if (!res.success) {
        toast.error(res.message);
        setResetDialogOpen(false);
        return;
      }
      toast.success(res.message);
      setResetDialogOpen(false);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* Toggle Active / Deactivated */}
      <Button
        variant="outline"
        size="sm"
        className={`h-8 text-xs gap-1.5 ${
          mentor.isActive
            ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 dark:border-rose-900/50"
            : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200 dark:border-emerald-900/50"
        }`}
        onClick={() => setStatusDialogOpen(true)}
      >
        {mentor.isActive ? (
          <>
            <UserX className="h-3.5 w-3.5" />
            <span>Deactivate</span>
          </>
        ) : (
          <>
            <UserCheck className="h-3.5 w-3.5" />
            <span>Activate</span>
          </>
        )}
      </Button>

      {/* Reset Password */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-xs gap-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        onClick={() => setResetDialogOpen(true)}
        title="Send new temporary password"
      >
        <KeyRound className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Reset Password</span>
      </Button>

      {/* Status Confirm Dialog */}
      <ConfirmDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        title={mentor.isActive ? "Deactivate Mentor Account" : "Activate Mentor Account"}
        description={
          mentor.isActive
            ? `Are you sure you want to deactivate ${mentor.name}? They will immediately lose access to review submissions.`
            : `Are you sure you want to re-activate ${mentor.name}? They will regain access to their mentor account.`
        }
        confirmLabel={mentor.isActive ? "Deactivate Account" : "Activate Account"}
        variant={mentor.isActive ? "destructive" : "default"}
        isLoading={isPending}
        onConfirm={handleToggleStatus}
      />

      {/* Reset Password Confirm Dialog */}
      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title="Reset Mentor Password"
        description={`Are you sure you want to generate a new temporary password for ${mentor.name}? The new password will be sent to ${mentor.email}, and any active sessions will be terminated.`}
        confirmLabel="Send Temporary Password"
        variant="default"
        isLoading={isPending}
        onConfirm={handleResetPassword}
      />
    </div>
  );
}
