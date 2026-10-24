"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, KeyRound, ChevronDown } from "lucide-react";
import { User as UserType } from "@/types/user";
import { getInitials } from "@/lib/utils";
import { logoutAction } from "@/actions/auth.actions";
import { toast } from "sonner";

interface UserMenuProps {
  user: UserType;
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    startTransition(async () => {
      const res = await logoutAction();
      if (res.success) {
        toast.success("Logged out successfully");
        router.push("/login");
        router.refresh();
      }
    });
  };

  const roleColors: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    mentor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    student: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-semibold text-xs shadow-sm shadow-indigo-500/20">
          {getInitials(user.name)}
        </div>
        <div className="hidden md:flex flex-col text-left">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
            {user.name}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
            {user.role}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-zinc-400 hidden md:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* User info header */}
          <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/80 mb-1">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {user.name}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mb-1.5">
              {user.email}
            </p>
            <span
              className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border tracking-wider ${
                roleColors[user.role] || roleColors.student
              }`}
            >
              {user.role}
            </span>
          </div>

          <div className="py-1 space-y-0.5">
            <Link
              href="/change-password"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <KeyRound className="h-4 w-4 text-zinc-400" />
              <span>Change Password</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              <span>{isPending ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
