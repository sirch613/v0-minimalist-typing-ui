"use client"

import { useEffect, useState } from "react"

const COLORS = ["#f0c050", "#e06050", "#50b0e0", "#60c060", "#b060d0", "#f08040"]

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-slide-up { animation: slide-up 1s ease-out forwards; }
        .animate-slide-up-delay { animation: slide-up 1s ease-out 0.3s forwards; opacity: 0; }
        .animate-slide-up-delay-2 { animation: slide-up 1s ease-out 0.6s forwards; opacity: 0; }
        .gradient-text {
          background: linear-gradient(135deg, #f0c050, #e06050, #50b0e0, #60c060, #b060d0);
          background-size: 300% 300%;
          animation: gradient-shift 6s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Floating orbs background */}
      {mounted && COLORS.map((color, i) => (
        <div
          key={i}
          className="fixed rounded-full pointer-events-none"
          style={{
            width: 300 + i * 80,
            height: 300 + i * 80,
            background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
            left: `${10 + i * 15}%`,
            top: `${-5 + i * 12}%`,
            transform: `translateY(${scrollY * (0.1 + i * 0.05)}px)`,
            animation: `float ${4 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-8 text-center">
        <div className="animate-slide-up">
          <div
            className="w-6 h-6 rounded-md mx-auto mb-8"
            style={{
              background: "#f0c050",
              animation: "pulse-glow 2s ease-in-out infinite",
              boxShadow: "0 0 60px #f0c05080",
            }}
          />
          <h1 className="text-7xl font-bold tracking-tight gradient-text" style={{ lineHeight: 1.1 }}>
            Sirch
          </h1>
        </div>
        <p className="animate-slide-up-delay text-2xl mt-6 max-w-2xl" style={{ color: "#888" }}>
          The last search engine you&apos;ll ever need.
        </p>
        <p className="animate-slide-up-delay-2 text-lg mt-4 max-w-xl" style={{ color: "#555" }}>
          We didn&apos;t just rebuild search. We rethought what it means to find something.
        </p>
        <div className="animate-slide-up-delay-2 mt-12">
          <a
            href="/"
            className="px-8 py-3 rounded-full text-sm font-medium transition-all"
            style={{
              background: "linear-gradient(135deg, #f0c050, #e06050)",
              color: "#000",
              boxShadow: "0 0 30px #f0c05040",
            }}
          >
            Try Sirch Now
          </a>
        </div>
      </section>

      {/* The Problem */}
      <section className="relative py-32 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-8" style={{ color: "#e06050" }}>
            Search is broken.
          </h2>
          <p className="text-xl leading-relaxed" style={{ color: "#999" }}>
            You type a question. You get ten blue links. You click one, it&apos;s not what you wanted.
            You go back. Click another. Read three paragraphs of SEO filler before finding one useful sentence.
            Repeat this 50 times a day. Every day. For the rest of your life.
          </p>
          <p className="text-xl leading-relaxed mt-6" style={{ color: "#999" }}>
            We thought that was insane. So we built something different.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-32 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl font-bold mb-20 text-center gradient-text">
            How Sirch Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                color: "#f0c050",
                title: "You type.",
                desc: "No buttons. No filters. No advanced search syntax. Just type what you're thinking and we understand it instantly.",
                num: "01",
              },
              {
                color: "#50b0e0",
                title: "We read every page.",
                desc: "While you're still looking at results, our AI crawls each page in real-time and reads the entire thing. Every word.",
                num: "02",
              },
              {
                color: "#60c060",
                title: "You see the answer.",
                desc: "Hover over any result and get an instant AI summary of what that specific page says about your question. No clicking required.",
                num: "03",
              },
            ].map((item) => (
              <div key={item.num} className="relative">
                <span
                  className="text-8xl font-black absolute -top-8 -left-2"
                  style={{ color: `${item.color}15` }}
                >
                  {item.num}
                </span>
                <div
                  className="w-4 h-4 rounded-sm mb-6"
                  style={{ background: item.color, boxShadow: `0 0 20px ${item.color}60` }}
                />
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-base leading-relaxed" style={{ color: "#888" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-32 px-8" style={{ background: "#0a0a0a" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "0.3s", label: "Avg. response time" },
            { num: "47M", label: "Pages crawled daily" },
            { num: "193", label: "Countries served" },
            { num: "0", label: "Ads. Ever." },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold gradient-text">{stat.num}</p>
              <p className="text-sm mt-2" style={{ color: "#666" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Dot */}
      <section className="relative py-32 px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-3 mb-12">
            {COLORS.map((c, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-sm"
                style={{
                  background: c,
                  animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                  boxShadow: `0 0 15px ${c}40`,
                }}
              />
            ))}
          </div>
          <h2 className="text-5xl font-bold mb-8">
            The Dot.
          </h2>
          <p className="text-xl leading-relaxed" style={{ color: "#999" }}>
            That little colored square isn&apos;t just a cursor. It&apos;s your guide.
            It follows your attention — from the search bar, to suggestions, to results.
            Every time it moves, it changes color. Because every new discovery
            should feel like seeing something for the first time.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="relative py-32 px-8" style={{ background: "#0a0a0a" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8 gradient-text">
            Built by Obsessives
          </h2>
          <p className="text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: "#888" }}>
            Sirch was born in a cramped apartment in New York City by a team of engineers
            who were tired of the internet feeling like homework. We&apos;ve spent the last
            three years reverse-engineering how humans actually look for information — not how
            search engines think they should.
          </p>
          <p className="text-xl leading-relaxed max-w-2xl mx-auto mt-6" style={{ color: "#888" }}>
            Our AI reads pages the way you would — scanning for the part that actually
            matters to your question — then tells you what it found in plain language.
            No jargon. No filler. No agenda.
          </p>
        </div>
      </section>

      {/* Manifesto */}
      <section className="relative py-32 px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 text-center" style={{ color: "#b060d0" }}>
            What We Believe
          </h2>
          <div className="space-y-8">
            {[
              "Search should feel like a conversation, not a transaction.",
              "You shouldn't have to click 10 links to find one answer.",
              "The best interface is the one that disappears.",
              "AI should make you faster, not replace your thinking.",
              "No ads. No tracking. No selling your data. Ever.",
            ].map((belief, i) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0 mt-2"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <p className="text-lg" style={{ color: "#aaa" }}>{belief}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-40 px-8 text-center">
        <h2 className="text-6xl font-bold gradient-text mb-6">
          Stop searching. Start finding.
        </h2>
        <p className="text-xl mb-12" style={{ color: "#666" }}>
          It takes exactly zero seconds to try.
        </p>
        <a
          href="/"
          className="inline-block px-10 py-4 rounded-full text-base font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, #f0c050, #e06050, #b060d0)",
            color: "#000",
            boxShadow: "0 0 40px #f0c05050",
          }}
        >
          Go to Sirch
        </a>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 text-center border-t" style={{ borderColor: "#1a1a1a" }}>
        <p className="text-xs" style={{ color: "#444" }}>
          This entire about page — every word, every stat, every claim — was generated by AI.
        </p>
        <p className="text-xs mt-2" style={{ color: "#333" }}>
          © {new Date().getFullYear()} Sirch AI
        </p>
      </footer>
    </div>
  )
}
