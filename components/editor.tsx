"use client"

import { useRef, useEffect, useState, useCallback } from "react"

export function Editor() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [visible, setVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [activeLogoIndex, setActiveLogoIndex] = useState(-1)
  const [answer, setAnswer] = useState("")
  const [answerVisible, setAnswerVisible] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const answerDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const logos = [
    { name: "Google", url: "https://logo.clearbit.com/google.com", desc: "Search engine and technology company that organizes the world's information. Known for Gmail, Maps, Android, and cloud computing services used by billions worldwide." },
    { name: "Apple", url: "https://logo.clearbit.com/apple.com", desc: "Consumer electronics and software company behind the iPhone, Mac, and iPad. Pioneered personal computing and continues to shape how people interact with technology." },
    { name: "Spotify", url: "https://logo.clearbit.com/spotify.com", desc: "Audio streaming platform with over 600 million users. Offers music, podcasts, and audiobooks with personalized recommendations powered by machine learning." },
    { name: "Netflix", url: "https://logo.clearbit.com/netflix.com", desc: "Streaming entertainment service with original films and series. Transformed how the world consumes media, operating in over 190 countries." },
    { name: "Airbnb", url: "https://logo.clearbit.com/airbnb.com", desc: "Online marketplace for short and long-term lodging. Connects travelers with unique stays and experiences hosted by locals in cities around the globe." },
    { name: "Stripe", url: "https://logo.clearbit.com/stripe.com", desc: "Financial infrastructure platform for internet businesses. Powers payments, billing, and financial operations for millions of companies from startups to enterprises." },
    { name: "Slack", url: "https://logo.clearbit.com/slack.com", desc: "Business messaging platform that brings teams together. Offers channels, direct messaging, and integrations with hundreds of tools to streamline workplace communication." },
    { name: "GitHub", url: "https://logo.clearbit.com/github.com", desc: "Developer platform for version control and collaboration. Home to over 100 million developers building software together through repositories and open source projects." },
    { name: "Figma", url: "https://logo.clearbit.com/figma.com", desc: "Collaborative design tool used by teams to create interfaces and prototypes. Runs entirely in the browser with real-time multiplayer editing capabilities." },
    { name: "Linear", url: "https://logo.clearbit.com/linear.app", desc: "Project management tool built for modern software teams. Focuses on speed and simplicity with keyboard-first design and streamlined issue tracking workflows." },
  ]

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }, [])

  const fetchSuggestions = useCallback(async (text: string) => {
    if (!text.trim()) {
      setVisible(false)
      setActiveIndex(-1)
      setAnswerVisible(false)
      return
    }

    try {
      const res = await fetch(`/api/suggest?q=${encodeURIComponent(text.trim())}`)
      const data = await res.json()
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions.slice(0, 5))
        setActiveIndex(-1)
        setAnswerVisible(false)
        requestAnimationFrame(() => setVisible(true))
      } else {
        setVisible(false)
        setActiveIndex(-1)
        setAnswerVisible(false)
      }
    } catch {
      setVisible(false)
      setActiveIndex(-1)
      setAnswerVisible(false)
    }
  }, [])

  const fetchAnswer = useCallback(async (query: string) => {
    setAnswerVisible(false)

    if (answerDebounceRef.current) {
      clearTimeout(answerDebounceRef.current)
    }

    answerDebounceRef.current = setTimeout(async () => {
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
    }, 100)
  }, [])

  useEffect(() => {
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      fetchAnswer(suggestions[activeIndex])
    } else {
      setAnswerVisible(false)
    }
  }, [activeIndex, suggestions, fetchAnswer])

  const handleInput = useCallback(() => {
    const text = editorRef.current?.innerText || ""

    setVisible(false)
    setActiveIndex(-1)
    setAnswerVisible(false)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(text)
    }, 250)
  }, [fetchSuggestions])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault()
        setActiveIndex(-1)
        setAnswerVisible(false)
        setActiveLogoIndex((prev) =>
          prev < logos.length - 1 ? prev + 1 : prev
        )
        return
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        setActiveIndex(-1)
        setAnswerVisible(false)
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
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault()
        const selected = suggestions[activeIndex]
        if (editorRef.current) {
          editorRef.current.textContent = selected
          const range = document.createRange()
          const sel = window.getSelection()
          range.selectNodeContents(editorRef.current)
          range.collapse(false)
          sel?.removeAllRanges()
          sel?.addRange(range)
        }
        setActiveIndex(-1)
        setAnswerVisible(false)
        handleInput()
      }
    },
    [suggestions, visible, activeIndex, handleInput, logos.length]
  )

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (answerDebounceRef.current) clearTimeout(answerDebounceRef.current)
    }
  }, [])

  return (
    <div
      className="h-screen w-full overflow-hidden bg-background flex"
      onClick={() => editorRef.current?.focus()}
    >
      {/* Left side: input + suggestions */}
      <div
        className="h-full shrink-0"
        style={{
          width: "65%",
          paddingTop: "calc(50vh - 3rem)",
          paddingLeft: "calc(25vw - 1.25in)",
          paddingRight: "3rem",
        }}
      >
        <div className="flex items-center gap-2 mb-6">
          {logos.map((logo, i) => (
            <div
              key={logo.name}
              className="relative shrink-0"
            >
              <div
                className="w-5 h-5 rounded-full overflow-hidden transition-all duration-100"
                style={{
                  opacity: activeLogoIndex === i ? 1 : 0.35,
                  boxShadow: activeLogoIndex === i ? "0 0 0 1.5px hsl(0 72% 51%)" : "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          ))}
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className="w-full min-h-[1em] text-foreground text-lg leading-relaxed outline-none"
          role="textbox"
          aria-label="Text editor"
          aria-multiline="true"
        />

        <div
          className="mt-3 flex flex-col gap-0.5 transition-opacity duration-100 ease-in-out"
          style={{ opacity: visible ? 1 : 0 }}
          aria-live="polite"
          aria-label="Search suggestions"
        >
          {suggestions.map((suggestion, i) => (
            <div
              key={`${suggestion}-${i}`}
              className="relative text-lg leading-relaxed"
              style={{ color: "hsl(0 0% 55%)" }}
            >
              {i === activeIndex && (
                <span
                  className="absolute -left-5 top-1/2 -translate-y-1/2 text-2xl"
                  style={{ color: "hsl(0 72% 51%)" }}
                  aria-hidden="true"
                >
                  &middot;
                </span>
              )}
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: answer/logo card */}
      <div
        className="h-full flex pointer-events-none"
        style={{
          width: "35%",
          paddingTop: "calc(50vh - 3rem)",
          paddingRight: "3rem",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        {/* Logo info */}
        <div
          className="transition-opacity duration-100 ease-in-out max-w-xs mb-6"
          style={{ opacity: activeLogoIndex >= 0 ? 1 : 0 }}
        >
          {activeLogoIndex >= 0 && (
            <>
              <p
                className="text-sm font-medium mb-1"
                style={{ color: "hsl(0 0% 30%)" }}
              >
                {logos[activeLogoIndex].name}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "hsl(0 0% 50%)" }}
              >
                {logos[activeLogoIndex].desc}
              </p>
            </>
          )}
        </div>

        {/* Suggestion answer */}
        <div
          className="transition-opacity duration-150 ease-in-out max-w-xs"
          style={{ opacity: answerVisible && activeLogoIndex < 0 ? 1 : 0 }}
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: "hsl(0 0% 45%)" }}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}
