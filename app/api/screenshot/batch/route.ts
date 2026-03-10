import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { urls } = await request.json()

  if (!urls || !Array.isArray(urls)) {
    return NextResponse.json({ error: "Missing urls" }, { status: 400 })
  }

  // Fire all screenshot requests in parallel — don't wait
  const origin = request.nextUrl.origin
  urls.forEach((url: string) => {
    fetch(`${origin}/api/screenshot?url=${encodeURIComponent(url)}`).catch(() => {})
  })

  return NextResponse.json({ started: urls.length })
}
