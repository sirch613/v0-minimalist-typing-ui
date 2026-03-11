import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  const query = request.nextUrl.searchParams.get("q")

  if (!url || !query) {
    return NextResponse.json({ answer: "" })
  }

  try {
    // Step 1: Scrape the page with Firecrawl (with timeout)
    let pageText = ""
    try {
      const scrapeRes = await fetch("https://api.firecrawl.dev/v2/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        },
        body: JSON.stringify({
          url,
          formats: ["markdown"],
        }),
        signal: AbortSignal.timeout(8000),
      })
      const scrapeData = await scrapeRes.json()
      pageText = scrapeData.data?.markdown || scrapeData.data?.content || ""
    } catch {
      // Firecrawl failed — try direct fetch as fallback
    }

    if (!pageText) {
      try {
        const directRes = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; SirchBot/1.0)" },
          signal: AbortSignal.timeout(6000),
        })
        const html = await directRes.text()
        // Strip HTML tags to get raw text
        pageText = html
          .replace(/<script[\s\S]*?<\/script>/gi, "")
          .replace(/<style[\s\S]*?<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      } catch {
        // Direct fetch also failed
      }
    }

    if (!pageText) {
      return NextResponse.json({ answer: "" })
    }

    // Truncate to avoid token limits
    const truncated = pageText.slice(0, 4000)

    // Step 2: Send to Mercury AI with the query
    const aiRes = await fetch("https://api.inceptionlabs.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MERCURY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mercury-2",
        messages: [
          {
            role: "user",
            content: `A user asked this question: "${query}"\n\nWhat does this text say in response to the question? Write about 50 words. Include anything that makes this site unique or stand out.\n\n${truncated}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 400,
      }),
    })

    const aiData = await aiRes.json()
    const answer = aiData.choices?.[0]?.message?.content || ""

    return NextResponse.json({ answer: answer.trim() })
  } catch {
    return NextResponse.json({ answer: "" })
  }
}
