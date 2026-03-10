import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")
  const offset = parseInt(request.nextUrl.searchParams.get("offset") || "0", 10)

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [] })
  }

  try {
    const body: Record<string, unknown> = {
      query: query.trim(),
      numResults: 20,
      type: "auto",
      contents: {
        text: {
          maxCharacters: 300,
        },
      },
    }

    if (offset > 0) {
      body.start = offset
    }

    const res = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.EXA_API_KEY || "",
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    const results = (data.results || []).slice(0, 20).map((r: { url?: string; title?: string; text?: string; favicon?: string; image?: string }) => {
      const domain = r.url ? new URL(r.url).hostname?.replace("www.", "") : ""
      const favicon =
        r.favicon ||
        (domain ? `https://www.google.com/s2/favicons?sz=128&domain=${domain}` : "")
      return {
        name: r.title || domain,
        favicon,
        url: r.url || "",
        desc: r.text?.trim() || "",
        image: r.image || "",
      }
    })

    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ results: [] })
  }
}
