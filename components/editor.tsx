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
      className="flex min-h-screen w-full flex-col items-center justify-center bg-background"
      onClick={() => editorRef.current?.focus()}
    >
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onInput={handleInput}
        className="w-full min-h-[1em] text-foreground text-lg leading-relaxed outline-none"
        style={{
          paddingLeft: "calc(50vw - 1.5in)",
          paddingRight: "calc(50vw - 1.5in)",
        }}
        role="textbox"
        aria-label="Text editor"
        aria-multiline="true"
      />

      {suggestions.length > 0 && (
        <div
          className="w-full mt-6 flex flex-col gap-4 transition-opacity duration-150 ease-in-out"
          style={{
            opacity: visible ? 1 : 0,
            paddingLeft: "calc(50vw - 1.5in)",
            paddingRight: "calc(50vw - 1.5in)",
          }}
          aria-live="polite"
          aria-label="Search suggestions"
        >
          {suggestions.map((suggestion, i) => (
            <span
              key={`${suggestion}-${i}`}
              className="text-base leading-relaxed"
              style={{ color: "hsl(0 0% 72%)" }}
            >
              {suggestion}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
