import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ data: { message: 'hello from front api' } })
}

