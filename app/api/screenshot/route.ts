import { NextRequest } from "next/server"
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs"
import { createHash } from "crypto"
import { join } from "path"

export const maxDuration = 30

const CACHE_DIR = join("/tmp", "screenshot-cache")

const ERROR_PATTERNS = [
  "site can't be reached",
  "you have been blocked",
  "access denied",
  "403 forbidden",
  "404 not found",
  "unable to access",
  "err_connection",
  "err_name_not",
  "this page isn't working",
  "refused to connect",
]

const BAD_CACHE = new Set<string>()

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  if (!url) return new Response(null, { status: 204 })

  const hash = createHash("md5").update(url).digest("hex")
  if (BAD_CACHE.has(hash)) return new Response(null, { status: 204 })

  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true })
  const cachePath = join(CACHE_DIR, `${hash}.jpg`)

  if (existsSync(cachePath)) {
    return new Response(readFileSync(cachePath), {
      headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=86400" },
    })
  }

  let browser
  try {
    const chromium = (await import("@sparticuz/chromium")).default
    const puppeteer = (await import("puppeteer-core")).default

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1280, height: 900 },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    })

    const page = await browser.newPage()

    const response = await page.goto(url, { waitUntil: "networkidle2", timeout: 12000 }).catch(() => null)

    const status = response?.status() ?? 0
    if (status >= 400 || status === 0) {
      await browser.close()
      BAD_CACHE.add(hash)
      return new Response(null, { status: 204 })
    }

    const bodyText = await page.evaluate(() =>
      document.body?.innerText?.toLowerCase().slice(0, 500) || ""
    ).catch(() => "")

    if (ERROR_PATTERNS.some((p) => bodyText.includes(p))) {
      await browser.close()
      BAD_CACHE.add(hash)
      return new Response(null, { status: 204 })
    }

    const screenshot = await page.screenshot({ type: "jpeg", quality: 75 })
    await browser.close()

    writeFileSync(cachePath, Buffer.from(screenshot))

    return new Response(screenshot, {
      headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=86400" },
    })
  } catch (err) {
    console.error("Screenshot error:", err)
    if (browser) await browser.close().catch(() => {})
    BAD_CACHE.add(hash)
    return new Response(null, { status: 204 })
  }
}
