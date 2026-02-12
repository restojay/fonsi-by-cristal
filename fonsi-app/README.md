# Fonsi by Cristal - Mobile App

React Native (Expo) companion mobile app for Fonsi by Cristal hair salon and makeup studio in San Antonio, TX.

## Overview

This is a full-featured salon booking mobile application that allows clients to:
- Browse salon services (Hair, Bridal, Makeup, Waxing)
- View detailed service information with pricing
- Book appointments with a 5-step guided booking flow
- Select dates (disabled Sundays/Mondays) and available time slots
- Manage their profile and appointment history
- Receive appointment confirmations

## Project Structure

```
fonsi-app/
├── app/                           # Expo Router pages
│   ├── _layout.tsx               # Root layout with navigation
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── _layout.tsx          # Tab layout
│   │   ├── index.tsx            # Home screen
│   │   ├── services.tsx         # Services directory
│   │   ├── book.tsx             # 5-step booking flow
│   │   └── profile.tsx          # Profile/account screen
│   └── appointment/
│       └── [id].tsx             # Appointment detail screen
├── src/
│   ├── api/
│   │   └── client.ts            # API client with fallback services
│   ├── components/
│   │   ├── Header.tsx           # Custom header
│   │   ├── ServiceCard.tsx      # Service card component
│   │   ├── TimeSlotPicker.tsx   # Time slot grid
│   │   └── AppointmentCard.tsx  # Appointment display card
│   ├── constants/
│   │   ├── theme.ts             # Design tokens & theme
│   │   └── services.ts          # Hardcoded services data
│   ├── store/
│   │   ├── bookingStore.ts      # Zustand booking state
│   │   └── appointmentStore.ts  # Zustand appointments state
│   └── types/
│       └── index.ts             # TypeScript interfaces
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── README.md                     # This file
```

## Features

### 1. Home Screen (index.tsx)
- Welcome header with salon branding
- Quick-book call-to-action button
- Upcoming appointment preview
- Featured services (Hair category)
- Contact information and business hours

### 2. Services Screen (services.tsx)
- Browse services by category (Hair, Bridal, Makeup, Waxing)
- Category tabs for filtering
- Service cards with pricing and descriptions
- Quick-book buttons on each service
- All 25 salon services (18 Hair, 3 Bridal, 3 Makeup, 1 Waxing)

### 3. Booking Screen (book.tsx)
Five-step guided booking flow:

**Step 1: Service Selection**
- Searchable list of all services
- Service details with price range and duration

**Step 2: Date Selection**
- Calendar picker (react-native-calendars)
- Disabled dates: Sundays, Mondays, and past dates
- Visual selection of chosen date

**Step 3: Time Selection**
- 30-minute time slots (10:00 AM - 6:30 PM)
- Grid layout showing available times
- Visual feedback on selected time

**Step 4: Contact Information**
- Form fields: First name, Last name, Email, Phone
- Form validation with error messages
- Pre-fills from profile if available

**Step 5: Confirmation**
- Review all booking details
- Service info, date/time, client info
- Submit button to create appointment
- Success alert with confirmation

### 4. Profile Screen (profile.tsx)
- Client avatar and profile information
- Edit profile section
- Upcoming appointments list
- Past appointments history
- Settings menu
- About section with salon details
- Sign out button

### 5. Appointment Detail Screen (appointment/[id].tsx)
- Full appointment information
- Service details and pricing
- Client information
- Reschedule option
- Cancel appointment option
- Salon contact information

## Technology Stack

### Core
- **React Native** - Native mobile framework
- **Expo** - React Native development platform
- **Expo Router** - File-based routing
- **TypeScript** - Type safety

### Navigation
- **@react-navigation/bottom-tabs** - Tab navigation
- **@react-navigation/native-stack** - Stack navigation
- **expo-router** - File-based routing

### State Management
- **Zustand** - Lightweight state management
- Built-in persist middleware for localStorage

### UI & Styling
- **react-native-calendars** - Date picker calendar
- **date-fns** - Date manipulation
- **React Native SafeAreaView** - Safe layout
- Custom theme system with design tokens

### API
- **Axios** - HTTP client
- Automatic fallback to hardcoded services if API unavailable
- Configurable API base URL via environment variables

### Notifications
- **expo-notifications** - Push notifications support

## Design System

### Colors
- **Primary Gold**: #c9a96e
- **Background**: #0a0a0a (nearly black)
- **Secondary**: #1a1a1a (dark gray)
- **Text**: #ffffff (white)
- **Accent**: #c9a96e (gold)

### Typography
- **Headers**: Georgia, serif (elegant)
- **Body**: System sans-serif (clean)
- **Font Sizes**: xs (12px) to 4xl (32px)

### Spacing & Borders
- Consistent spacing scale (4px to 48px)
- Border radius: sm to full (4px to 9999px)
- Shadow system: sm, md, lg, xl

## Installation & Setup

### Prerequisites
- Node.js 14+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS (Mac) or Android development environment

### Installation

```bash
# Install dependencies
npm install

# Or with yarn
yarn install

# Start development server
npm start

# For iOS (requires Mac)
npm run ios

# For Android
npm run android

# For web
npm run web
```

## Environment Configuration

Create a `.env` file in the root directory:

```env
# API Configuration
EXPO_PUBLIC_API_URL=https://api.fonsibycrystal.com
```

The app will fall back to hardcoded services if the API is unavailable.

## API Integration

The app communicates with a backend API for:
- **GET /api/services** - Fetch all services
- **GET /api/services/:id** - Get service details
- **GET /api/availability** - Get available time slots
- **POST /api/appointments** - Create new appointment
- **GET /api/appointments/:id** - Get appointment details
- **PUT /api/appointments/:id** - Update appointment
- **DELETE /api/appointments/:id** - Cancel appointment

See `src/api/client.ts` for full API client implementation.

## Services Data

All 25 salon services are defined in `src/constants/services.ts`:

### Hair Services (18)
Blowout, Bridal Blowout, Hair Cut, Hair Cut & Color, Root Touch Up, Full Head Color, Highlights/Balayage, Treatment, Extensions, Ombré/Balayage, Perm, Wash & Style, Updo, Braids, Relaxer, Trim, Consultation, Special Event Hair

### Bridal Services (3)
Bridal Hair & Makeup, Bridal Hair Only, Bridal Trial

### Makeup Services (3)
Makeup Application, Eye Makeup, Special Event Makeup

### Waxing Services (1)
Waxing

## State Management

### Booking Store (Zustand)
Manages the 5-step booking flow:
- Selected service, date, time
- Client contact information
- Current step
- Validation helpers

### Appointment Store (Zustand)
Manages appointment list:
- All appointments
- Upcoming appointments filter
- Past appointments filter
- Add/update/remove actions

## Business Information

**Fonsi by Cristal**
- Address: 6626 West Loop 1604 North suite 105, San Antonio, TX 78254
- Phone: (210) 551-7742
- Hours: Tuesday - Saturday, 10:00 AM - 6:30 PM
- Closed: Sunday & Monday
- By appointment only

## Development

### File Structure Guidelines
- Components in `src/components/`
- State stores in `src/store/`
- API logic in `src/api/`
- Constants/theme in `src/constants/`
- Types in `src/types/`
- Screens in `app/` (Expo Router pages)

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Zustand for state management
- StyleSheet for styling
- Consistent naming conventions

### Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for web
npm run build:web
```

See [EAS documentation](https://docs.expo.dev/eas/) for more info.

## Future Enhancements

- Push notifications for appointment reminders
- Email/SMS confirmations
- Payment integration
- Review/ratings system
- Loyalty rewards program
- Photo gallery of services
- Staff selection
- Appointment rescheduling from app
- User authentication
- Real-time availability updates

## Support

For issues or questions about the app, contact:
- Phone: (210) 551-7742
- Email: contact@fonsibycrystal.com

## License

Copyright © 2024 Fonsi by Cristal. All rights reserved.
