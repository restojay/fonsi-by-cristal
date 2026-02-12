import { NextRequest, NextResponse } from 'next/server'
import { servicesData } from '@/lib/services-data'

export async function GET(request: NextRequest) {
  const services = servicesData.map((service, index) => ({
    id: `service-${index + 1}`,
    ...service,
  }))

  return NextResponse.json(services)
}
