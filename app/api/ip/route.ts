import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded 
    ? forwarded.split(',')[0]
    : request.headers.get('x-real-ip') || request.ip

  return NextResponse.json({
    ip: ip || 'unknown',
    headers: {
      forwarded: forwarded || null,
      realIp: request.headers.get('x-real-ip') || null,
      cfConnectingIp: request.headers.get('cf-connecting-ip') || null,
    }
  })
}
