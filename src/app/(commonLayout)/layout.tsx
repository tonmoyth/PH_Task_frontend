import { getCurrentUser } from "@/services/auth.service";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default async function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <Navbar user={user} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
