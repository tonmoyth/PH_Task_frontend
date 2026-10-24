import { redirect } from "next/navigation";
import { requireUser } from "@/services/auth.service";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout(props: {
  children: React.ReactNode;
  admin: React.ReactNode;
  mentor: React.ReactNode;
  student: React.ReactNode;
}) {
  const { admin, mentor, student } = props;
  const user = await requireUser();

  if (user.mustChangePassword) {
    redirect("/change-password");
  }

  // Render ONLY the slot that matches user.role. Never render other slots.
  let activeSlot: React.ReactNode = student;
  if (user.role === "admin") {
    activeSlot = admin;
  } else if (user.role === "mentor") {
    activeSlot = mentor;
  }

  return <DashboardShell user={user}>{activeSlot}</DashboardShell>;
}
