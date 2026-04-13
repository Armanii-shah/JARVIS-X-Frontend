# JARVIS-X Frontend Documentation

## Overview

JARVIS-X is a **cybersecurity email threat detection dashboard** built with Next.js 16 + React 19. It provides real-time monitoring, threat detection, analytics, and alerting for scanned emails. Users authenticate via Gmail OAuth, and the frontend communicates with a Node.js/Express backend to display security insights.

---

## Table of Contents

1. [File & Folder Structure](#1-file--folder-structure)
2. [All Routes & Pages](#2-all-routes--pages)
3. [Authentication](#3-authentication)
4. [API Calls to Backend](#4-api-calls-to-backend)
5. [State Management](#5-state-management)
6. [UI Components Breakdown](#6-ui-components-breakdown)
7. [Environment Variables](#7-environment-variables)
8. [NPM Dependencies](#8-npm-dependencies)
9. [Styling Approach](#9-styling-approach)
10. [Dashboards & Data Visualization](#10-dashboards--data-visualization)
11. [TypeScript Types & Interfaces](#11-typescript-types--interfaces)
12. [Custom Hooks & Utilities](#12-custom-hooks--utilities)

---

## 1. File & Folder Structure

```
Frontend/
├── app/                                # Next.js App Router root
│   ├── (dashboard)/                   # Route group (no URL segment)
│   │   └── dashboard/                 # /dashboard and sub-routes
│   │       ├── page.tsx               # Main dashboard home
│   │       ├── layout.tsx             # Dashboard shell: auth check + sidebar + header
│   │       ├── alerts/page.tsx        # Alerts management page
│   │       ├── analytics/page.tsx     # Analytics & insights page
│   │       ├── emails/page.tsx        # Scanned emails table page
│   │       ├── threats/page.tsx       # Threat management page
│   │       ├── scan-history/page.tsx  # Scan history log page
│   │       ├── settings/page.tsx      # User settings & billing page
│   │       └── admin/page.tsx         # Admin-only system dashboard
│   ├── auth/                          # Authentication routes
│   │   ├── login/route.ts             # Redirects to backend Gmail OAuth
│   │   ├── sign-up/route.ts           # Redirects to backend Gmail OAuth
│   │   ├── callback/route.ts          # OAuth callback — sets JWT cookies
│   │   ├── logout/route.ts            # Clears cookies — redirects to /
│   │   ├── error/page.tsx             # Auth error display page
│   │   └── sign-up-success/page.tsx   # Post-signup confirmation page
│   ├── page.tsx                       # Landing page (public)
│   ├── layout.tsx                     # Root layout with ThemeProvider
│   └── globals.css                    # Tailwind + CSS variables + custom classes
│
├── components/
│   ├── dashboard/                     # Feature components (all dashboard UI)
│   │   ├── header.tsx                 # Top navbar: notifications, user menu, theme toggle
│   │   ├── sidebar.tsx                # Left nav: menu items, plan badge, admin section
│   │   ├── stats-cards.tsx            # 4 KPI cards + 2 secondary stats
│   │   ├── threat-chart.tsx           # Area chart: threat activity by day
│   │   ├── threat-distribution.tsx    # Progress bars: threat type breakdown
│   │   ├── recent-threats.tsx         # Recent 5 high-risk threats list
│   │   ├── recent-emails.tsx          # Recent 5 scanned emails list
│   │   ├── alerts-view.tsx            # Full alerts page with tabs and filters
│   │   ├── threats-view.tsx           # Full threats page with search and status tabs
│   │   ├── analytics-view.tsx         # Multi-chart analytics dashboard
│   │   ├── emails-table.tsx           # Paginated email table with search/filter
│   │   ├── settings-view.tsx          # Profile and billing settings tabs
│   │   ├── admin-dashboard.tsx        # Admin system stats and charts
│   │   ├── onboarding-modal.tsx       # First-run WhatsApp number collection modal
│   │   └── auto-refresh.tsx           # Invisible component: triggers router refresh every 30s
│   ├── ui/                            # Shadcn UI component library (80+ components)
│   ├── theme-provider.tsx             # next-themes wrapper component
│   └── theme-toggle.tsx               # Dark/light toggle button
│
├── hooks/
│   ├── use-mobile.ts                  # Detects viewport < 768px (mobile breakpoint)
│   └── use-toast.ts                   # Toast notification state manager
│
├── lib/
│   ├── types.ts                       # All TypeScript interfaces (Email, Alert, Threat, etc.)
│   ├── utils.ts                       # cn() classname utility
│   └── supabase/
│       ├── client.ts                  # Browser Supabase client (createBrowserClient)
│       ├── server.ts                  # Server Supabase client (createServerClient + cookies)
│       └── middleware.ts              # Empty stub (unused)
│
├── public/                            # Static assets (icons, placeholders)
├── scripts/                           # SQL migration scripts for Supabase
├── middleware.ts                      # Next.js middleware (empty — no active guards)
├── next.config.mjs                    # Next.js config
├── tsconfig.json                      # TypeScript config
├── postcss.config.mjs                 # PostCSS with Tailwind
└── components.json                    # Shadcn CLI config
```

---

## 2. All Routes & Pages

### Public Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Landing page — hero section, features, testimonials, pricing CTA |
| `/auth/login` | `app/auth/login/route.ts` | Immediately redirects to `{BACKEND_URL}/auth/gmail` |
| `/auth/sign-up` | `app/auth/sign-up/route.ts` | Immediately redirects to `{BACKEND_URL}/auth/gmail` |
| `/auth/callback` | `app/auth/callback/route.ts` | Receives `?token=JWT&email=...` from backend OAuth, sets httpOnly cookies, redirects to `/dashboard` |
| `/auth/logout` | `app/auth/logout/route.ts` | Deletes `jarvis_token` and `jarvis_user` cookies, redirects to `/` |
| `/auth/error` | `app/auth/error/page.tsx` | Displays auth error with retry link |
| `/auth/sign-up-success` | `app/auth/sign-up-success/page.tsx` | Post-signup success page |

### Protected Routes (require `jarvis_token` cookie)

| Route | File | Description |
|-------|------|-------------|
| `/dashboard` | `dashboard/page.tsx` | Home dashboard — KPI cards, threat chart, distribution, recent threats/emails |
| `/dashboard/alerts` | `dashboard/alerts/page.tsx` | All alerts with tab filters (All / Unread / Read) and bulk actions |
| `/dashboard/analytics` | `dashboard/analytics/page.tsx` | Weekly/monthly charts, risk distribution, threat source analysis |
| `/dashboard/emails` | `dashboard/emails/page.tsx` | Paginated email table (20/page) with search and risk-level filtering |
| `/dashboard/threats` | `dashboard/threats/page.tsx` | Threat list with search, severity filters, and status tabs |
| `/dashboard/scan-history` | `dashboard/scan-history/page.tsx` | Scan session history with duration, count, and status |
| `/dashboard/settings` | `dashboard/settings/page.tsx` | Profile (email, phone) and billing (plan comparison) tabs |
| `/dashboard/admin` | `dashboard/admin/page.tsx` | Admin-only: system stats, user activity chart, threat type chart |

**Auth Guard:** The dashboard layout (`dashboard/layout.tsx`) reads the `jarvis_token` cookie server-side. If missing, it performs a `redirect('/auth/login')`.

---

## 3. Authentication

### Overview

Authentication is **OAuth 2.0 via Gmail**, orchestrated entirely by the backend. The frontend never handles OAuth tokens directly — it only receives a pre-signed JWT from the backend callback.

### Flow

```
User clicks "Get Started"
    → Frontend redirects to GET {BACKEND_URL}/auth/gmail
    → Backend initiates Google OAuth consent screen
    → Google redirects to backend callback
    → Backend issues JWT, redirects to:
        /auth/callback?token=<JWT>&email=<user@gmail.com>
    → Frontend sets httpOnly cookies and redirects to /dashboard
```

### Cookies

| Cookie | Type | Max-Age | Purpose |
|--------|------|---------|---------|
| `jarvis_token` | httpOnly, secure, sameSite=lax | 7 days | JWT for API authorization (all protected requests) |
| `jarvis_user` | httpOnly=false, secure, sameSite=lax | 7 days | User email address (displayed in UI) |
| `jarvis_onboarded` | client-readable | Session | Controls onboarding modal display |
| `jarvis-theme` | localStorage | Persistent | Dark/light theme preference |

### Cookie Security

Cookies are set with `secure: process.env.NODE_ENV === 'production'`, so `secure` flag is only active in production (HTTPS).

### Protected Route Guard

```typescript
// app/(dashboard)/dashboard/layout.tsx
const cookieStore = await cookies()
const token = cookieStore.get('jarvis_token')
if (!token) redirect('/auth/login')
```

### Middleware

`middleware.ts` at the project root is **empty** — `{ matcher: [] }`. No active middleware-level guards. Auth is enforced per-layout in server components.

### API Authorization

All protected API calls include:
```
Authorization: Bearer <jarvis_token value>
```

---

## 4. API Calls to Backend

**Base URL:** `process.env.NEXT_PUBLIC_BACKEND_URL` (defaults to `http://localhost:3000`)

All requests use `fetch()` with `{ cache: 'no-store' }` (always fresh, no Next.js data cache).

### Complete Endpoint Reference

| Method | Endpoint | Where Called | Purpose |
|--------|----------|-------------|---------|
| `GET` | `/user/profile` | Dashboard layout, settings page | Fetch user profile (name, phone, plan, role) |
| `PATCH` | `/user/profile` | Settings view, onboarding modal | Update phone number |
| `GET` | `/email/history` | Dashboard, emails, analytics, threats, scan-history pages | Fetch all scanned emails for the user |
| `GET` | `/alert/history` | Alerts page, dashboard, header | Fetch all security alerts |
| `GET` | `/alert/history?unread=true` | Header and sidebar | Fetch unread alert count for notification badge |
| `PATCH` | `/alert/{id}/read` | Alerts view, header dropdown | Mark a single alert as read |
| `DELETE` | `/alert/{id}` | Alerts view | Delete a single alert |
| `PATCH` | `/alert/mark-all-read` | Alerts view, header dropdown | Mark all alerts as read |
| `GET` | `{BACKEND_URL}/auth/gmail` | Login page, sign-up page, landing page CTAs | Initiate Gmail OAuth login flow |

### Example Fetch Pattern (Server Component)

```typescript
const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/email/history`, {
  headers: { Authorization: `Bearer ${token}` },
  cache: 'no-store',
})
if (!res.ok) return []
return await res.json()
```

### Client-Side Polling

The `AutoRefresh` component calls `router.refresh()` every **30 seconds**, which re-runs all server component fetches on the current page. The `DashboardHeader` also independently polls `/alert/history?unread=true` every **30 seconds** client-side for live notification badge updates.

---

## 5. State Management

### Approach

**Minimal, local state only.** No Redux, Zustand, Jotai, or global stores. Data flows down from server components via props.

### Pattern

```
Server Component (page.tsx)
    → fetches data from backend API
    → passes data as props
    → renders Client Components
        → useState for local UI state (filters, search, tabs)
        → no data fetching in client components (except polling)
```

### State Categories

| Category | Mechanism | Examples |
|----------|-----------|---------|
| Server data | Server component `fetch()` + props | Emails, alerts, user profile |
| UI state | `useState` | Tab selection, search query, pagination page, modal open/close |
| Loading state | `useState<boolean>` | Form submit spinners, save buttons |
| Theme | `next-themes` context | Dark/light mode preference |
| Auth state | HTTP cookies | JWT token, user email |
| Notifications | Custom reducer in `use-toast.ts` | Toast queue |

### Context Providers

Only one context is active globally:

```typescript
// app/layout.tsx
<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
  {children}
</ThemeProvider>
```

---

## 6. UI Components Breakdown

### Custom Dashboard Components

#### `DashboardHeader` (`components/dashboard/header.tsx`)
- Top navigation bar rendered in dashboard layout
- Left: Logo and sidebar toggle (mobile)
- Center: Page title / breadcrumb
- Right: Theme toggle → Notification bell with unread badge → User avatar menu (profile, settings, logout)
- Notification dropdown: Last 5 alerts, mark read/clear all, link to `/dashboard/alerts`
- Polls unread alerts every 30 seconds

#### `DashboardSidebar` (`components/dashboard/sidebar.tsx`)
- Left navigation panel
- Logo and app name at top
- Navigation items: Dashboard, Emails, Threats, Alerts, Analytics, Scan History
- Admin section (conditionally shown if `profile.role === 'admin'`): Admin Dashboard
- Bottom: Settings link, plan badge (shows "Upgrade" for free tier), user email

#### `StatsCards` (`components/dashboard/stats-cards.tsx`)
- 4 primary KPI cards: Total Emails Scanned, Threats Detected, Active Alerts, Security Score
- 2 secondary stats: Emails Today, Threats Today
- Each card shows value, label, icon, and trend indicator (up/down arrow with percentage)

#### `ThreatChart` (`components/dashboard/threat-chart.tsx`)
- Recharts `AreaChart` with 3 stacked areas
- X-axis: Day of week (Mon–Sun), Y-axis: Threat count
- Areas: Low Risk (green), Medium Risk (yellow), High Risk (red)
- Data derived from email scan history, grouped by day

#### `ThreatDistributionCard` (`components/dashboard/threat-distribution.tsx`)
- Card with progress bars for each threat type
- Shows count and percentage for: High, Medium, Low severity
- Color-coded: red → yellow → green

#### `RecentThreats` (`components/dashboard/recent-threats.tsx`)
- Lists 5 most recent high-risk threats
- Shows: sender email, subject, threat level badge, relative time ("2 hours ago")
- "View All" link to `/dashboard/threats`

#### `RecentEmails` (`components/dashboard/recent-emails.tsx`)
- Lists 5 most recently scanned emails
- Shows: sender, subject, risk score (colored), time
- "View All" link to `/dashboard/emails`

#### `AlertsView` (`components/dashboard/alerts-view.tsx`)
- Summary cards: Total Alerts, Unread, High Priority
- Tab navigation: All / Unread / Read
- Per-alert: title, message, timestamp, read/unread badge, mark-read button, delete button
- Bulk actions: Mark All Read, Clear All
- Calls backend API client-side for PATCH/DELETE operations

#### `ThreatsView` (`components/dashboard/threats-view.tsx`)
- Summary cards: Total Threats, High Severity, Unresolved, Resolved
- Search bar filters by subject or sender
- Tabs: All / High / Medium / Low severity
- Per-threat: type, severity badge, email subject, description, timestamp

#### `AnalyticsView` (`components/dashboard/analytics-view.tsx`)
- 5 charts (see section 10 for details)
- Summary insight cards: Average Risk Score, Peak Threat Day, Most Common Threat, Emails/Day

#### `EmailsTable` (`components/dashboard/emails-table.tsx`)
- Paginated table (20 rows/page) with columns: Sender, Subject, Risk Score, Threat Level, Received At
- Search: filters by subject, sender name, or sender email
- Risk filter dropdown: All Emails / High Risk / Medium Risk / Safe
- Risk score color-coded: red (>60), yellow (41–60), green (≤40)
- Pagination controls with page counter

#### `SettingsView` (`components/dashboard/settings-view.tsx`)
- Two tabs: Profile and Billing
- Profile tab: email field (read-only), phone number input (editable), Save button
- Billing tab: Three plan cards (Free, Pro, Enterprise) with feature lists
- Current plan highlighted; "Upgrade" CTA on non-current plans

#### `AdminDashboard` (`components/dashboard/admin-dashboard.tsx`)
- Admin-only page (no role check in UI — guarded in page.tsx)
- System stats: Total Users, Active Users, Emails Processed, Threats Blocked, System Uptime, Avg Response Time
- Area chart: Weekly user activity (registered users + scans)
- Bar chart: Threat type breakdown across all users

#### `OnboardingModal` (`components/dashboard/onboarding-modal.tsx`)
- Fixed overlay modal shown once per user (until `jarvis_onboarded` cookie is set)
- Collects WhatsApp number for SMS/WhatsApp alert delivery
- Validation: must start with `92` (Pakistan), exactly 12 digits
- PATCH `/user/profile` with phone number on submit
- Sets `jarvis_onboarded` cookie on success and dismisses

#### `AutoRefresh` (`components/dashboard/auto-refresh.tsx`)
- Invisible component rendered on dashboard home
- Uses `setInterval` to call `router.refresh()` every 30,000ms
- Forces all server components on the page to re-fetch fresh data

### UI Component Library (Shadcn)

80+ pre-built headless UI components in `components/ui/`, each built with **Radix UI primitives + Tailwind CSS**:

| Category | Components |
|----------|-----------|
| Inputs | `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Slider`, `RadioGroup`, `OTP Input` |
| Buttons | `Button` (with variants: default, outline, ghost, destructive, secondary) |
| Layout | `Card`, `Separator`, `Resizable Panels`, `ScrollArea` |
| Overlays | `Dialog`, `Sheet`, `Drawer`, `Popover`, `Tooltip`, `HoverCard` |
| Navigation | `Tabs`, `Breadcrumb`, `NavigationMenu`, `Menubar`, `Sidebar` (collapsible) |
| Data Display | `Table`, `Badge`, `Avatar`, `Progress`, `Skeleton`, `Accordion` |
| Feedback | `Alert`, `Toast` / `Toaster`, `Sonner` |
| Commands | `Command` (cmdk), `DropdownMenu`, `ContextMenu` |
| Media | `Carousel` (Embla), `Calendar` (react-day-picker) |
| Charts | `ChartContainer`, `ChartTooltip` (Recharts wrappers) |

---

## 7. Environment Variables

Configuration file: `.env.local`

| Variable | Value | Used In | Purpose |
|----------|-------|---------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:3000` | All API fetch calls, auth routes | Backend API base URL |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://pvojdnlobqdymamywwul.supabase.co` | `lib/supabase/client.ts`, `lib/supabase/server.ts` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` (JWT) | `lib/supabase/client.ts`, `lib/supabase/server.ts` | Supabase anonymous access key |
| `NODE_ENV` | `development` / `production` | `auth/callback/route.ts` | Controls `secure` flag on cookies |

**Note:** All three `NEXT_PUBLIC_*` variables are exposed to the browser bundle. The Supabase credentials are present for client initialization but actual data fetching bypasses Supabase and hits the custom backend API.

---

## 8. NPM Dependencies

### Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.1.6 | React framework with App Router, SSR, file-based routing |
| `react` / `react-dom` | 19.2.4 | React library |
| `typescript` | 5.7.3 | Static type checking |

### UI & Styling

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | 4.2.0 | Utility-first CSS framework |
| `@tailwindcss/postcss` | 4.2.0 | Tailwind v4 PostCSS integration |
| `autoprefixer` | 10.4.20 | Adds vendor prefixes to CSS |
| `@radix-ui/*` | Various | 20+ headless UI primitives (Dialog, Popover, Tabs, etc.) |
| `next-themes` | 0.4.6 | Dark/light mode with localStorage persistence |
| `lucide-react` | 0.564.0 | SVG icon library (50+ icons used) |
| `class-variance-authority` | 0.7.1 | Type-safe CSS variant API for components |
| `clsx` | 2.1.1 | Conditional classname concatenation |
| `tailwind-merge` | 3.3.1 | Merge Tailwind classes without conflicts |
| `tw-animate-css` | 1.3.3 | Pre-built Tailwind animation utilities |

### Forms & Validation

| Package | Version | Purpose |
|---------|---------|---------|
| `react-hook-form` | 7.54.1 | Performant form state management |
| `@hookform/resolvers` | 3.9.1 | Connects Zod schemas to react-hook-form |
| `zod` | 3.24.1 | Runtime schema validation |

### Data Visualization

| Package | Version | Purpose |
|---------|---------|---------|
| `recharts` | 2.15.0 | React charting library (Area, Bar, Line, Pie charts) |
| `date-fns` | 4.1.0 | Date formatting: `formatDistanceToNow`, `format`, `parseISO` |

### Backend & Auth

| Package | Version | Purpose |
|---------|---------|---------|
| `@supabase/supabase-js` | 2.99.1 | Supabase client for browser |
| `@supabase/ssr` | 0.9.0 | Supabase server-side rendering helpers |
| `@vercel/analytics` | 1.6.1 | Page view and event analytics |

### Specialized UI Components

| Package | Version | Purpose |
|---------|---------|---------|
| `cmdk` | 1.1.1 | Accessible command palette (Command menu) |
| `embla-carousel-react` | 8.6.0 | Touch-friendly carousel component |
| `react-day-picker` | 9.13.2 | Accessible date picker / calendar |
| `react-resizable-panels` | 2.1.7 | Drag-to-resize panel layouts |
| `input-otp` | 1.4.2 | One-time password input component |
| `sonner` | 1.7.1 | Opinionated toast notification system |
| `vaul` | 1.1.2 | Accessible bottom-sheet Drawer component |

---

## 9. Styling Approach

### Framework

**Tailwind CSS v4** with PostCSS integration. Unlike Tailwind v3, v4 uses a single `@import "tailwindcss"` in the CSS file and `@theme inline` blocks for configuration — no separate `tailwind.config.js`.

### File: `app/globals.css`

All theme customization lives here:

```css
@import "tailwindcss";
@import "tw-animate-css";

@theme inline {
  --font-inter: var(--font-inter);
  --font-jetbrains: var(--font-jetbrains);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  /* ... maps CSS vars to Tailwind utilities ... */
}
```

### Color System (OKLch Color Space)

The app uses **OKLch** for perceptually uniform colors:

**Light Theme (`:root`)**

| Variable | OKLch Value | Color |
|----------|-------------|-------|
| `--background` | `oklch(0.98 0 0)` | Near white |
| `--foreground` | `oklch(0.13 0.01 250)` | Dark blue-gray |
| `--primary` | `oklch(0.55 0.15 195)` | Cyan (brand color) |
| `--muted` | `oklch(0.93 0.01 250)` | Light gray |
| `--border` | `oklch(0.88 0.01 250)` | Subtle border |
| `--destructive` | `oklch(0.55 0.22 25)` | Red-orange |

**Dark Theme (`.dark`)**

| Variable | OKLch Value | Color |
|----------|-------------|-------|
| `--background` | `oklch(0.12 0.01 250)` | Very dark blue |
| `--foreground` | `oklch(0.95 0 0)` | Near white |
| `--primary` | `oklch(0.75 0.15 195)` | Light cyan |
| `--card` | `oklch(0.15 0.01 250)` | Dark card surface |
| `--border` | `oklch(0.28 0.02 250)` | Dark border |
| `--muted` | `oklch(0.20 0.01 250)` | Dark muted surface |

**Threat Level Colors (consistent across themes)**

| Variable | Color | Use |
|----------|-------|-----|
| `--threat-low` | `oklch(0.65 0.18 145)` | Green — safe |
| `--threat-medium` | `oklch(0.75 0.18 85)` | Yellow — warning |
| `--threat-high` | `oklch(0.55 0.22 25)` | Red — danger |
| `--threat-critical` | `oklch(0.50 0.25 15)` | Dark red — critical |

### Custom CSS Classes

```css
.glow-cyan  { box-shadow: 0 0 20px oklch(0.55 0.15 195 / 30%) }
.glow-red   { box-shadow: 0 0 20px oklch(0.55 0.22 25 / 30%) }
.glow-green { box-shadow: 0 0 20px oklch(0.65 0.18 145 / 30%) }

.pulse-alert { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite }

.grid-pattern {
  background-image: repeating-linear-gradient(...);
  /* Subtle grid overlay for hero section */
}
```

### Typography

| Font | Variable | Use |
|------|----------|-----|
| Inter | `--font-inter` | Body text, UI labels |
| JetBrains Mono | `--font-jetbrains` | Code, risk scores, technical values |

### Responsive Design

Mobile-first with Tailwind breakpoints:
- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+

Common responsive patterns:
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
className="hidden md:flex"
className="text-sm lg:text-base"
```

### Component Styling

All components use the `cn()` utility from `lib/utils.ts`:
```typescript
import { cn } from '@/lib/utils'
// cn() = clsx() + tailwind-merge()
// Prevents class conflicts: cn('px-2 px-4') → 'px-4'
```

---

## 10. Dashboards & Data Visualization

All charts use **Recharts 2.15** with custom styling to match the app theme.

### Dashboard Home (`/dashboard`)

#### Threat Activity Area Chart
- **Type:** `AreaChart` with 3 stacked areas
- **X-axis:** Day of week (Mon, Tue, Wed, Thu, Fri, Sat, Sun)
- **Y-axis:** Number of threats
- **Data series:**
  - Low Risk — green (`--threat-low`)
  - Medium Risk — yellow (`--threat-medium`)
  - High Risk — red (`--threat-high`)
- **Data source:** `/email/history` → grouped by `received_at` day of week

#### Threat Distribution
- **Type:** Horizontal progress bars (not a chart library — CSS-based)
- **Shows:** Count and percentage for High / Medium / Low severity
- **Color-coded** using threat level variables

### Analytics Page (`/dashboard/analytics`)

#### Weekly Email Volume
- **Type:** `AreaChart`
- **X-axis:** Day of week
- **Y-axis:** Email count
- **Shows:** Volume trends for the week

#### Weekly Threats Detected vs Blocked
- **Type:** `BarChart` (grouped)
- **X-axis:** Day of week
- **Y-axis:** Count
- **Series:** Threats Detected (red) + Threats Blocked (green)

#### Monthly Trend (Dual-Axis Line Chart)
- **Type:** `LineChart`
- **X-axis:** Week of month
- **Left Y-axis:** Email volume (blue line)
- **Right Y-axis:** Threat count (red line)
- **Shows:** Monthly correlation between email volume and threats

#### Threat Sources (Donut Chart)
- **Type:** `PieChart` with inner radius (donut)
- **Segments:** External Domains, Known Bad Actors, Spoofing Attempts, Unknown Sources
- **Colors:** Cyan, red, yellow, gray
- **Includes:** Center label with total count

#### Risk Score Distribution
- **Type:** `BarChart`
- **X-axis:** Risk score ranges (0-20, 21-40, 41-60, 61-80, 81-100)
- **Y-axis:** Email count per range
- **Color gradient:** Green → Yellow → Red (low to high risk)

#### Insight Cards
Below the charts, 4 summary cards derived from processed data:
- Average Risk Score
- Peak Threat Day
- Most Common Threat Type
- Average Emails Per Day

### Admin Dashboard (`/dashboard/admin`)

#### User Activity Area Chart
- **Type:** `AreaChart` (two areas)
- **X-axis:** Day of week
- **Series:** Registered Users (cyan) + Scans Performed (blue)
- **Data:** Static mock data (no backend endpoint for system stats)

#### Threat Types Bar Chart
- **Type:** `BarChart`
- **X-axis:** Threat type (Phishing, Malware, Spam, Suspicious Link, Spoofing)
- **Y-axis:** Count
- **Color:** Uniform cyan bars

### Stat Cards (All Dashboard Pages)

Each stat card renders:
```
[Icon]  [Label]
[Value]
[Trend] +12% from last week
```

Trend indicators use colored arrows: green (↑ improving) or red (↑ worsening), depending on metric direction.

---

## 11. TypeScript Types & Interfaces

All interfaces live in `lib/types.ts`:

```typescript
interface Profile {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  role: 'user' | 'admin'
  subscription_tier: 'free' | 'pro' | 'premium' | 'enterprise'
  created_at: string
  updated_at: string
}

interface Email {
  id: string
  user_id: string
  email_account_id: string | null
  external_id: string | null
  sender_email: string
  sender_name: string | null
  subject: string | null
  body_preview: string | null
  received_at: string
  scanned_at: string
  risk_score: number      // frontend field name
  score?: number          // backend field name (both checked)
  threat_level: 'low' | 'medium' | 'high'
  is_read: boolean
  created_at: string
}

interface Alert {
  id: string
  user_id: string
  threat_id: string | null
  alert_type: 'email' | 'sms' | 'whatsapp' | 'push' | 'call' | 'dashboard' | 'none'
  title: string
  message: string | null
  is_sent: boolean
  sent_at: string | null
  is_read: boolean
  read_at: string | null
  created_at: string
  threat?: Threat
}

interface Threat {
  id: string
  user_id: string
  email_id: string | null
  threat_type: 'phishing' | 'malware' | 'spam' | 'suspicious_link' | 'spoofing' | 'social_engineering'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string | null
  indicators: string[]
  is_resolved: boolean
  resolved_at: string | null
  resolved_by: string | null
  created_at: string
  email?: Email
}

interface ScanHistory {
  id: string
  user_id: string
  email_account_id: string | null
  scan_type: 'automatic' | 'manual' | 'scheduled'
  emails_scanned: number
  threats_found: number
  duration_ms: number | null
  status: 'pending' | 'running' | 'completed' | 'failed'
  created_at: string
}

interface DashboardStats {
  totalEmailsScanned: number
  totalThreatsDetected: number
  activeAlerts: number
  riskScore: number
  emailsToday: number
  threatsToday: number
  threatsBlocked: number
  phishingAttempts: number
}

interface ThreatTrend {
  date: string
  low: number
  medium: number
  high: number
}

interface ThreatDistribution {
  type: string
  count: number
  percentage: number
}
```

---

## 12. Custom Hooks & Utilities

### `useIsMobile()` — `hooks/use-mobile.ts`

Detects if the viewport is mobile (< 768px):

```typescript
const MOBILE_BREAKPOINT = 768

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)
  // Uses window.matchMedia('(max-width: 767px)')
  // Listens for viewport changes
  return isMobile
}
```

**Used in:** Sidebar (collapse behavior), Header (mobile menu), responsive component rendering.

---

### `useToast()` — `hooks/use-toast.ts`

Reducer-based toast notification system:

```typescript
// Dispatch actions:
toast({ title: "Saved", description: "Profile updated" })
toast({ title: "Error", variant: "destructive" })
dismiss(toastId)

// Internal state:
{ toasts: Toast[] }  // max 1 active toast (TOAST_LIMIT = 1)
```

Action types: `ADD_TOAST`, `UPDATE_TOAST`, `DISMISS_TOAST`, `REMOVE_TOAST`

Uses a global in-module listener pattern so the `Toaster` component can subscribe without a Context provider.

---

### `cn()` — `lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Used everywhere** — prevents conflicting Tailwind classes when combining conditional class names.

---

### Supabase Clients — `lib/supabase/`

**Browser client** (`client.ts`):
```typescript
import { createBrowserClient } from '@supabase/ssr'
export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
```

**Server client** (`server.ts`):
```typescript
import { createServerClient } from '@supabase/ssr'
// Reads/writes cookies from Next.js cookies() API
export async function createClient() { ... }
```

**Note:** Supabase clients are initialized but **not actively used for data fetching**. All application data flows through the custom backend REST API. The clients exist for potential future Supabase-direct queries or real-time subscriptions.

---

## Architecture Summary

```
Browser
  ↓ GET /dashboard
Next.js Server Component (page.tsx)
  ↓ fetch() with Bearer token
Backend API (localhost:3000)
  ↓ JSON response
Server Component renders HTML
  ↓ props
Client Components (React islands)
  ↓ useState for local UI interactions
  ↓ direct fetch() for mutations (mark read, delete, update profile)
Backend API (localhost:3000)
```

**Key Characteristics:**
- Server-first rendering — pages load with data pre-rendered
- Client islands for interactivity (search, filters, form submissions)
- Cookie-based auth with JWT — no session management on frontend
- Polling (30s intervals) for near-real-time alert updates
- Zero global client state — component `useState` only
- Role-based UI (admin panel) determined by `profile.role` from API
