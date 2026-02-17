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
    console.log("[v0] Brave suggest response:", JSON.stringify(data, null, 2))

    const suggestions: string[] = []

    // Brave suggest API can return results in different fields
    if (data.results) {
      for (const result of data.results) {
        if (result.query && suggestions.length < 6) {
          suggestions.push(result.query)
        }
      }
    }

    // Also check the "query" -> "suggestions" path
    if (suggestions.length === 0 && data.query?.suggestions) {
      for (const s of data.query.suggestions) {
        if (typeof s === "string" && suggestions.length < 6) {
          suggestions.push(s)
        }
      }
    }

    // Also check if it's an OpenSearch-style array response
    if (suggestions.length === 0 && Array.isArray(data) && data.length >= 2) {
      const items = data[1]
      if (Array.isArray(items)) {
        for (const item of items) {
          if (typeof item === "string" && suggestions.length < 6) {
            suggestions.push(item)
          }
        }
      }
    }

    return NextResponse.json({ suggestions })
  } catch {
    return NextResponse.json({ suggestions: [] })
  }
}
