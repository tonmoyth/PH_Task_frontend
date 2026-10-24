import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  GitBranch,
  ShieldCheck,
  Send,
  Sparkles,
} from "lucide-react";
import { getCurrentUser } from "@/services/auth.service";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 bg-gradient-to-b from-indigo-50/50 via-white to-zinc-50 dark:from-indigo-950/20 dark:via-zinc-950 dark:to-zinc-950 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(0,0,0,0))]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-4 py-1.5 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300 mb-8 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>Next-Generation Assignment & Code Review Hub</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 max-w-4xl mx-auto leading-tight">
            Elevate project reviews with structured feedback and real-time tracking
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            A unified platform connecting students with expert mentors. Submit GitHub projects, get thorough code assessments, and iterate rapidly until approval.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 px-8 py-6 text-base font-semibold shadow-lg shadow-indigo-600/25">
                  <span>Enter Your Dashboard</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="gap-2 px-8 py-6 text-base font-semibold shadow-lg shadow-indigo-600/25">
                    <span>Get Started as Student</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-base font-semibold">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Designed for every stakeholder
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              Tailored workflows for students submitting work, mentors delivering constructive critique, and administrators maintaining quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Pillar */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-8 bg-zinc-50/50 dark:bg-zinc-900/40 hover:shadow-lg transition-all space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <Send className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                For Students
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Submit assignments seamlessly by linking your repository and live demo. Follow evaluation stages in real time, and easily resubmit revised code if changes are requested.
              </p>
              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Public signup & instant submission</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Transparent rejection reasons & resubmissions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Pending withdrawal with full control</span>
                </li>
              </ul>
            </div>

            {/* Mentor Pillar */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-8 bg-zinc-50/50 dark:bg-zinc-900/40 hover:shadow-lg transition-all space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                <GitBranch className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                For Mentors
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Review pending queue items with server-side filters and debounced search. Inspect code repositories, test live links, and give approved or actionable rejected feedback.
              </p>
              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0" />
                  <span>Comprehensive review stats counter</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0" />
                  <span>Constructive feedback requirement</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0" />
                  <span>Complete audit log & review history</span>
                </li>
              </ul>
            </div>

            {/* Admin Pillar */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-8 bg-zinc-50/50 dark:bg-zinc-900/40 hover:shadow-lg transition-all space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                For Administrators
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Full authority across submissions and mentor teams. Onboard verified mentors, generate credentials with forced password resets, and monitor evaluation velocity.
              </p>
              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-500 shrink-0" />
                  <span>One-click mentor onboarding & email delivery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-500 shrink-0" />
                  <span>Instant mentor deactivation and password resets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-500 shrink-0" />
                  <span>System-wide submission metrics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200/60 dark:border-zinc-800/60">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Ready to streamline your project submissions?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto text-sm">
            Join hundreds of students and faculty members collaborating through Project Hub.
          </p>
          <div className="pt-2">
            <Link href={user ? "/dashboard" : "/register"}>
              <Button size="lg" className="px-8 font-semibold shadow-md shadow-indigo-600/20">
                {user ? "Go to Dashboard" : "Sign Up as Student Now"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
