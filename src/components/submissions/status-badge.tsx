import { SubmissionStatus } from "@/types/submission";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: SubmissionStatus;
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  showIcon = true,
  className,
}: StatusBadgeProps) {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="pending" className={className}>
          {showIcon && <Clock className="h-3 w-3" />}
          <span>Pending</span>
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge variant="approved" className={className}>
          {showIcon && <CheckCircle2 className="h-3 w-3" />}
          <span>Approved</span>
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="rejected" className={className}>
          {showIcon && <XCircle className="h-3 w-3" />}
          <span>Rejected</span>
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
