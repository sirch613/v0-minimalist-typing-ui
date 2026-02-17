import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ suggestions: [] })
  }

  try {
    const res = await fetch(
      `https://api.search.brave.com/res/v1/suggest/search?q=${encodeURIComponent(query)}&count=6`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": process.env.BRAVE_API_KEY!,
        },
      }
    )

    if (!res.ok) {
      return NextResponse.json({ suggestions: [] })
    }

    const data = await res.json()

    const suggestions: string[] = []

    if (data.results) {
      for (const result of data.results) {
        if (result.query && suggestions.length < 6) {
          suggestions.push(result.query)
        }
      }
    }

    return NextResponse.json({ suggestions })
  } catch {
    return NextResponse.json({ suggestions: [] })
  }
}
