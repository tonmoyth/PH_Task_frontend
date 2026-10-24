import { Mentor } from "@/types/mentor";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MentorRowActions } from "./mentor-row-actions";
import { formatDateShort } from "@/lib/utils";
import { CheckCircle2, UserX } from "lucide-react";

interface MentorsTableProps {
  mentors: Mentor[];
}

export function MentorsTable({ mentors }: MentorsTableProps) {
  if (mentors.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
        No mentors found. Use the &quot;Create Mentor&quot; button to onboard a new mentor.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mentor</TableHead>
            <TableHead>Email Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reviews Performed</TableHead>
            <TableHead>Added On</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mentors.map((mentor) => (
            <TableRow key={mentor.id}>
              {/* Name & Temporary Password indicator */}
              <TableCell className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                <div className="flex flex-col">
                  <span>{mentor.name}</span>
                  {mentor.mustChangePassword && (
                    <span className="text-[11px] font-normal text-amber-600 dark:text-amber-400">
                      Pending initial password change
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Email */}
              <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                {mentor.email}
              </TableCell>

              {/* Status Active / Deactivated */}
              <TableCell>
                {mentor.isActive ? (
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Active</span>
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <UserX className="h-3 w-3" />
                    <span>Deactivated</span>
                  </Badge>
                )}
              </TableCell>

              {/* Reviews count */}
              <TableCell className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {mentor.totalReviews ?? mentor.reviewedSubmissionsCount ?? 0}
              </TableCell>

              {/* Created Date */}
              <TableCell className="text-xs text-zinc-500 whitespace-nowrap">
                {formatDateShort(mentor.createdAt)}
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right whitespace-nowrap">
                <MentorRowActions mentor={mentor} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
