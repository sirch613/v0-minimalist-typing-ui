"use client"

import { useRef, useEffect, useState, useCallback } from "react"

export function Editor() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [visible, setVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }, [])

  const fetchSuggestions = useCallback(async (text: string) => {
    if (!text.trim()) {
      setVisible(false)
      setActiveIndex(-1)
      setTimeout(() => setSuggestions([]), 150)
      return
    }

    try {
      const res = await fetch(`/api/suggest?q=${encodeURIComponent(text.trim())}`)
      const data = await res.json()
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions.slice(0, 6))
        setActiveIndex(-1)
        requestAnimationFrame(() => setVisible(true))
      } else {
        setVisible(false)
        setActiveIndex(-1)
        setTimeout(() => setSuggestions([]), 150)
      }
    } catch {
      setVisible(false)
      setActiveIndex(-1)
      setTimeout(() => setSuggestions([]), 150)
    }
  }, [])

  const handleInput = useCallback(() => {
    const text = editorRef.current?.textContent || ""

    setVisible(false)
    setActiveIndex(-1)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(text)
    }, 250)
  }, [fetchSuggestions])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (suggestions.length === 0 || !visible) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1))
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault()
        const selected = suggestions[activeIndex]
        if (editorRef.current) {
          editorRef.current.textContent = selected
          // Place cursor at end
          const range = document.createRange()
          const sel = window.getSelection()
          range.selectNodeContents(editorRef.current)
          range.collapse(false)
          sel?.removeAllRanges()
          sel?.addRange(range)
        }
        setActiveIndex(-1)
        handleInput()
      }
    },
    [suggestions, visible, activeIndex, handleInput]
  )

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return (
    <div
      className="h-screen w-full overflow-hidden bg-background"
      onClick={() => editorRef.current?.focus()}
    >
      <div
        className="w-full"
        style={{
          paddingTop: "calc(50vh - 0.75em)",
          paddingLeft: "calc(50vw - 1.5in)",
          paddingRight: "calc(50vw - 1.5in)",
        }}
      >
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

        {suggestions.length > 0 && (
          <div
            className="mt-3 flex flex-col gap-0.5 transition-opacity duration-150 ease-in-out"
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
                    className="absolute -left-5 top-0"
                    aria-hidden="true"
                  >
                    &middot;
                  </span>
                )}
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
