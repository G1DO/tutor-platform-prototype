# TutorConnect — Tutoring Platform Demonstration Prototype

[![Deploy to GitHub Pages](https://github.com/G1DO/tutor-platform-prototype/actions/workflows/deploy.yml/badge.svg)](https://github.com/G1DO/tutor-platform-prototype/actions/workflows/deploy.yml)

**Live Deployed URL:** [https://g1do.github.io/tutor-platform-prototype/](https://g1do.github.io/tutor-platform-prototype/)  
**GitHub Repository:** [https://github.com/G1DO/tutor-platform-prototype](https://github.com/G1DO/tutor-platform-prototype)

---

## Overview

**TutorConnect** is a demonstration prototype of an online tutoring marketplace designed for the Egyptian educational market (IGCSE, Thanaweya Amma, university STEM, and languages).

This prototype models end-to-end user journeys for **Students**, **Tutors**, and **Administrators** with realistic sample data, client-side role enforcement, and simulated external services without requiring production cloud infrastructure (e.g. AWS, real Paymob merchant accounts, or Zoom API keys).

---

## Demo Accounts & Credentials

The platform provides three predefined demonstration accounts. You can sign in using the exact credentials below or click the quick-login buttons on the login screen and persistent top navigation banner:

| Role | Username | Password | Default Starting Balance / Status | Destination Portal |
|---|---|---|---|---|
| **Admin** | `admin` | `admin` | Full administrative oversight | `#/admin/dashboard` |
| **Student** | `user` | `student` | **EGP 1,000** promo credit in ledger | `#/student/dashboard` |
| **Tutor** | `tutor` | `tutor` | Approved, active & bookable (Dr. Tarek Mansour) | `#/tutor/dashboard` |

> [!NOTE]
> **Authentication Simulation:** This prototype uses client-side session checks via `sessionStorage` and publicly known demonstration credentials. It provides no production cryptographic security or secret management guarantees.

---

## Technical Stack & Architecture

- **Frontend Framework:** React 19 with TypeScript
- **Build Tool:** Vite 8 with `@tailwindcss/vite`
- **Styling:** Tailwind CSS v4 (responsive light theme with blue and indigo accents)
- **Routing:** React Router (`react-router-dom` v7) configured with `HashRouter` to guarantee seamless navigation and page refreshes on GitHub Pages without server-side rewrite rules
- **State & Persistence:**
  - `localStorage` (`tutorconnect_demo_data_v2`): Persistent shared data store holding users, bookings, ledger transactions, reviews, notifications, audit logs, and settings. Changes made by a student are immediately visible when switching to the tutor or admin account in the same browser.
  - `sessionStorage` (`tutorconnect_current_user_id`): Tracks the active demo login.
- **Testing:** Vitest for automated state transitions and financial ledger logic verification.
- **Continuous Deployment:** GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically runs tests, builds static assets, and deploys to GitHub Pages upon push to `main`.

---

## Core Features Implemented

### 1. Student Journey
- **Dashboard:** Upcoming session cards with direct "Join Classroom" or "Manage" shortcuts, platform wallet balance widget, recent transaction activity, and recommended tutors.
- **Tutor Discovery (`#/tutors`):** Search by tutor name or subject, filter by subject category and maximum hourly price, and sort by highest rating or price (low-to-high / high-to-low).
- **Tutor Profiles (`#/tutor/:id`):** Complete educator biography, subjects, hourly rates, verified credentials list, weekly calendar availability, and verified student reviews.
- **Booking Flow (`BookingModal`):**
  - Select subject, date (next 14 days), and available 60-minute time slot.
  - Prevents double-booking: detects tutor slot reservation and student schedule conflicts.
  - Payment choices: Platform Credit (with balance verification) or Simulated Paymob Checkout.
- **Platform Credit Ledger (`#/student/credit`):**
  - Balance derived strictly as the mathematical sum of all ledger entries.
  - Top-up action via simulated Paymob gateway.
  - Full transaction ledger showing opening balance, deductions, refunds, and adjustments with reference IDs and timestamps.
- **My Sessions (`#/student/sessions`):** Tabs for Upcoming, Completed, and Cancelled sessions.
  - **Cancel Session:** Allowed before start time; immediately refunds 100% of session cost into platform credit.
  - **Reschedule Session:** Pick a new open slot with the same tutor without paying again.
  - **Leave Review:** Enabled only after a session is marked completed (1 review per booking).

### 2. Tutor Journey
- **Dashboard:** Metrics for upcoming sessions, completed sessions, net demo earnings, and average star rating.
- **Bookings Management (`#/tutor/bookings`):** Inspect student bookings, host live classrooms, and click **"Mark Completed"** to conclude a session, trigger net payout calculation, and unlock student reviews.
- **Weekly Availability Editor (`#/tutor/availability`):** Interactive day-by-day scheduler (Sunday to Saturday) with hourly slot toggles.
- **Earnings Breakdown (`#/tutor/earnings`):** Session-level audit displaying gross price, 10% platform commission snapshot, and net earnings. Uncompleted upcoming bookings remain held in escrow.
- **Student Reviews (`#/tutor/reviews`):** Direct student feedback, ratings, and testimonials.
- **Tutor Profile & Verification (`#/tutor/profile`):** Edit bio, subjects, and hourly rates in EGP. Displays submitted verification documents (degree certificates, ID card scans).

### 3. Admin Journey
- **System Overview (`#/admin/dashboard`):** Real-time KPI counts derived from actual data store: total students, total tutors, pending applications, bookings, completed sessions, gross session volume, commission revenue, and total circulating credit.
- **User Directory (`#/admin/users`):** Search students and tutors, inspect profiles, and activate or suspend accounts with a recorded audit reason.
- **Tutor Application Review (`#/admin/applications`):** Inspect pending applications, verify uploaded mock credentials, and Approve or Reject with an audit note. Approved tutors immediately appear in student discovery.
- **Bookings Oversight (`#/admin/bookings`):** Search and filter all platform sessions; cancel bookings on behalf of users with automatic credit refunds.
- **Transactions & Adjustments (`#/admin/transactions`):** Complete immutable financial ledger; includes the **"Adjust Student Credit"** tool requiring student selection, adjustment amount in EGP, and a mandatory audit reason.
- **Administrative Activity Log (`#/admin/activity`):** Audit trail recording who made each change, timestamp, target entity, and rationale.
- **Safety & Moderation (`#/admin/moderation`):**
  - Hide or restore student reviews (recalculates tutor average rating automatically).
  - Manual tutor booking restrictions with recorded reasons.
  - Chat report resolution and dismissal for flagged policy violations.
- **Platform Settings (`#/admin/settings`):** Adjust platform commission rate %, manage supported curriculum subjects, and trigger demo data reset.

### 4. External Services Simulated
- **Paymob Gateway (`PaymobModal`):** Sandbox checkout simulator with simulated card inputs, "Simulate Successful Payment", "Simulate Card Decline / Error", and "Cancel" actions.
- **Zoom Lesson Room (`ZoomLessonModal`):** Classroom view showing meeting ID, passcode, audio/video toggles, collaborative whiteboard canvas, and in-session chat.
- **Notifications:** In-app notification center tracking bookings, cancellations, payments, and application approvals with unread badges.

---

## Prototype Assumptions & Business Rules

1. **Session Duration:** Fixed at 60 minutes. Timezone displayed as `Africa/Cairo (EET / UTC+2)`.
2. **Platform Commission:** Default is 10%, editable by the admin.
3. **Price & Commission Snapshots:** When a booking is created, the session price and platform commission rate are permanently snapshotted so subsequent setting changes do not alter historical records.
4. **Payment & Confirmation:** Bookings become confirmed only after a successful credit deduction or simulated Paymob callback.
5. **Cancellations & Refunds:** Prepaid sessions can be cancelled anytime before the scheduled start time and are refunded 100% into platform credit (even if originally paid via simulated card checkout).
6. **Rescheduling:** Upcoming bookings can be moved to another available slot with the same tutor without any additional charge.
7. **Earnings Recognition:** Tutor earnings are recognized and added to net totals only when a session is completed.
8. **Review Eligibility:** A student can leave a review only for completed sessions that belong to them, with a strict limit of one review per booking.
9. **Tutor Restrictions:** Manual administrative restrictions are enforced; no arbitrary automatic penalty policies are applied.

---

## Getting Started Locally

### Prerequisites
- Node.js 18+ (tested on Node v22 and v24)
- npm 9+

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/G1DO/tutor-platform-prototype.git
cd tutor-platform-prototype

# 2. Install dependencies
npm install

# 3. Run automated tests (Vitest)
npm test

# 4. Start local development server
npm run dev

# 5. Build for production
npm run build

# 6. Preview production build locally
npm run preview
```

---

## Deploying to GitHub Pages

This project is configured with a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and deploys the static application automatically.

To configure your own GitHub repository:
1. In the GitHub repository settings, navigate to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Push to `main` or trigger the workflow manually from the **Actions** tab via `workflow_dispatch`.

---

## Browser Data Storage & Reset

All prototype modifications are saved in your browser's `localStorage`. To return to the clean starting state at any time:
1. Click the **"Reset Demo"** button on the top banner or navigate to **Admin Settings**.
2. Confirm the reset prompt to restore the 3 default demo accounts, initial 8 tutors, and starting balances.
