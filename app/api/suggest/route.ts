import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ suggestions: [] })
  }

  try {
    const res = await fetch("https://api.inceptionlabs.ai/v1/chat/completions", {
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
            content: `Here's the query "${query}". Give me 5 brilliant search suggestions that are super smart. Return ONLY the 5 suggestions, one per line, no numbering, no extra text.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    })

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content || ""

    const suggestions = text
      .split("\n")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0)
      .slice(0, 5)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.log("[suggest] Mercury error:", error)
    return NextResponse.json({ suggestions: [] })
  }
}
