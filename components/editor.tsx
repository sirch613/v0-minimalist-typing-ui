"use client"

import { useRef, useEffect } from "react"

export function Editor() {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }, [])

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-background"
      onClick={() => editorRef.current?.focus()}
    >
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        className="w-full max-w-[600px] min-h-[1em] text-foreground text-lg leading-relaxed outline-none caret-foreground"
        style={{
          paddingLeft: "calc(50% - 1.5in)",
          paddingRight: "1rem",
          caretColor: "var(--foreground)",
        }}
        role="textbox"
        aria-label="Text editor"
        aria-multiline="true"
      />
    </div>
  )
}
