import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ suggestions: [] })
  }

  try {
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `Here's the query "${query}". Give me 5 brilliant search suggestions that are super smart. Return ONLY the 5 suggestions, one per line, no numbering, no extra text.`,
    })

    const suggestions = text
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .slice(0, 5)

    return NextResponse.json({ suggestions })
  } catch {
    return NextResponse.json({ suggestions: [] })
  }
}
