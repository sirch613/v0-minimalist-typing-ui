import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  if (!url) return new Response("Missing url", { status: 400 })

  try {
    const parsed = new URL(url)

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: parsed.origin,
      },
      redirect: "follow",
    })

    let html = await res.text()

    // Inject <base> so relative URLs resolve to the original site
    if (html.includes("<head")) {
      html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${parsed.origin}/">`)
    } else if (html.includes("<html")) {
      html = html.replace(/<html([^>]*)>/i, `<html$1><head><base href="${parsed.origin}/"></head>`)
    }

    // Disable any JS that might redirect or break the iframe
    html = html.replace(
      "</head>",
      `<style>
        * { -webkit-text-size-adjust: 100%; }
        body { overflow: auto !important; }
        [class*="cookie"], [class*="consent"], [class*="banner"],
        [id*="cookie"], [id*="consent"], [class*="popup"],
        [class*="overlay"], [class*="modal"] { display: none !important; }
      </style></head>`
    )

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    })
  } catch {
    return new Response(
      `<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:system-ui;color:#ccc;font-size:12px;background:#f5f5f5;">Could not load</body></html>`,
      { headers: { "Content-Type": "text/html" } }
    )
  }
}
