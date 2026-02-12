# Quick Reference Guide

## Running the Project

### Development
```bash
npm run dev
# http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

### Database
```bash
npm run db:studio        # Open Prisma Studio
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed data
npm run db:push          # Push schema
```

## Project Paths

```
/sessions/funny-vigilant-turing/mnt/Website\ for\ Cristal/fonsi-website/
├── src/app/
│   ├── page.tsx              # /
│   ├── services/page.tsx     # /services
│   ├── booking/page.tsx      # /booking
│   ├── contact/page.tsx      # /contact
│   ├── gallery/page.tsx      # /gallery
│   ├── about/page.tsx        # /about
│   ├── api/services/route.ts
│   ├── api/appointments/route.ts
│   └── api/availability/route.ts
├── src/components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── BookingWidget.tsx
│   └── ServiceCard.tsx
├── src/lib/
│   ├── db.ts
│   ├── email.ts
│   ├── services-data.ts
│   ├── utils.ts
│   └── validation.ts
├── prisma/schema.prisma
└── seed.ts
```

## Common Edits

### Update Business Hours
File: `seed.ts`
```typescript
{ dayOfWeek: 2, openTime: '10:00', closeTime: '18:30', isClosed: false }
// dayOfWeek: 0=Sun, 1=Mon, 2=Tue... 6=Sat
```

### Add Service
File: `src/lib/services-data.ts`
```typescript
{
  category: 'Hair',
  name: 'Service Name',
  description: 'Description',
  priceMin: 50,
  priceMax: 100,
  duration: 60,
}
```

### Update Phone Number
Files:
- `src/components/Footer.tsx` (line ~43)
- `src/app/contact/page.tsx` (line ~26)
- `src/app/booking/page.tsx` (line ~54)

### Update Address
Files:
- `src/components/Footer.tsx` (line ~48-51)
- `src/app/contact/page.tsx` (line ~23-27)

### Change Colors
File: `tailwind.config.ts`
```typescript
colors: {
  gold: { 500: '#c9a96e' },
  dark: { 900: '#0a0a0a' },
}
```

## API Endpoints Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/services` | Get all services |
| GET | `/api/appointments` | Get all appointments |
| POST | `/api/appointments` | Create appointment |
| GET | `/api/availability?date=2024-02-15&serviceId=123` | Get time slots |

## Environment Variables

```bash
# Database
DATABASE_URL="file:./prisma/dev.db"

# Auth (keep these secure in production)
NEXTAUTH_SECRET="random-secret-string"
NEXTAUTH_URL="http://localhost:3000"

# Email (optional for development)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@fonsi-by-cristal.com"
```

## Key Files Explained

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout, fonts, metadata |
| `src/app/globals.css` | Global styles, custom utilities |
| `src/components/BookingWidget.tsx` | Multi-step booking form |
| `src/lib/services-data.ts` | All 29 services defined here |
| `src/lib/db.ts` | Prisma client singleton |
| `src/lib/email.ts` | Email template builder |
| `src/lib/validation.ts` | Zod schemas for form validation |
| `seed.ts` | Database initialization |
| `prisma/schema.prisma` | Database schema |
| `tailwind.config.ts` | Theme colors and fonts |

## Deployment Checklist

- [ ] Update `.env` variables
- [ ] Run `npm run build` (check for errors)
- [ ] Update NEXTAUTH_SECRET (generate: `openssl rand -base64 32`)
- [ ] Update NEXTAUTH_URL to production domain
- [ ] Configure SMTP for emails
- [ ] Test booking flow
- [ ] Update business info if needed
- [ ] Add real gallery images
- [ ] Deploy to Vercel/hosting

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `npm run dev -- -p 3001` |
| Database error | `npm run prisma:migrate` |
| Build fails | `rm -rf .next && npm run build` |
| Email not sending | Check SMTP in `.env.local` |
| Module not found | `npm install` |

## Important Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Prisma commands
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run db:push
npm run db:studio
```

## Design System

### Colors
- **Gold**: `#c9a96e` (primary accent)
- **Dark**: `#0a0a0a` (background)
- **Text**: `#e5e7eb` to `#9ca3af` (gray scale)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Montserrat (sans-serif)

### Spacing
- Use Tailwind scale: `p-4`, `py-8`, `gap-6`
- Section padding: `py-12 md:py-20`

### Components
- Buttons: `bg-gold-500 text-dark-900 px-6 py-3 rounded`
- Cards: `bg-dark-800 border border-gold-500/30 rounded-lg p-6`
- Hover: `hover:border-gold-500 hover:border-opacity-60 transition`

## Git Commands (After Setup)

```bash
# First time
git init
git add .
git commit -m "Initial commit: Fonsi by Cristal website"

# Regular workflow
git add .
git commit -m "Update: describe changes"
git push origin main
```

## Database Schema Quick View

**Service**
- id, category, name, description, priceMin, priceMax, duration, createdAt, updatedAt

**User**
- id, email (unique), name, phone, createdAt, updatedAt

**Appointment**
- id, date, status, notes, userId, serviceId, createdAt, updatedAt

**BusinessHours**
- id, dayOfWeek (unique), openTime, closeTime, isClosed, createdAt, updatedAt

## Contact Information (Embedded in Site)

**Address**: 6626 West Loop 1604 North Suite 105, San Antonio, TX 78254
**Phone**: (210) 551-7742
**Hours**: Tue-Sat 10:00 AM - 6:30 PM
**Closed**: Sunday & Monday
**Policy**: By appointment only, 24-hour cancellation (50% charge within 24 hours)

## Browser Support

- Chrome/Edge: Latest
- Firefox: Latest
- Safari: Latest
- Mobile browsers: iOS Safari, Chrome Mobile

## Performance Tips

1. Optimize gallery images (use Next.js Image component)
2. Enable database indexing for date queries
3. Cache API responses on client
4. Compress email images
5. Monitor database query performance

## Security Reminders

- Never commit `.env.local`
- Use strong NEXTAUTH_SECRET in production
- Validate all form inputs (already done with Zod)
- Use HTTPS in production
- Keep dependencies updated
- Review API endpoints for authorization
- Hide sensitive business data from client logs

## Support

**For Code Issues**: Review README.md and SETUP.md
**For Business Questions**: Call (210) 551-7742

---

Last Updated: February 11, 2026
