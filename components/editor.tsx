"use client"

import { useRef, useEffect, useState, useCallback } from "react"

const CARD_WIDTH = 300
const CARD_GAP = 24
const DOT_COLORS = [
  "#f0c050", "#e06050", "#50b0e0", "#60c060", "#b060d0",
  "#f08040", "#d05090", "#40b0a0", "#7080e0", "#c0a030",
]

interface SearchResult {
  name: string
  favicon: string
  url: string
  desc: string
  image: string
}

export function Editor() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [visible, setVisible] = useState(false)
  const [resultsVisible, setResultsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [activeLogoIndex, setActiveLogoIndex] = useState(-1)
  const [answer, setAnswer] = useState("")
  const [answerVisible, setAnswerVisible] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [trends, setTrends] = useState<string[]>([])
  const [trendIndex, setTrendIndex] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(0)
  const [scrollX, setScrollX] = useState(0)
  const [dotColorIndex, setDotColorIndex] = useState(0)
  const dotColor = DOT_COLORS[dotColorIndex % DOT_COLORS.length]
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const answerDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
    fetch("/api/trending")
      .then((r) => r.json())
      .then((d) => { if (d.trends?.length) setTrends(d.trends) })
      .catch(() => {})
  }, [])

  // Cycle through trending queries in placeholder
  useEffect(() => {
    if (trends.length === 0) return
    const interval = setInterval(() => {
      setTrendIndex((i) => (i + 1) % trends.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [trends])


  // Advance dot color when it moves to a new location
  const prevDotPos = useRef({ activeIndex: -1, activeLogoIndex: -1 })
  useEffect(() => {
    const prev = prevDotPos.current
    if (activeIndex !== prev.activeIndex || activeLogoIndex !== prev.activeLogoIndex) {
      setDotColorIndex((c) => c + 1)
      prevDotPos.current = { activeIndex, activeLogoIndex }
    }
  }, [activeIndex, activeLogoIndex])

  // Scroll-driven horizontal translation for bottom card strip
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!resultsVisible || searchResults.length === 0) return
      e.preventDefault()
      const totalWidth = searchResults.length * (CARD_WIDTH + CARD_GAP)
      const maxScroll = Math.max(0, totalWidth - window.innerWidth + 40)
      setScrollX((prev) => Math.max(0, Math.min(maxScroll, prev + e.deltaY + e.deltaX)))
    }
    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [resultsVisible, searchResults.length])

  const fetchSearchResults = useCallback(async (text: string) => {
    if (!text.trim()) return
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(text.trim())}`)
      const data = await res.json()
      if (data.results && data.results.length > 0) {
        setSearchResults(data.results)
        setPage(1)
        setActiveLogoIndex(-1)
        setScrollX(0)
        requestAnimationFrame(() => setResultsVisible(true))
      } else {
        setResultsVisible(false)
        setActiveLogoIndex(-1)
      }
    } catch {
      setResultsVisible(false)
      setActiveLogoIndex(-1)
    }
  }, [])

  const fetchMore = useCallback(async () => {
    if (!inputValue.trim() || loadingMore) return
    setLoadingMore(true)
    try {
      const offset = page * 20
      const res = await fetch(`/api/search?q=${encodeURIComponent(inputValue.trim())}&offset=${offset}`)
      const data = await res.json()
      if (data.results && data.results.length > 0) {
        setSearchResults((prev) => [...prev, ...data.results])
        setPage((p) => p + 1)
      }
    } catch {
      // ignore
    }
    setLoadingMore(false)
  }, [inputValue, page, loadingMore])

  const fetchSuggestions = useCallback(async (text: string) => {
    if (!text.trim()) {
      setVisible(false)
      setActiveIndex(-1)
      return
    }
    try {
      const res = await fetch(`/api/suggest?q=${encodeURIComponent(text.trim())}`)
      const data = await res.json()
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions.slice(0, 5))
        setActiveIndex(-1)
        requestAnimationFrame(() => setVisible(true))
      } else {
        setVisible(false)
        setActiveIndex(-1)
      }
    } catch {
      setVisible(false)
      setActiveIndex(-1)
    }
  }, [])

  const fetchAnswer = useCallback(async (query: string) => {
    if (!query.trim()) return
    setAnswerVisible(false)
    try {
      const res = await fetch(`/api/answer?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (data.answer) {
        setAnswer(data.answer)
        requestAnimationFrame(() => setAnswerVisible(true))
      }
    } catch {
      setAnswerVisible(false)
    }
  }, [])

  const fetchScrapeAnswer = useCallback(async (url: string, query: string) => {
    if (!url || !query) return
    setAnswer("reading page...")
    setAnswerVisible(true)
    try {
      const res = await fetch(`/api/scrape-answer?url=${encodeURIComponent(url)}&q=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (data.answer) {
        setAnswer(data.answer)
      } else {
        setAnswer("")
        setAnswerVisible(false)
      }
    } catch {
      setAnswer("")
      setAnswerVisible(false)
    }
  }, [])

  // Auto-scroll bottom strip to keep highlighted card visible
  useEffect(() => {
    if (activeLogoIndex >= 0) {
      const cardLeft = activeLogoIndex * (CARD_WIDTH + CARD_GAP)
      const cardRight = cardLeft + CARD_WIDTH
      const viewLeft = scrollX
      const viewRight = scrollX + window.innerWidth - 40
      if (cardRight > viewRight) {
        setScrollX(cardRight - window.innerWidth + 40)
      } else if (cardLeft < viewLeft) {
        setScrollX(cardLeft)
      }
    }
  }, [activeLogoIndex, scrollX])

  useEffect(() => {
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      if (answerDebounceRef.current) clearTimeout(answerDebounceRef.current)
      answerDebounceRef.current = setTimeout(() => {
        fetchAnswer(suggestions[activeIndex])
      }, 100)
    } else if (activeLogoIndex >= 0 && searchResults[activeLogoIndex]) {
      if (answerDebounceRef.current) clearTimeout(answerDebounceRef.current)
      answerDebounceRef.current = setTimeout(() => {
        fetchScrapeAnswer(searchResults[activeLogoIndex].url, inputValue)
      }, 300)
    }
  }, [activeIndex, activeLogoIndex, suggestions, searchResults, fetchAnswer, fetchScrapeAnswer, inputValue])

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value
      setInputValue(text)
      setVisible(false)
      setActiveIndex(-1)
      setAnswerVisible(false)
      setResultsVisible(false)

      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
      if (answerDebounceRef.current) clearTimeout(answerDebounceRef.current)

      debounceRef.current = setTimeout(() => {
        fetchSuggestions(text)
      }, 250)

      searchDebounceRef.current = setTimeout(() => {
        fetchSearchResults(text)
        fetchAnswer(text)
      }, 800)
    },
    [fetchSuggestions, fetchSearchResults, fetchAnswer]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        if (activeLogoIndex >= 0 && searchResults[activeLogoIndex]) {
          window.open(searchResults[activeLogoIndex].url, "_blank")
          return
        }
        const q = activeIndex >= 0 && suggestions[activeIndex]
          ? suggestions[activeIndex]
          : inputValue.trim()
        if (q) {
          if (activeIndex >= 0) setInputValue(q)
          setActiveIndex(-1)
          if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
          if (answerDebounceRef.current) clearTimeout(answerDebounceRef.current)
          fetchSearchResults(q)
          fetchAnswer(q)
          fetchSuggestions(q)
        }
        return
      }

      if (e.key === "ArrowRight") {
        if (searchResults.length === 0) return
        e.preventDefault()
        setActiveIndex(-1)
        setActiveLogoIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        )
        return
      }

      if (e.key === "ArrowLeft") {
        if (searchResults.length === 0) return
        e.preventDefault()
        setActiveIndex(-1)
        setActiveLogoIndex((prev) => (prev > 0 ? prev - 1 : -1))
        return
      }

      if (suggestions.length === 0 || !visible) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveLogoIndex(-1)
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveLogoIndex(-1)
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1))
      }
    },
    [suggestions, visible, activeIndex, inputValue, searchResults.length, fetchSearchResults, fetchAnswer]
  )

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
      if (answerDebounceRef.current) clearTimeout(answerDebounceRef.current)
    }
  }, [])

  return (
    <div
      className="h-screen bg-white text-foreground flex flex-col overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      <style>{`
        *::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .dot-blink { animation: blink 1s ease-in-out infinite; }
      `}</style>

      {/* Top: search + suggestions | answer */}
      <div className="flex-1 overflow-hidden relative pt-5 px-4">
        {/* Search + suggestions — always centered */}
        <div className="mx-auto" style={{ width: 440 }}>
          {/* Search bar card */}
          <div className="rounded-md py-3 flex items-center" style={{ background: "#ebebeb", paddingLeft: 20, paddingRight: 16 }}>
            <span
              className="w-3 h-3 rounded-sm flex-shrink-0 dot-blink"
              style={{
                background: activeIndex < 0 && activeLogoIndex < 0 ? dotColor : "transparent",
                marginRight: 10,
              }}
            />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={trends.length > 0 ? `sirch ${trends[trendIndex]}` : "sirch"}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted caret-foreground outline-none"
            />
          </div>

          {/* Suggestions card */}
          <div
            className="mt-2 rounded-md py-4"
            // paddingLeft 20px so dot (12px) + gap (10px) + 20px = 42px text start
            style={{
              background: "#ebebeb",
              paddingLeft: 20,
              paddingRight: 20,
              opacity: visible ? 1 : 0,
              transition: "opacity 0.2s ease",
            }}
          >
            <div className="flex flex-col gap-2">
              {suggestions.map((suggestion, i) => (
                <div
                  key={`${suggestion}-${i}`}
                  className="flex items-center gap-2.5 text-sm cursor-pointer transition-colors"
                  style={{ color: i === activeIndex ? "var(--foreground)" : "var(--muted)" }}
                  onMouseEnter={() => {
                    setActiveIndex(i)
                    setActiveLogoIndex(-1)
                  }}
                  onClick={() => {
                    setInputValue(suggestion)
                    setActiveIndex(-1)
                    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
                    if (answerDebounceRef.current) clearTimeout(answerDebounceRef.current)
                    fetchSearchResults(suggestion)
                    fetchAnswer(suggestion)
                    fetchSuggestions(suggestion)
                  }}
                >
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ background: i === activeIndex ? dotColor : "transparent" }}
                  />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Answer card — absolutely positioned to the right of search */}
        <div
          className="absolute rounded-md px-6 py-5"
          style={{
            background: "#e5e5e5",
            opacity: (answerVisible || activeLogoIndex >= 0) ? 1 : 0,
            transition: "opacity 0.4s ease",
            top: 20,
            left: "calc(50% + 236px)",
            minWidth: 200,
            maxWidth: 360,
          }}
        >
          <p className="text-xs leading-relaxed" style={{ color: "#666" }}>{answer}</p>
        </div>
      </div>

      {/* Bottom: horizontal card strip — scrolls right-to-left on wheel */}
      <div
        className="flex-shrink-0 overflow-hidden"
        style={{
          height: resultsVisible ? 220 : 0,
          opacity: resultsVisible ? 1 : 0,
          transition: "height 0.4s ease, opacity 0.3s ease",
          paddingBottom: resultsVisible ? 20 : 0,
        }}
      >
        <div
          className="flex items-end gap-6 px-5"
          style={{
            height: "100%",
            transform: `translateX(-${scrollX}px)`,
            transition: "transform 0.08s ease-out",
          }}
        >
          {searchResults.map((result, i) => (
            <div key={`wrap-${result.url}-${i}`} className="flex-shrink-0 flex flex-col items-start" style={{ width: CARD_WIDTH }}>
              {/* Dot + name above highlighted card */}
              <div className="flex items-center gap-2 mb-3" style={{ height: 12 }}>
                <span
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ background: activeLogoIndex === i ? dotColor : "transparent" }}
                />
                {activeLogoIndex === i && (
                  <span className="text-xs font-medium text-foreground whitespace-nowrap">
                    {(() => { try { return new URL(result.url).hostname.replace("www.", "").split(".")[0] } catch { return "" } })()}
                  </span>
                )}
              </div>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg overflow-hidden cursor-pointer relative block w-full"
              style={{
                height: 170,
                background: "#f5f5f5",
                transition: "opacity 0.15s ease",
              }}
              onMouseEnter={() => {
                setActiveLogoIndex(i)
                setActiveIndex(-1)
              }}
              onMouseLeave={() => setActiveLogoIndex(-1)}
            >
              {result.image && (
                <img
                  src={result.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div
                className="absolute inset-0 flex flex-col justify-end p-3"
                style={{
                  background: result.image
                    ? "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)"
                    : "#f5f5f5",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <img src={result.favicon} alt="" className="w-3.5 h-3.5 rounded-full" />
                  <span className="text-xs" style={{ color: result.image ? "rgba(255,255,255,0.7)" : "#aaa" }}>
                    {(() => { try { return new URL(result.url).hostname.replace("www.", "") } catch { return "" } })()}
                  </span>
                </div>
                <p
                  className="text-xs font-medium leading-snug line-clamp-2"
                  style={{ color: result.image ? "#fff" : "var(--foreground)" }}
                >
                  {result.name}
                </p>
              </div>
              <img
                src={`/api/screenshot?url=${encodeURIComponent(result.url)}`}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700"
                loading="lazy"
                style={{ opacity: 0 }}
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement
                  if (img.naturalWidth > 10 && img.naturalHeight > 10) {
                    img.style.opacity = "1"
                  }
                }}
                onError={(e) => { (e.target as HTMLElement).style.display = "none" }}
              />
            </a>
            </div>
          ))}
          {searchResults.length > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); fetchMore(); }}
              disabled={loadingMore}
              className="flex-shrink-0 rounded-lg text-sm cursor-pointer transition-colors flex items-center justify-center"
              style={{ width: 120, height: 170, background: "#ebebeb", color: loadingMore ? "#bbb" : "#888" }}
            >
              {loadingMore ? "loading..." : "more"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
