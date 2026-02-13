import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateTimeSlots } from '@/lib/utils'
import { parse } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateStr = searchParams.get('date')
    const serviceId = searchParams.get('serviceId')

    if (!dateStr || !serviceId) {
      return NextResponse.json(
        { error: 'Missing date or serviceId parameter' },
        { status: 400 }
      )
    }

    // Fetch service to get duration
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Parse the date
    const appointmentDate = parse(dateStr, 'yyyy-MM-dd', new Date())

    // Get business hours for the day
    const dayOfWeek = appointmentDate.getDay()
    const businessHours = await prisma.businessHours.findUnique({
      where: { dayOfWeek },
    })

    if (!businessHours || businessHours.isClosed) {
      return NextResponse.json({ slots: [] })
    }

    // Get existing appointments for the date
    const startOfDay = new Date(appointmentDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(appointmentDate)
    endOfDay.setHours(23, 59, 59, 999)

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          notIn: ['cancelled'],
        },
      },
    })

    // Extract booked times
    const bookedTimes = existingAppointments.map((apt) => {
      const hours = String(apt.date.getHours()).padStart(2, '0')
      const minutes = String(apt.date.getMinutes()).padStart(2, '0')
      return `${hours}:${minutes}`
    })

    // Generate available slots
    const slots = generateTimeSlots(
      businessHours.openTime,
      businessHours.closeTime,
      30,
      bookedTimes
    )

    return NextResponse.json({ slots })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}
