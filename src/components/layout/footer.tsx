import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200/80 bg-white py-12 dark:border-zinc-800/80 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
            Project Hub
          </span>
          <span className="text-xs text-zinc-400">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center sm:text-right">
          Empowering students and mentors with rigorous project reviews and feedback.
        </p>
      </div>
    </footer>
  );
}
