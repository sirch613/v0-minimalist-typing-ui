import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")

  console.log("[v0] Suggest API called with query:", query)
  console.log("[v0] GROQ_API_KEY exists:", !!process.env.GROQ_API_KEY)

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ suggestions: [] })
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
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
    console.log("[v0] Groq raw response:", JSON.stringify(data, null, 2))

    const text = data.choices?.[0]?.message?.content || ""

    const suggestions = text
      .split("\n")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0)
      .slice(0, 5)

    console.log("[v0] Parsed suggestions:", suggestions)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.log("[v0] Groq error:", error)
    return NextResponse.json({ suggestions: [] })
  }
}
