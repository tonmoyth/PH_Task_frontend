import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function StudentDashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center pb-6 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Overview Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-28 mb-3" />
            <Skeleton className="h-8 w-16" />
          </Card>
        ))}
      </div>

      {/* Recent Submissions Skeleton */}
      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-48 mb-4" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center py-2">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-60" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </Card>
    </div>
  );
}
