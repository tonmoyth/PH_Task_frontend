import { Layers, Clock, CheckCircle2, XCircle } from "lucide-react";
import { SubmissionStats } from "@/types/submission";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardsProps {
  stats: SubmissionStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const items = [
    {
      title: "Total Submissions",
      value: stats.total,
      icon: Layers,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      border: "border-indigo-100 dark:border-indigo-900/30",
    },
    {
      title: "Pending Review",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-100 dark:border-amber-900/30",
    },
    {
      title: "Approved Projects",
      value: stats.approved,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-100 dark:border-emerald-900/30",
    },
    {
      title: "Rejected Projects",
      value: stats.rejected,
      icon: XCircle,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-100 dark:border-rose-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.title}
            className={`border transition-all hover:shadow-md ${item.border}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {item.title}
                  </p>
                  <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-2">
                    {item.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <Card key={idx} className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-14" />
            </div>
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </Card>
      ))}
    </div>
  );
}
