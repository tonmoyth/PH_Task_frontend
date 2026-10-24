# Project Submission & Review System — Frontend

A high-performance Next.js 16 (App Router) frontend for the **Project Submission & Review System**, providing tailored, role-based workflows for **Students**, **Mentors**, and **Administrators**.

---

## 1. Tech Stack

- **Framework**: Next.js 16 (App Router, Strict TypeScript, Turbopack)
- **Styling**: Tailwind CSS v4
- **Forms & Validation**: `react-hook-form`, `zod`, `@hookform/resolvers`
- **Feedback & Notifications**: `sonner` (rich toasts)
- **Icons**: `lucide-react`
- **Data Architecture**: Native `fetch` with server-side service layer & Server Actions (no Redux, no React Query, no Axios)

---

## 2. Environment Variables

Create `.env.local` in the project root:

```env
API_URL=http://localhost:5000
APP_URL=http://localhost:3000
```

> **Security Note**: Never prefix `API_URL` with `NEXT_PUBLIC_`. All backend calls are made server-to-server.

---

## 3. Getting Started

1. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Production build**:
   ```bash
   npm run build
   npm run start
   ```

---

## 4. Auth & Cookie Flow

The system leverages cookie-based session authentication with Better Auth and JWT tokens:

1. **Client Action Calls Server Action**: User submits login, registration, or password change credentials.
2. **Server Action Calls Service (`services/auth.service.ts`)**: Server-to-server HTTP request is executed against `${API_URL}` with `Origin: ${APP_URL}` and credentials.
3. **Cookie Forwarding (`lib/cookies.ts`)**:
   - The backend issues `Set-Cookie` headers containing `better-auth.session_token`, `accessToken`, and `refreshToken`.
   - `forwardResponseCookies` intercepts these headers, ignores any backend `Domain` attribute so cookies remain host-only on the frontend domain, and applies them to Next.js `cookies()`.
4. **Optimistic Routing (`proxy.ts`)**:
   - Next.js 16 `proxy.ts` performs optimistic routing: unauthenticated requests to `/dashboard` are redirected to `/login`, and authenticated users visiting `/login` or `/register` are redirected to `/dashboard`.
5. **Layout Authorization (`app/(dashboardLayout)/layout.tsx`)**:
   - Authenticated session is retrieved via cached `getCurrentUser()`.
   - If `mustChangePassword === true`, user is forced to `/change-password` before accessing any dashboard features.
   - Parallel route slots (`@student`, `@mentor`, `@admin`) render exclusively based on `user.role`.

---

## 5. Folder Structure

```
src/
├─ app/
│  ├─ layout.tsx                      # Root layout: Inter font, Sonner Toaster, globals
│  ├─ globals.css                     # Tailwind v4 styles
│  ├─ error.tsx                       # Global error boundary (client)
│  ├─ not-found.tsx                   # 404 handler (server)
│  ├─ (commonLayout)/
│  │  ├─ layout.tsx                   # Public Navbar + Footer
│  │  ├─ page.tsx                     # Landing page with dynamic CTA
│  │  └─ (auth)/
│  │     ├─ layout.tsx                # Centered auth card layout
│  │     ├─ login/page.tsx
│  │     ├─ register/page.tsx
│  │     ├─ forgot-password/page.tsx
│  │     ├─ reset-password/page.tsx
│  │     └─ change-password/page.tsx  # Forced & voluntary password change
│  ├─ (dashboardLayout)/
│  │  ├─ layout.tsx                   # Parallel-route dispatcher by role
│  │  ├─ default.tsx                  # Returns null
│  │  ├─ @admin/                      # Admin slot (/dashboard, /submissions, /mentors)
│  │  ├─ @mentor/                     # Mentor slot (/dashboard, /submissions)
│  │  └─ @student/                    # Student slot (/dashboard, /submit, /my-submissions)
├─ components/
│  ├─ ui/                             # Button, Input, Textarea, Label, Badge, Card, Table, Dialog, Select, Skeleton, Spinner, Tabs
│  ├─ shared/                         # PageHeader, EmptyState, Pagination, SearchInput, ConfirmDialog, FormField
│  ├─ layout/                         # Navbar, Footer, Sidebar, MobileSidebar, DashboardShell, UserMenu
│  ├─ auth/                           # LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm, ChangePasswordForm, LogoutButton
│  ├─ dashboard/                      # StatsCards, RecentSubmissions
│  ├─ submissions/                    # SubmissionForm, ResubmitForm, SubmissionsTable, StudentSubmissionsList, StatusBadge, StatusFilterTabs, ReviewActions, ApproveButton, RejectDialog, DeleteSubmissionButton, SubmissionDetails, ReviewHistory
│  └─ mentors/                        # MentorsTable, CreateMentorDialog, MentorRowActions
├─ actions/                           # auth.actions.ts, submission.actions.ts, review.actions.ts, mentor.actions.ts
├─ services/                          # auth.service.ts, submission.service.ts, review.service.ts, mentor.service.ts
├─ lib/
│  ├─ api-client.ts                   # Centralized server-only apiFetch with route & envelope adaptation
│  ├─ cookies.ts                      # Set-Cookie forwarding & domain stripping
│  ├─ utils.ts                        # cn(), formatDate(), getInitials()
│  └─ validations/                    # Zod schemas: auth, submission, mentor
├─ config/                            # navigation.ts, constants.ts
├─ types/                             # api.ts, user.ts, submission.ts, mentor.ts, action-result.ts
└─ proxy.ts                           # Next.js 16 proxy routing convention
```
