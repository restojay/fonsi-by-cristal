# Fonsi by Cristal - Setup Guide

## Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env.local
```

For development with SQLite (default), just update email settings if you want to test email:
```
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="dev-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@fonsi-by-cristal.com"
```

### Step 3: Initialize Database
```bash
npm run prisma:migrate
npm run prisma:seed
```

### Step 4: Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## Email Setup (Optional for Development)

To test confirmation emails:

### Gmail Setup
1. Enable 2-factor authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer" (or your device)
4. Copy the generated 16-character password
5. Update `.env.local`:
   ```
   SMTP_USER="your-email@gmail.com"
   SMTP_PASSWORD="xxxxx xxxx xxxx xxxx"
   ```

### Other Email Providers
- **SendGrid**: Use `smtp.sendgrid.net` port 587
- **Mailgun**: Use `smtp.mailgun.org` port 587
- **AWS SES**: Use `email-smtp.region.amazonaws.com` port 587

## Database Setup

### Using SQLite (Default)
Perfect for development. Database file: `prisma/dev.db`

### Switching to PostgreSQL

1. **Install PostgreSQL** locally or use a service:
   - Local: https://www.postgresql.org/download/
   - Cloud: Heroku, Supabase, Railway, etc.

2. **Update `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Update `.env.local`:**
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/fonsi"
   ```

4. **Run migrations:**
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```

## File Structure Overview

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── about/page.tsx     # About Cristal
│   ├── services/page.tsx  # Services catalog
│   ├── booking/page.tsx   # Booking interface
│   ├── contact/page.tsx   # Contact & FAQ
│   ├── gallery/page.tsx   # Portfolio gallery
│   └── api/               # API routes
│       ├── services/      # GET services
│       ├── appointments/  # POST/GET appointments
│       └── availability/  # GET time slots
├── components/            # React components
│   ├── Navbar.tsx         # Navigation
│   ├── Footer.tsx         # Footer
│   ├── BookingWidget.tsx  # Multi-step booking
│   └── ServiceCard.tsx    # Service display
├── lib/                   # Utilities & helpers
│   ├── db.ts             # Prisma client
│   ├── email.ts          # Email templates
│   ├── services-data.ts  # All service definitions
│   ├── utils.ts          # Helper functions
│   └── validation.ts     # Zod schemas
└── types/                # TypeScript definitions
    └── index.ts
```

## Customization Guide

### Add a New Service
Edit `src/lib/services-data.ts`:
```typescript
{
  category: 'Hair',
  name: 'New Service',
  description: 'Service description',
  priceMin: 50,
  priceMax: 100,
  duration: 60, // minutes
}
```

### Change Business Hours
Edit `seed.ts` in the `businessHours` array:
```typescript
{ dayOfWeek: 2, openTime: '10:00', closeTime: '18:30', isClosed: false }, // Tuesday
```
Days: 0=Sunday, 1=Monday, 2=Tuesday... 6=Saturday

### Update Theme Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  gold: {
    500: '#c9a96e',  // Primary gold accent
    // ... other shades
  },
  dark: {
    900: '#0a0a0a',  // Dark background
    // ... other shades
  },
}
```

### Change Contact Information
Update these files:
- `src/components/Footer.tsx` - Footer contact
- `src/app/contact/page.tsx` - Contact page
- `src/app/booking/page.tsx` - Booking info
- Business hours in `seed.ts`

## Common Tasks

### View Database
```bash
npm run db:studio
```
Opens Prisma Studio at http://localhost:5555

### Reset Database
```bash
# Delete all data (SQLite)
rm prisma/dev.db
npm run prisma:migrate
npm run prisma:seed
```

### Build for Production
```bash
npm run build
npm start
```

### Run Linter
```bash
npm run lint
```

## Deployment Checklist

- [ ] Update environment variables (production database, SMTP, secrets)
- [ ] Generate strong NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Update NEXTAUTH_URL to production domain
- [ ] Run database migrations on production
- [ ] Test email sending with real SMTP
- [ ] Update business info and hours if needed
- [ ] Add real gallery images
- [ ] Configure domain and SSL
- [ ] Set up monitoring/error tracking
- [ ] Create database backups

## Deployment Recommendations

### Vercel (Recommended for Next.js)
1. Push code to GitHub
2. Import project on Vercel
3. Set environment variables
4. Deploy - done!

### Other Platforms
- **Netlify**: Requires serverless functions
- **Railway**: Simple PostgreSQL + Node setup
- **Heroku**: Simple deployment (free tier limited)
- **AWS/GCP/Azure**: More complex setup

## Support Resources

- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs
- Zod Validation: https://zod.dev

## Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Database errors
```bash
npm run prisma:migrate
```

### Build errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Email not sending
- Check SMTP credentials in `.env.local`
- Verify firewall/port access
- Check spam folder
- Review server logs

## Questions?

For the Fonsi by Cristal business:
- Phone: (210) 551-7742
- Address: 6626 West Loop 1604 North Suite 105, San Antonio, TX 78254

For technical support with the website:
- Review README.md
- Check Next.js and Prisma documentation
- Review code comments
