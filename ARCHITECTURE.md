# Fonsi by Cristal — Full Project Architecture

## Overview

This project consists of three interconnected parts that work together to provide a complete booking and web presence for Fonsi by Cristal salon in San Antonio, TX.

```
fonsi-by-cristal/
├── index.html              ← Visual prototype (preview the design)
├── fonsi-website/           ← Next.js website (production site)
├── fonsi-app/               ← React Native mobile app (iOS & Android)
└── ARCHITECTURE.md          ← This file
```

---

## 1. Website (Next.js)

**Directory:** `fonsi-website/`
**Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Prisma, SQLite

### Pages
| Route | Purpose |
|-------|---------|
| `/` | Homepage — Hero, about preview, featured services, CTA |
| `/services` | Full service menu with tabs (Hair, Bridal, Makeup, Waxing) |
| `/booking` | Multi-step appointment booking |
| `/gallery` | Photo portfolio |
| `/about` | About Cristal — bio, credentials, story |
| `/contact` | Location, hours, map, cancellation policy |

### API Endpoints
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/services` | Fetch all services |
| GET | `/api/availability?date=YYYY-MM-DD&serviceId=X` | Get available time slots |
| POST | `/api/appointments` | Create a new appointment |
| GET | `/api/appointments?clientEmail=X` | Get client's appointments |

### Database (Prisma)
- **Service** — name, category, price range, duration, description
- **Appointment** — date, time, status, service, client info, notes
- **User** — client info (name, email, phone)
- **BusinessHours** — weekly schedule (Tue-Sat 10am-6:30pm)

### Quick Start
```bash
cd fonsi-website
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
# → http://localhost:3000
```

### Deployment
Deploy to **Vercel** for free:
```bash
npm i -g vercel
vercel
```
For production, switch from SQLite to PostgreSQL (Supabase, Neon, or PlanetScale).

---

## 2. Mobile App (React Native / Expo)

**Directory:** `fonsi-app/`
**Stack:** Expo 51, React Native, TypeScript, Zustand, Expo Router

### Screens
| Tab | Screen | Purpose |
|-----|--------|---------|
| Home | `/(tabs)/index` | Welcome, quick book, upcoming appointments |
| Services | `/(tabs)/services` | Browse all services with category filters |
| Book | `/(tabs)/book` | 5-step booking wizard |
| Profile | `/(tabs)/profile` | Account, appointment history, settings |
| — | `/appointment/[id]` | Appointment detail view |

### State Management (Zustand)
- **bookingStore** — Tracks booking flow (service, date, time, client info, current step)
- **appointmentStore** — Manages appointment list, upcoming/past filtering

### API Client
Connects to the same backend as the website. Base URL is configurable:
- Development: `http://localhost:3000/api`
- Production: `https://fonsibycristal.com/api`

### Quick Start
```bash
cd fonsi-app
npm install
npm start
# Scan QR code with Expo Go app
```

### Building for App Stores
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

---

## 3. How They Connect

```
┌─────────────────────┐     ┌─────────────────────┐
│   Next.js Website    │     │  React Native App    │
│  (fonsibycristal.com)│     │   (iOS & Android)    │
│                      │     │                      │
│  • Server-rendered   │     │  • Native experience │
│  • SEO optimized     │     │  • Push notifications│
│  • Booking widget    │     │  • Offline capable   │
└──────────┬───────────┘     └──────────┬───────────┘
           │                            │
           │     Same API endpoints     │
           └────────────┬───────────────┘
                        │
              ┌─────────▼─────────┐
              │  Shared Backend    │
              │  (Next.js API)     │
              │                    │
              │  /api/services     │
              │  /api/availability │
              │  /api/appointments │
              └─────────┬──────────┘
                        │
              ┌─────────▼─────────┐
              │    Database        │
              │  (Prisma + SQLite  │
              │   → PostgreSQL)    │
              └────────────────────┘
```

Both the website and mobile app talk to the same API, so appointments booked on either platform show up everywhere. The booking system prevents double-booking by checking availability against existing appointments in real-time.

---

## Design System

Both platforms share the same visual language:

| Token | Value | Usage |
|-------|-------|-------|
| `gold` | `#c9a96e` | Primary accent, CTAs, highlights |
| `gold-light` | `#d4bc8b` | Hover states |
| `gold-dark` | `#a8843f` | Active states |
| `bg-primary` | `#0a0a0a` | Main background |
| `bg-secondary` | `#141414` | Section alternation |
| `bg-card` | `#1a1a1a` | Card backgrounds |
| `text-primary` | `#f5f0eb` | Headings, primary text |
| `text-secondary` | `#b8b0a8` | Body text |
| `text-muted` | `#7a7370` | Subtle text, descriptions |

**Fonts:**
- Headings: Cormorant Garamond / Playfair Display (serif)
- Body: Montserrat (sans-serif)

---

## Services Data

All 25 services are defined in both projects:

### Hair (18 services)
- Hair Cuts for Women: $55-$85
- Fringe Trim: $10-$15
- Shampoo & Blowouts: $45-$85
- Styling: $35-$120
- Special Occasion Updo: $55-$125
- Men's Cuts: $29.95-$55
- Perm & Body Wave: $135-$225
- Keratin Treatment: Consultation
- Color Retouch: $85-$135
- Full Color: $95-$205+
- Color Correction: In-Person Consultation
- Foil Highlights: $205+
- Ombre/Balayage/Color Melting: In-Person Consultation
- Additional Colors: $35-$95 each
- Partial Foil: $75-$205
- Toners: $35-$65
- Treatments: $35-$195
- Olaplex Bond Shaper: $125-$200

### Bridal (3 services)
- The Bride Package: $350
- Day of Wedding Party: Upon Request
- On-Site Service: Upon Request

### Makeup (3 services)
- MAC Full Face Application: $85
- MAC Eye Makeup Only: $50
- On-Site Application: Consultation

### Waxing (1 service)
- Eyebrow Waxing: $17-$35

---

## Next Steps / Roadmap

### Phase 1: Launch (Current)
- [x] Website prototype
- [x] Next.js full website with booking
- [x] React Native mobile app
- [x] Shared API architecture

### Phase 2: Production Setup
- [ ] Purchase hosting (Vercel recommended)
- [ ] Set up PostgreSQL database (Supabase free tier)
- [ ] Configure custom domain (fonsibycristal.com)
- [ ] Add Cristal's actual photos to replace placeholders
- [ ] Set up email service (SendGrid, Resend, or Gmail SMTP)
- [ ] Test booking flow end-to-end

### Phase 3: Mobile App Launch
- [ ] Set up Expo EAS for builds
- [ ] Apple Developer account ($99/year)
- [ ] Google Play Developer account ($25 one-time)
- [ ] Submit to app stores
- [ ] Set up push notifications

### Phase 4: Enhancements
- [ ] Payment integration (Stripe for deposits)
- [ ] SMS reminders (Twilio)
- [ ] Instagram feed integration
- [ ] Client loyalty program
- [ ] Online shop / product sales
- [ ] Admin dashboard for Cristal to manage appointments
- [ ] Review/testimonial system

---

## Business Information

**Fonsi by Cristal / Makeup by Cristal**
- Owner: Cristal Gutierrez
- Address: 6626 West Loop 1604 North, Suite 105, Ste. 39 & 41, San Antonio, TX 78254
- Phone: (210) 551-7742
- Hours: Tuesday-Saturday, 10:00 AM - 6:30 PM
- Closed: Sunday & Monday
- By appointment only
- Cancellation: 24-hour policy (50% charge within 24 hours)
- Instagram: @fonsibycristal
