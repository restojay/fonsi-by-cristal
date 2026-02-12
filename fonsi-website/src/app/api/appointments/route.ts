import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { bookingSchema } from '@/lib/validation'
import { sendConfirmationEmail } from '@/lib/email'
import { format } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        user: true,
        service: true,
      },
      orderBy: {
        date: 'asc',
      },
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validated = bookingSchema.parse(body)

    // Parse date and time
    const appointmentDate = new Date(`${validated.date}T${validated.time}:00`)

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: validated.email,
          name: validated.name,
          phone: validated.phone,
        },
      })
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        date: appointmentDate,
        status: 'pending',
        notes: validated.notes,
        userId: user.id,
        serviceId: validated.serviceId,
      },
      include: {
        service: true,
        user: true,
      },
    })

    // Send confirmation email
    try {
      await sendConfirmationEmail({
        email: validated.email,
        name: validated.name,
        serviceName: appointment.service.name,
        date: format(appointmentDate, 'MMMM d, yyyy'),
        time: format(appointmentDate, 'h:mm a'),
        appointmentId: appointment.id,
      })
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Don't fail the entire request if email fails
    }

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}
