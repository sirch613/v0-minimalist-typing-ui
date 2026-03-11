import { NextResponse } from "next/server"

export const revalidate = 300 // cache for 5 minutes

export async function GET() {
  try {
    // Google Trends daily trends RSS feed (US)
    const res = await fetch(
      "https://trends.google.com/trending/rss?geo=US",
      { next: { revalidate: 300 } }
    )
    const xml = await res.text()

    // Extract titles from <title> tags inside <item> elements
    const items = xml.split("<item>").slice(1)
    const trends: string[] = []
    for (const item of items) {
      const match = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)
        || item.match(/<title>(.*?)<\/title>/)
      if (match && match[1]) {
        trends.push(match[1].trim())
      }
      if (trends.length >= 20) break
    }

    if (trends.length > 0) {
      return NextResponse.json({ trends })
    }

    // Fallback: try Google Trends autocomplete
    const fallbackRes = await fetch(
      "https://trends.google.com/trends/api/dailytrends?hl=en-US&tz=-300&geo=US&ns=15"
    )
    const fallbackText = await fallbackRes.text()
    // Remove )]}' prefix that Google adds
    const clean = fallbackText.replace(/^\)\]\}'/, "")
    const data = JSON.parse(clean)
    const stories = data?.default?.trendingSearchesDays?.[0]?.trendingSearches || []
    const fallbackTrends = stories.map((s: { title?: { query?: string } }) => s.title?.query).filter(Boolean).slice(0, 20)

    return NextResponse.json({ trends: fallbackTrends.length > 0 ? fallbackTrends : ["trending"] })
  } catch {
    return NextResponse.json({ trends: ["trending"] })
  }
}
