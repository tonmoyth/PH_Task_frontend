"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { STATUS_OPTIONS } from "@/config/constants";
import { cn } from "@/lib/utils";

interface StatusFilterTabsProps {
  className?: string;
}

export function StatusFilterTabs({ className }: StatusFilterTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "";

  const handleSelect = (statusVal: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (statusVal) {
      params.set("status", statusVal);
    } else {
      params.delete("status");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      className={cn(
        "inline-flex h-9 items-center rounded-lg bg-zinc-100 p-1 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 text-xs font-medium",
        className,
      )}
    >
      {STATUS_OPTIONS.map((opt) => {
        const isSelected = currentStatus === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleSelect(opt.value)}
            className={cn(
              "rounded-md px-3 py-1 transition-all font-semibold cursor-pointer select-none",
              isSelected
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100"
                : "hover:text-zinc-900 dark:hover:text-zinc-200",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
