import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [] })
  }

  try {
    const res = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.EXA_API_KEY || "",
      },
      body: JSON.stringify({
        query: query.trim(),
        numResults: 10,
        type: "auto",
        contents: {
          text: {
            maxCharacters: 300,
          },
        },
      }),
    })

    const data = await res.json()
    console.log("[v0] Exa response status:", res.status)
    console.log("[v0] Exa results count:", data.results?.length)
    console.log("[v0] Exa first result:", JSON.stringify(data.results?.[0], null, 2))

    const results = (data.results || []).slice(0, 10).map((r: { url?: string; title?: string; text?: string; favicon?: string }) => {
      const domain = r.url ? new URL(r.url).hostname : ""
      return {
        name: r.title || domain,
        favicon: r.favicon || `https://logo.clearbit.com/${domain}`,
        url: r.url || "",
        desc: r.text?.trim() || "",
      }
    })

    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ results: [] })
  }
}
