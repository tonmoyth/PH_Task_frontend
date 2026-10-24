import * as React from "react";
import { User } from "@/types/user";
import { Sidebar } from "./sidebar";
import { MobileSidebar } from "./mobile-sidebar";
import { UserMenu } from "./user-menu";
import { GraduationCap } from "lucide-react";

interface DashboardShellProps {
  user: User;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-zinc-50/70 dark:bg-zinc-900/60">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        <Sidebar user={user} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 px-4 sm:px-6 md:px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <MobileSidebar user={user} />
            <div className="flex items-center gap-2 md:hidden">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
                Project Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <UserMenu user={user} />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
