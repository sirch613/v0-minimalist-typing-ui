"use client"

import { useRef, useEffect, useState, useCallback } from "react"

interface SearchResult {
  name: string
  favicon: string
  url: string
  desc: string
}

export function Editor() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [visible, setVisible] = useState(false)
  const [resultsVisible, setResultsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [activeLogoIndex, setActiveLogoIndex] = useState(-1)
  const [answer, setAnswer] = useState("")
  const [answerVisible, setAnswerVisible] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const answerDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }, [])

  const fetchSearchResults = useCallback(async (text: string) => {
    if (!text.trim()) {
      setResultsVisible(false)
      setActiveLogoIndex(-1)
      return
    }

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(text.trim())}`)
      const data = await res.json()
      if (data.results && data.results.length > 0) {
        setSearchResults(data.results)
        setActiveLogoIndex(-1)
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
    } else if (activeLogoIndex < 0) {
      setAnswerVisible(false)
    }
  }, [activeIndex, suggestions, fetchAnswer, activeLogoIndex])

  const handleInput = useCallback(() => {
    const text = editorRef.current?.innerText || ""

    setVisible(false)
    setActiveIndex(-1)
    setAnswerVisible(false)
    setResultsVisible(false)
    setActiveLogoIndex(-1)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(text)
    }, 250)

    searchDebounceRef.current = setTimeout(() => {
      fetchSearchResults(text)
    }, 300)
  }, [fetchSuggestions, fetchSearchResults])

  const handleLogoImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    img.style.display = "none"
    const parent = img.parentElement
    if (parent) {
      parent.style.backgroundColor = "hsl(0 0% 80%)"
    }
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        if (searchResults.length === 0) return
        e.preventDefault()
        setActiveIndex(-1)
        setAnswerVisible(false)
        setActiveLogoIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
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
    [suggestions, visible, activeIndex, handleInput, searchResults.length]
  )

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (answerDebounceRef.current) clearTimeout(answerDebounceRef.current)
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
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
        <div
          className="flex items-center gap-2 mb-6 transition-opacity duration-100 ease-in-out h-5"
          style={{ opacity: resultsVisible ? 1 : 0 }}
        >
          {searchResults.map((result, i) => (
            <div
              key={`${result.url}-${i}`}
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
                  src={result.favicon}
                  alt={result.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                  onError={handleLogoImageError}
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
        {/* Search result info */}
        <div
          className="transition-opacity duration-100 ease-in-out max-w-xs mb-6"
          style={{ opacity: activeLogoIndex >= 0 ? 1 : 0 }}
        >
          {activeLogoIndex >= 0 && searchResults[activeLogoIndex] && (
            <>
              <p
                className="text-sm font-medium mb-1"
                style={{ color: "hsl(0 0% 30%)" }}
              >
                {searchResults[activeLogoIndex].name}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "hsl(0 0% 50%)" }}
              >
                {searchResults[activeLogoIndex].desc}
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
