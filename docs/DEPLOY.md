# Deployment Checklist

## Website (Vercel)
1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL` (use Vercel Postgres or PlanetScale)
   - `NEXTAUTH_SECRET` (generate: `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (production URL)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`
4. Deploy
5. Run `npx prisma db push` against production DB
6. Run `npx prisma db seed` to populate services
7. Test booking flow end-to-end
8. Verify email confirmation arrives

## App (EAS)
1. Run `eas login`
2. Run `eas build:configure` (sets projectId in app.config.ts)
3. Update `EXPO_PUBLIC_API_URL` to production website URL
4. Run `eas build --platform ios --profile production`
5. Run `eas build --platform android --profile production`
6. Submit to TestFlight / Play Store internal testing
7. Test on real devices

## Manual Steps Required
- [ ] Create a 1200x630 OG image and place at `fonsi-website/public/og-image.jpg`
- [ ] Fill in EAS submit credentials in `fonsi-app/eas.json` (Apple ID, team ID, etc.)
- [ ] Configure Gmail App Password or SMTP provider for email delivery
- [ ] Set up a production database (migrate from SQLite to Postgres for Vercel)
