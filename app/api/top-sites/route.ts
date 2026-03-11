import { NextResponse } from "next/server"

export const revalidate = 86400 // cache for 24 hours

const TOP_SITES = [
  "google.com", "youtube.com", "facebook.com", "instagram.com", "x.com",
  "wikipedia.org", "reddit.com", "tiktok.com", "amazon.com", "apple.com",
  "linkedin.com", "netflix.com", "microsoft.com", "twitch.tv", "discord.com",
  "spotify.com", "pinterest.com", "github.com", "nytimes.com", "cnn.com",
  "bbc.com", "espn.com", "walmart.com", "ebay.com", "craigslist.org",
  "zoom.us", "openai.com", "chatgpt.com", "adobe.com", "canva.com",
  "dropbox.com", "slack.com", "notion.so", "figma.com", "stripe.com",
  "shopify.com", "etsy.com", "airbnb.com", "uber.com", "lyft.com",
  "doordash.com", "grubhub.com", "yelp.com", "tripadvisor.com", "booking.com",
  "zillow.com", "realtor.com", "weather.com", "nasa.gov", "space.com",
  "imdb.com", "rottentomatoes.com", "hulu.com", "disneyplus.com", "hbomax.com",
  "soundcloud.com", "bandcamp.com", "medium.com", "substack.com", "wordpress.com",
  "tumblr.com", "flickr.com", "vimeo.com", "dailymotion.com", "archive.org",
  "stackoverflow.com", "npmjs.com", "vercel.com", "netlify.com", "heroku.com",
  "aws.amazon.com", "cloud.google.com", "azure.microsoft.com", "digitalocean.com", "cloudflare.com",
  "reuters.com", "apnews.com", "washingtonpost.com", "wsj.com", "bloomberg.com",
  "forbes.com", "businessinsider.com", "techcrunch.com", "theverge.com", "wired.com",
  "arstechnica.com", "engadget.com", "mashable.com", "vice.com", "vox.com",
  "nbc.com", "abc.com", "foxnews.com", "npr.org", "pbs.org",
  "coursera.org", "udemy.com", "khanacademy.org", "duolingo.com", "quizlet.com",
]

export async function GET() {
  const sites = TOP_SITES.map((domain) => ({
    name: domain.split(".")[0],
    domain,
    url: `https://${domain}`,
    favicon: `https://www.google.com/s2/favicons?sz=128&domain=${domain}`,
  }))

  return NextResponse.json({ sites })
}
