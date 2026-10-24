import { ReviewHistoryEntry } from "@/types/submission";
import { StatusBadge } from "./status-badge";
import { formatDate } from "@/lib/utils";
import { History, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ReviewHistoryProps {
  entries: ReviewHistoryEntry[];
}

export function ReviewHistory({ entries }: ReviewHistoryProps) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-zinc-500" />
          <CardTitle className="text-base font-semibold">
            Review History & Audit Trail
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
          {entries.map((entry, index) => (
            <div key={entry.id || index} className="relative group">
              {/* Dot */}
              <div
                className={`absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-zinc-900 ${
                  entry.status === "APPROVED"
                    ? "bg-emerald-500"
                    : entry.status === "REJECTED"
                    ? "bg-rose-500"
                    : "bg-amber-500"
                }`}
              />

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={entry.status} />
                  <span className="text-xs text-zinc-400">
                    {formatDate(entry.createdAt)}
                  </span>
                  {entry.reviewer && (
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{entry.reviewer.name}</span>
                    </span>
                  )}
                </div>

                {entry.reason && (
                  <div className="mt-2 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 text-xs text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60 leading-relaxed">
                    {entry.reason}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
