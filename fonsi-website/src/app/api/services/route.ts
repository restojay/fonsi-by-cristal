import { NextResponse } from 'next/server'
import { servicesData } from '@/lib/services-data'

export async function GET() {
  return NextResponse.json(servicesData)
}
