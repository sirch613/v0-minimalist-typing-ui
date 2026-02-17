"use client"

import { useRef, useEffect, useState, useCallback } from "react"

export function Editor() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [visible, setVisible] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }, [])

  const fetchSuggestions = useCallback(async (text: string) => {
    if (!text.trim()) {
      setVisible(false)
      setTimeout(() => setSuggestions([]), 150)
      return
    }

    try {
      const res = await fetch(`/api/suggest?q=${encodeURIComponent(text.trim())}`)
      const data = await res.json()
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions.slice(0, 6))
        requestAnimationFrame(() => setVisible(true))
      } else {
        setVisible(false)
        setTimeout(() => setSuggestions([]), 150)
      }
    } catch {
      setVisible(false)
      setTimeout(() => setSuggestions([]), 150)
    }
  }, [])

  const handleInput = useCallback(() => {
    const text = editorRef.current?.textContent || ""

    // Fade out immediately on keystroke
    setVisible(false)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(text)
    }, 250)
  }, [fetchSuggestions])

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
          className="w-full min-h-[1em] text-foreground text-lg leading-relaxed outline-none"
          role="textbox"
          aria-label="Text editor"
          aria-multiline="true"
        />

        {suggestions.length > 0 && (
          <div
            className="mt-4 flex flex-col gap-1.5 transition-opacity duration-150 ease-in-out"
            style={{ opacity: visible ? 1 : 0 }}
            aria-live="polite"
            aria-label="Search suggestions"
          >
            {suggestions.map((suggestion, i) => (
              <span
                key={`${suggestion}-${i}`}
                className="text-lg leading-relaxed"
                style={{ color: "hsl(0 0% 72%)" }}
              >
                {suggestion}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
