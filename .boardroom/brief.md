# Fonsi by Cristal

Salon booking platform for luxury hair salon and makeup studio in San Antonio, TX.

| Field | Value |
|-|-|
| Repo | `C:\Users\Jay\OneDrive\Desktop\fonsi-by-cristal\` |
| CLAUDE.md | `fonsi-by-cristal\CLAUDE.md` |
| Stage | Alpha |
| Sector | Services |
| Tech Stack | Next.js 15, React 19, TypeScript, Tailwind CSS 4, Prisma, Expo 54, Zustand |

## Strategic Value

Client project for a San Antonio salon. Dual-platform booking system (web + mobile) with real-time availability and double-booking prevention. Demonstrates full-stack product delivery capability for the portfolio. Potential template for additional local service business clients. The salon industry is underserved by custom tech — most salons use generic booking platforms (Square, Vagaro) with limited branding control.

## Current State

Next.js website with 6 pages (home, services, booking, gallery, about, contact) and multi-step booking widget with availability checking. React Native mobile app (Expo 54) with 5-step guided booking flow. Shared backend API endpoints for services, appointments, and availability. Database schema (User, Service, Appointment, BusinessHours) via Prisma with SQLite (dev). Email confirmations via Nodemailer. Dark luxury design system with gold accent theme. Both platforms prevent double-booking in real-time. 25-service catalog implemented.

## Revenue Model

Client service project:
- **Initial build** — fixed project fee for website + mobile app delivery
- **Hosting/maintenance** — monthly retainer for Vercel hosting, database, updates
- **Template licensing** — potential to white-label for other salons/service businesses
- **Add-ons** — Stripe payment integration, SMS reminders, loyalty program features

## Risks

| Risk | Severity | Mitigation |
|-|-|-|
| Client dependency — single salon, single revenue source | Medium | Design as a template; document for reuse with other service businesses |
| Deployment complexity — Vercel, PostgreSQL, domain, app stores | Medium | Create deployment playbook; automate with EAS builds and Vercel CLI |
| Ongoing maintenance burden for a client project | Low | Minimize custom logic; use managed services (Vercel, Neon/Supabase) to reduce ops |

## Next Milestones

| Milestone | Target | Status |
|-|-|-|
| Vercel deployment with production domain | Q1 2026 | Not started |
| PostgreSQL migration (SQLite → production DB) | Q1 2026 | Not started |
| Stripe payment integration | Q2 2026 | Not started |
| App store submission (iOS + Android) | Q2 2026 | Not started |
| Client handoff with admin training | Q2 2026 | Not started |

## Agent Notes

- **CFO**: Client project with defined scope and deliverables. Track hours vs. fixed fee to understand true margin. Monthly retainer ($200-500/month for hosting + maintenance) creates small recurring revenue. Template potential is the real upside — if 5 salons adopt at $2K setup + $300/month, that's meaningful passive income.
- **CTO**: Next.js 15 + Prisma is a clean stack for this scope. SQLite → PostgreSQL migration is the critical deployment blocker. Ensure the booking availability logic handles timezone edge cases. Expo 54 for mobile is appropriate — don't over-engineer for a single-client app.
- **CMO**: This is a client deliverable, not a product launch. Marketing is the client's responsibility. However, document the build as a case study for attracting future service business clients. Before/after screenshots of "old booking process vs. new" would be compelling.
- **COO**: Deployment checklist: domain DNS, Vercel env vars, PostgreSQL provisioning, email service config (production SMTP), app store accounts (Apple + Google), EAS build profiles. Create a runbook so this can be repeated for future clients.
