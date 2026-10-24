import { Role } from "@/types/user";

export interface NavItem {
  title: string;
  href: string;
  iconName: "LayoutDashboard" | "FolderGit2" | "ListChecks" | "Send" | "Users" | "KeyRound";
  badge?: string;
}

export const NAVIGATION_CONFIG: Record<Role, NavItem[]> = {
  student: [
    {
      title: "Dashboard",
      href: "/dashboard",
      iconName: "LayoutDashboard",
    },
    {
      title: "Submit Project",
      href: "/dashboard/submit",
      iconName: "Send",
    },
    {
      title: "My Submissions",
      href: "/dashboard/my-submissions",
      iconName: "ListChecks",
    },
  ],
  mentor: [
    {
      title: "Dashboard",
      href: "/dashboard",
      iconName: "LayoutDashboard",
    },
    {
      title: "Submissions",
      href: "/dashboard/submissions",
      iconName: "FolderGit2",
    },
  ],
  admin: [
    {
      title: "Dashboard",
      href: "/dashboard",
      iconName: "LayoutDashboard",
    },
    {
      title: "Submissions",
      href: "/dashboard/submissions",
      iconName: "FolderGit2",
    },
    {
      title: "Mentors",
      href: "/dashboard/mentors",
      iconName: "Users",
    },
  ],
};
