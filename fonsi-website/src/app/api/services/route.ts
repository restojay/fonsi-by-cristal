import { NextResponse } from 'next/server'
import { servicesData } from '@/lib/services-data'

export async function GET() {
  const services = servicesData.map((service, index) => ({
    id: `service-${index + 1}`,
    ...service,
  }))

  return NextResponse.json(services)
}
