export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
] as const;

export const STATUS_COLORS = {
  PENDING: {
    badge: "bg-amber-500/10 text-amber-500 border-amber-500/20 dark:bg-amber-400/10 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  APPROVED: {
    badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    badge: "bg-rose-500/10 text-rose-500 border-rose-500/20 dark:bg-rose-400/10 dark:text-rose-400",
    dot: "bg-rose-500",
  },
} as const;

export const SEARCH_DEBOUNCE_MS = 400;
