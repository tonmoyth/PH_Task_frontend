"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  ListChecks,
  Send,
  Users,
  KeyRound,
  GraduationCap,
} from "lucide-react";
import { User } from "@/types/user";
import { NAVIGATION_CONFIG, NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: User;
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ user, className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const navItems = NAVIGATION_CONFIG[user.role] || [];

  const getIcon = (iconName: NavItem["iconName"]) => {
    switch (iconName) {
      case "LayoutDashboard":
        return <LayoutDashboard className="h-5 w-5" />;
      case "FolderGit2":
        return <FolderGit2 className="h-5 w-5" />;
      case "ListChecks":
        return <ListChecks className="h-5 w-5" />;
      case "Send":
        return <Send className="h-5 w-5" />;
      case "Users":
        return <Users className="h-5 w-5" />;
      case "KeyRound":
        return <KeyRound className="h-5 w-5" />;
      default:
        return <LayoutDashboard className="h-5 w-5" />;
    }
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-zinc-200/80 dark:border-zinc-800/80 w-64 select-none",
        className,
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-zinc-900 dark:text-zinc-50 tracking-tight text-sm">
            Project Hub
          </span>
          <span className="text-[11px] text-zinc-400 capitalize font-medium">
            {user.role} workspace
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Main Menu
        </p>
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-semibold shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/60",
              )}
            >
              <span
                className={cn(
                  "transition-colors",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300",
                )}
              >
                {getIcon(item.iconName)}
              </span>
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Account overview */}
      <div className="p-4 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400 font-bold text-xs">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
              {user.name}
            </span>
            <span className="text-[11px] text-zinc-400 truncate">
              {user.email}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
