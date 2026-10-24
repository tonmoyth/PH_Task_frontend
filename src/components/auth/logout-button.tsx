"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { logoutAction } from "@/actions/auth.actions";
import { Button, ButtonProps } from "@/components/ui/button";

export function LogoutButton({
  children,
  variant = "ghost",
  size = "sm",
  ...props
}: ButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
      toast.success("Signed out");
      router.push("/login");
      router.refresh();
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      isLoading={isPending}
      disabled={isPending}
      onClick={handleLogout}
      {...props}
    >
      {!children && <LogOut className="h-4 w-4 mr-2" />}
      {children || "Sign Out"}
    </Button>
  );
}
