# Fonsi by Cristal - Hair Salon & Makeup Studio

A luxury hair salon and makeup studio booking website built with Next.js, React, TypeScript, Tailwind CSS, and Prisma.

## Features

- Beautiful luxury dark theme with gold accents
- Multi-step appointment booking system
- Service catalog with all hair, bridal, makeup, and waxing services
- Responsive design for mobile and desktop
- Database-backed appointment management
- Email confirmations
- Availability management
- Professional gallery and portfolio pages

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with luxury dark theme
- **Prisma** - ORM & database management
- **SQLite** - Database (easily switch to PostgreSQL)
- **Zod** - Schema validation
- **Nodemailer** - Email sending
- **date-fns** - Date utilities
- **Lucide React** - Icons

## Project Structure

```
fonsi-website/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── appointments/route.ts
│   │   │   ├── services/route.ts
│   │   │   └── availability/route.ts
│   │   ├── about/page.tsx
│   │   ├── booking/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── services/page.tsx
│   │   ├── globals.css
│   │   └── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── BookingWidget.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── ServiceCard.tsx
│   ├── lib/
│   │   ├── db.ts
│   │   ├── email.ts
│   │   ├── services-data.ts
│   │   ├── utils.ts
│   │   └── validation.ts
│   └── types/
│       └── index.ts
├── prisma/
│   └── schema.prisma
├── seed.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your configuration:
   ```
   DATABASE_URL="file:./prisma/dev.db"
   NEXTAUTH_SECRET="your-secret-here"
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASSWORD="your-app-password"
   SMTP_FROM="noreply@fonsi-by-cristal.com"
   ```

3. **Set up the database**
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with initial data
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

## Database Schema

### Models

- **User** - Client information (email, name, phone)
- **Service** - Available services with pricing and duration
- **Appointment** - Booked appointments linked to user and service
- **BusinessHours** - Weekly business hours

## Customization

### Services
Edit `src/lib/services-data.ts` to add, remove, or modify services.

### Business Hours
Edit `src/lib/services-data.ts` in the seed function to change operating hours.

### Theme
Customize colors in `tailwind.config.ts`:
- Gold accent: `#c9a96e`
- Dark background: `#0a0a0a`
- Typography: Playfair Display (serif), Montserrat (sans)

## API Endpoints

- **GET /api/services** - Get all services
- **GET /api/appointments** - Get all appointments
- **POST /api/appointments** - Create new appointment
- **GET /api/availability** - Check availability for a date/service

## Email Configuration

The app uses Nodemailer for sending confirmation emails. Configure SMTP settings in `.env.local`:

### Gmail Setup
1. Generate an App Password: https://myaccount.google.com/apppasswords
2. Use the password in `SMTP_PASSWORD`
3. Set `SMTP_USER` to your Gmail address

### Other Email Providers
Update `SMTP_HOST`, `SMTP_PORT`, and authentication in `.env.local`

## Production Deployment

### Recommended Setup
1. Deploy to Vercel (native Next.js support)
2. Use a managed database (PostgreSQL recommended)
3. Configure environment variables in hosting dashboard
4. Run migrations in production

### Switch to PostgreSQL
Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Business Information

**Fonsi by Cristal**
- Address: 6626 West Loop 1604 North Suite 105, San Antonio, TX 78254
- Phone: (210) 551-7742
- Hours: Tuesday - Saturday, 10:00 AM - 6:30 PM
- Closed: Sunday & Monday
- Policy: By appointment only. 24-hour cancellation required (50% charge within 24 hours)

## Services Offered

### Hair
- Cuts, Fringe Trim, Shampoo & Blowouts, Styling
- Special Occasion Updo, Men Cuts, Perm
- Keratin Treatment, Color Services (Retouch, Full, Correction)
- Highlights, Ombre/Balayage, Toners, Treatments, Olaplex

### Bridal
- Bride Package ($350)
- Day of Wedding Party (upon request)
- On Site Services (upon request)

### Makeup
- MAC Full Face ($85)
- MAC Eye Only ($50)
- On-Site Services (consultation)

### Waxing
- Eyebrow Waxing ($17-35)

## License

Private - All rights reserved to Fonsi by Cristal

## Support

For questions or issues, contact:
- Phone: (210) 551-7742
- Location: 6626 West Loop 1604 North, Suite 105, San Antonio, TX 78254
