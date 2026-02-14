export const BUSINESS = {
  name: 'Fonsi by Cristal',
  phone: '(210) 551-7742',
  phoneTel: '2105517742',
  address: {
    street: '6626 West Loop 1604 North',
    suite: 'Suite 105',
    city: 'San Antonio',
    state: 'TX',
    zip: '78254',
    detail: 'Suites 39 & 41',
    full: '6626 West Loop 1604 North, Suite 105, San Antonio, TX 78254',
    mapQuery: '6626+W+Loop+1604+N+Suite+105,+San+Antonio,+TX+78254',
  },
  hours: {
    open: 'Tuesday \u2013 Saturday',
    openShort: 'Tue \u2013 Sat',
    time: '10 AM \u2013 6:30 PM',
    closed: 'Sunday & Monday',
    closedShort: 'Sun & Mon',
    note: 'By appointment only',
  },
  social: {
    instagram: 'https://www.instagram.com/fonsi_by_cristal/',
    instagramHandle: '@fonsi_by_cristal',
  },
  cancellation: '24-hour notice required. 50% charge within 24 hours.',
} as const;
