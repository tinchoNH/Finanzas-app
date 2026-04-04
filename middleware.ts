import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// El auth se maneja client-side con AuthGuard
export async function middleware(request: NextRequest) {
  return NextResponse.next()
}
