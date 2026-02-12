import { PrismaClient } from '@prisma/client'
import { servicesData } from './src/lib/services-data'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Starting database seed...')

    // Clear existing data
    await prisma.appointment.deleteMany()
    await prisma.service.deleteMany()
    await prisma.user.deleteMany()
    await prisma.businessHours.deleteMany()

    // Seed services
    console.log('Seeding services...')
    for (const service of servicesData) {
      await prisma.service.create({
        data: service,
      })
    }
    console.log(`Created ${servicesData.length} services`)

    // Seed business hours (Tue-Sat 10am-6:30pm, Sun & Mon closed)
    console.log('Seeding business hours...')
    const businessHours = [
      { dayOfWeek: 0, openTime: '00:00', closeTime: '00:00', isClosed: true }, // Sunday
      { dayOfWeek: 1, openTime: '00:00', closeTime: '00:00', isClosed: true }, // Monday
      { dayOfWeek: 2, openTime: '10:00', closeTime: '18:30', isClosed: false }, // Tuesday
      { dayOfWeek: 3, openTime: '10:00', closeTime: '18:30', isClosed: false }, // Wednesday
      { dayOfWeek: 4, openTime: '10:00', closeTime: '18:30', isClosed: false }, // Thursday
      { dayOfWeek: 5, openTime: '10:00', closeTime: '18:30', isClosed: false }, // Friday
      { dayOfWeek: 6, openTime: '10:00', closeTime: '18:30', isClosed: false }, // Saturday
    ]

    for (const hours of businessHours) {
      await prisma.businessHours.create({
        data: hours,
      })
    }
    console.log('Created business hours')

    console.log('Database seed completed successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
