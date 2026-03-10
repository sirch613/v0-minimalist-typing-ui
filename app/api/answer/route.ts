import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ answer: "" })
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
            content: `Answer this in 2-3 short sentences, be direct and insightful: "${query}"`,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    })

    const data = await res.json()
    const answer = data.choices?.[0]?.message?.content || ""

    return NextResponse.json({ answer: answer.trim() })
  } catch {
    return NextResponse.json({ answer: "" })
  }
}
