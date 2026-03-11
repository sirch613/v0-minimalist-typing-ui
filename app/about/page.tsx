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
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
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
        .section-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #333, transparent);
          margin: 0 auto;
          max-width: 600px;
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
          <p className="text-xl leading-relaxed mt-6" style={{ color: "#999" }}>
            The average person spends 9.3 minutes per search session. That&apos;s 12 full days a year
            just clicking through garbage. Over a lifetime, that&apos;s 2.4 years of your existence
            spent bouncing between tabs, scanning for the one paragraph that actually answers your question.
            We&apos;re here to give you those years back.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* The Origin Story */}
      <section className="relative py-32 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 gradient-text">
            How It Started
          </h2>
          <p className="text-xl leading-relaxed" style={{ color: "#999" }}>
            It was 3 AM in a one-bedroom apartment on Ludlow Street, Lower East Side, Manhattan.
            The radiator was broken. There were four laptops on a folding table and a whiteboard
            covered in diagrams that looked like conspiracy theories. The remains of $4 halal cart
            meals were scattered across every surface.
          </p>
          <p className="text-xl leading-relaxed mt-6" style={{ color: "#999" }}>
            Mika had just rage-quit her job at one of the big search companies. &ldquo;I spent
            two years optimizing ad placement,&rdquo; she said, staring at the ceiling. &ldquo;Two
            years making search results worse on purpose so people would click more ads.&rdquo;
          </p>
          <p className="text-xl leading-relaxed mt-6" style={{ color: "#999" }}>
            Tomás was hunched over his keyboard, running inference tests on a model he&apos;d been
            training for six months. He looked up and said the words that started everything:
            &ldquo;What if the search engine just... read the pages for you?&rdquo;
          </p>
          <p className="text-xl leading-relaxed mt-6" style={{ color: "#999" }}>
            Nobody laughed. Nobody said it was impossible. Priya grabbed a marker and wrote
            on the whiteboard: &ldquo;SEARCH → READ → ANSWER.&rdquo; Three words. That was
            the entire business plan. It still is.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* How It Works - Expanded */}
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

      {/* Deep Dive: The Technology */}
      <section className="relative py-32 px-8" style={{ background: "#0a0a0a" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-12" style={{ color: "#50b0e0" }}>
            Under the Hood
          </h2>
          <p className="text-xl leading-relaxed" style={{ color: "#999" }}>
            Most search engines index the web and store keywords. When you search, they match
            your keywords against their index. It&apos;s fast, but it&apos;s dumb. It doesn&apos;t
            understand what you&apos;re actually asking.
          </p>
          <p className="text-xl leading-relaxed mt-6" style={{ color: "#999" }}>
            Sirch does something fundamentally different. When you highlight a result, we deploy
            a real-time crawler that fetches the full page content — not a cached version from
            three weeks ago, but the live page, right now. That content gets piped into our
            inference layer, where a language model reads the entire page in the context of
            your specific question.
          </p>
          <p className="text-xl leading-relaxed mt-6" style={{ color: "#999" }}>
            The result isn&apos;t a generic summary. It&apos;s a targeted answer: &ldquo;Here&apos;s
            what this page says about the thing you asked.&rdquo; It&apos;s the difference
            between a librarian handing you a book and a librarian reading the book, finding
            the paragraph you need, and reading it to you out loud.
          </p>
          <p className="text-xl leading-relaxed mt-6" style={{ color: "#999" }}>
            We call it &ldquo;Read-on-Hover&rdquo; and it changes everything. You never have to
            leave the search page. You never have to scan through SEO-optimized garbage. You
            never have to open 15 tabs. The answer comes to you.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-32 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "0.3s", label: "Avg. response time" },
            { num: "47M", label: "Pages crawled daily" },
            { num: "193", label: "Countries served" },
            { num: "0", label: "Ads. Ever." },
            { num: "2.4", label: "Years saved per user (lifetime)" },
            { num: "99.7%", label: "Uptime since launch" },
            { num: "340ms", label: "Avg. page read time" },
            { num: "∞", label: "Curiosity supported" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold gradient-text">{stat.num}</p>
              <p className="text-sm mt-2" style={{ color: "#666" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

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
          <p className="text-xl leading-relaxed mt-6" style={{ color: "#999" }}>
            We spent four months on the dot. Four months. Our investors thought we were insane.
            &ldquo;You&apos;re burning runway on a colored square?&rdquo; But Priya insisted.
            She had this theory that the reason people feel overwhelmed by search results is
            that there&apos;s no sense of place. No anchor. Your eyes dart around the page
            with nothing to hold onto.
          </p>
          <p className="text-xl leading-relaxed mt-6" style={{ color: "#999" }}>
            The dot gives you a home base. It says: &ldquo;You are here.&rdquo; And when
            it changes color, it says: &ldquo;You&apos;ve moved somewhere new.&rdquo;
            It sounds small. It changes everything.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* Meet the Team */}
      <section className="relative py-32 px-8" style={{ background: "#0a0a0a" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 text-center gradient-text">
            Meet the Team
          </h2>
          <p className="text-lg text-center mb-20" style={{ color: "#666" }}>
            Seven people who left perfectly good jobs to make search not suck.
          </p>

          {/* Mika */}
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: "#f0c050", color: "#000" }}>M</div>
              <div>
                <h3 className="text-2xl font-bold">Mika Andersson</h3>
                <p className="text-sm" style={{ color: "#f0c050" }}>Co-founder & CEO</p>
              </div>
            </div>
            <p className="text-lg leading-relaxed" style={{ color: "#999" }}>
              Mika grew up in a fishing village in northern Sweden where the nearest library was
              a 45-minute bus ride. The internet was her library. She taught herself to code at 14,
              got a scholarship to KTH Royal Institute of Technology, and by 22 was running a
              search quality team at one of the world&apos;s largest tech companies.
            </p>
            <p className="text-lg leading-relaxed mt-4" style={{ color: "#999" }}>
              She lasted three years. &ldquo;The moment I realized that my job was to make people
              click more — not find more — I knew I had to leave,&rdquo; she says. She quit
              without a plan, flew to New York with two suitcases, and started sketching what
              would become Sirch on napkins at a café in Williamsburg.
            </p>
            <p className="text-lg leading-relaxed mt-4" style={{ color: "#999" }}>
              Mika doesn&apos;t use a smartphone. She carries a flip phone and a notebook.
              &ldquo;If I can&apos;t find the answer on Sirch from a laptop, we haven&apos;t
              built it right yet.&rdquo; She drinks six cups of black coffee a day and can
              name every species of fish in the Baltic Sea.
            </p>
          </div>

          {/* Tomás */}
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: "#e06050", color: "#000" }}>T</div>
              <div>
                <h3 className="text-2xl font-bold">Tomás Herrera-Vega</h3>
                <p className="text-sm" style={{ color: "#e06050" }}>Co-founder & CTO</p>
              </div>
            </div>
            <p className="text-lg leading-relaxed" style={{ color: "#999" }}>
              Tomás was born in Medellín, Colombia, raised in Miami, and educated at MIT, where
              he published his first paper on neural information retrieval at age 20. His PhD
              advisor called him &ldquo;the most annoyingly talented student I&apos;ve ever had.&rdquo;
            </p>
            <p className="text-lg leading-relaxed mt-4" style={{ color: "#999" }}>
              Before Sirch, Tomás spent four years at a stealth AI lab building language models
              for scientific research. He left when he realized the models were being used
              primarily to generate marketing copy. &ldquo;I trained a system that could read
              every paper ever written about protein folding, and they used it to write
              email subject lines,&rdquo; he says, still visibly annoyed.
            </p>
            <p className="text-lg leading-relaxed mt-4" style={{ color: "#999" }}>
              He met Mika at a AI meetup in Brooklyn where she cornered him for two hours
              about real-time page comprehension. He started building a prototype that night.
              By morning, he had a working demo. He hasn&apos;t stopped since. Tomás sleeps
              in the office three nights a week and has strong opinions about mechanical keyboards.
              His current daily driver has 42 keys and sounds like a tiny thunderstorm.
            </p>
          </div>

          {/* Priya */}
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: "#50b0e0", color: "#000" }}>P</div>
              <div>
                <h3 className="text-2xl font-bold">Priya Chakraborty</h3>
                <p className="text-sm" style={{ color: "#50b0e0" }}>Co-founder & Head of Design</p>
              </div>
            </div>
            <p className="text-lg leading-relaxed" style={{ color: "#999" }}>
              Priya is the reason Sirch looks like nothing else on the internet. Trained as an
              architect at the Bartlett School in London, she pivoted to digital design after
              realizing she could reach more people through screens than buildings. She spent
              five years at a legendary design agency in Tokyo, where she led the redesign of
              three of Japan&apos;s most-used mobile apps.
            </p>
            <p className="text-lg leading-relaxed mt-4" style={{ color: "#999" }}>
              Her design philosophy is radical minimalism: &ldquo;Every pixel that doesn&apos;t
              help you find what you&apos;re looking for is a pixel that&apos;s in your way.&rdquo;
              She removed over 200 UI elements during Sirch&apos;s development. The team called
              her &ldquo;The Eraser.&rdquo; She took it as a compliment.
            </p>
            <p className="text-lg leading-relaxed mt-4" style={{ color: "#999" }}>
              The dot was her idea. So was the color-changing. So was the idea that the search
              bar should feel like a blank page, not a form field. Priya meditates for an hour
              every morning, practices calligraphy in the evening, and has never once used
              dark mode. &ldquo;Design should work in the light,&rdquo; she says.
            </p>
          </div>

          {/* Jin-Soo */}
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: "#60c060", color: "#000" }}>J</div>
              <div>
                <h3 className="text-2xl font-bold">Jin-Soo Park</h3>
                <p className="text-sm" style={{ color: "#60c060" }}>Head of Infrastructure</p>
              </div>
            </div>
            <p className="text-lg leading-relaxed" style={{ color: "#999" }}>
              Jin-Soo is the reason Sirch is fast. Terrifyingly fast. He previously built
              the real-time data pipeline for one of Korea&apos;s largest gaming platforms,
              processing 2.3 million events per second with 99.99% reliability. When he
              tells you a system won&apos;t go down, it doesn&apos;t go down.
            </p>
            <p className="text-lg leading-relaxed mt-4" style={{ color: "#999" }}>
              Born in Seoul, Jin-Soo moved to San Francisco at 25 and immediately hated it.
              &ldquo;Everyone talks about changing the world but nobody can make a server
              respond in under 100 milliseconds,&rdquo; he complained to anyone who would
              listen. He found his people at Sirch.
            </p>
            <p className="text-lg leading-relaxed mt-4" style={{ color: "#999" }}>
              Jin-Soo&apos;s infrastructure serves search results from 14 edge locations
              worldwide. He hand-optimized every database query. He wrote a custom connection
              pooler that reduced latency by 40%. His proudest achievement is that the average
              Sirch response time is 0.3 seconds, and he considers that &ldquo;embarrassingly
              slow.&rdquo; He&apos;s working on getting it under 0.1.
            </p>
            <p className="text-lg leading-relaxed mt-4" style={{ color: "#999" }}>
              Outside of work, Jin-Soo is a competitive speed-cuber. His personal best
              for a 3x3 Rubik&apos;s cube is 8.7 seconds. He says solving cubes and
              optimizing systems use the exact same part of his brain.
            </p>
          </div>

          {/* Amara */}
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: "#b060d0", color: "#000" }}>A</div>
              <div>
                <h3 className="text-2xl font-bold">Amara Okafor-Williams</h3>
                <p className="text-sm" style={{ color: "#b060d0" }}>Head of AI Research</p>
              </div>
            </div>
            <p className="text-lg leading-relaxed" style={{ color: "#999" }}>
              Amara holds a PhD in computational linguistics from Stanford, where her
              dissertation on &ldquo;contextual relevance in multi-document summarization&rdquo;
              was cited 847 times before she finished defending it. She&apos;s the brain
              behind Sirch&apos;s ability to read a page and extract exactly the part that
              answers your question.
            </p>
            <p className="text-lg leading-relaxed mt-4" style={{ color: "#999" }}>
              Raised in Lagos and London, Amara speaks five languages and can explain
              transformer architecture to a five-year-old. (&ldquo;It&apos;s like if you could
              read every book in the library at the same time, but you had a highlighter that
              only lit up the parts about dinosaurs, because that&apos;s what you asked about.&rdquo;)
            </p>
            <p className="text-lg leading-relaxed mt-4" style={{ color: "#999" }}>
              Before Sirch, she turned down offers from four major AI labs. &ldquo;They wanted
              me to make chatbots more engaging,&rdquo; she says. &ldquo;I wanted to make
              information more accessible. There&apos;s a difference.&rdquo; She joined Sirch
              after a single phone call with Mika that lasted four hours.
            </p>
            <p className="text-lg leading-relaxed mt-4" style={{ color: "#999" }}>
              Amara runs a mentorship program for young women in AI across West Africa.
              She&apos;s also an amateur potter and makes all the mugs in the Sirch office.
              Every mug has a different Nigerian proverb on it. Tomás&apos;s says:
              &ldquo;The person who asks questions doesn&apos;t lose their way.&rdquo;
            </p>
          </div>

          {/* Leo */}
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: "#f08040", color: "#000" }}>L</div>
              <div>
                <h3 className="text-2xl font-bold">Leo Bianchi</h3>
                <p className="text-sm" style={{ color: "#f08040" }}>Head of Crawling & Data</p>
              </div>
            </div>
            <p className="text-lg leading-relaxed" style={{ color: "#999" }}>
              Leo is the reason Sirch can read any page on the internet in under a second.
              A former competitive programmer from Turin, Italy, he won three consecutive
              gold medals at the International Olympiad in Informatics before turning 18.
              He dropped out of Politecnico di Torino because &ldquo;they were teaching
              algorithms I&apos;d already improved on.&rdquo;
            </p>
            <p className="text-lg leading-relaxed mt-4" style={{ color: "#999" }}>
              Leo built Sirch&apos;s crawling engine from scratch. It can fetch, parse, and
              extract meaningful content from any webpage in 340 milliseconds on average.
              It handles paywalls, JavaScript-rendered content, PDFs, and even some formats
              that technically shouldn&apos;t work. &ldquo;The web is chaos,&rdquo; he says.
              &ldquo;My job is to make sense of chaos.&rdquo;
            </p>
            <p className="text-lg leading-relaxed mt-4" style={{ color: "#999" }}>
              He processes 47 million pages per day and has personally written parsers for
              over 400 different website layouts. When a page doesn&apos;t parse correctly,
              he takes it as a personal insult. He once stayed up for 36 hours straight
              to fix a bug that affected 0.003% of crawls. &ldquo;That&apos;s 1,400 pages,&rdquo;
              he said. &ldquo;1,400 people didn&apos;t get their answer.&rdquo;
            </p>
            <p className="text-lg leading-relaxed mt-4" style={{ color: "#999" }}>
              Leo makes fresh pasta every Sunday and insists that the team joins. He says
              making pasta and building parsers are the same thing: &ldquo;You take raw
              material, you shape it, you make something nourishing.&rdquo; His carbonara
              has been called &ldquo;life-altering&rdquo; by multiple team members.
            </p>
          </div>

          {/* Zara */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: "#50b0e0", color: "#000" }}>Z</div>
              <div>
                <h3 className="text-2xl font-bold">Zara Chen</h3>
                <p className="text-sm" style={{ color: "#50b0e0" }}>Head of Product</p>
              </div>
            </div>
            <p className="text-lg leading-relaxed" style={{ color: "#999" }}>
              Zara is the voice of the user. Literally. Before every feature ships, she
              sits in a room with 10 random people and watches them use it. No guidance.
              No hints. If they can&apos;t figure it out in 5 seconds, it gets redesigned.
              She has killed more features than she&apos;s shipped, and she&apos;s proud of it.
            </p>
            <p className="text-lg leading-relaxed mt-4" style={{ color: "#999" }}>
              Born in Vancouver, raised in Shanghai, educated at RISD and then Harvard Business
              School, Zara has the unusual combination of aesthetic sensibility and ruthless
              product instincts. She previously led product at a meditation app that reached
              30 million users, where she learned that &ldquo;the best product is the one
              people use without thinking about it.&rdquo;
            </p>
            <p className="text-lg leading-relaxed mt-4" style={{ color: "#999" }}>
              Zara runs all of Sirch&apos;s user research. She&apos;s conducted over 500
              user interviews in the past year alone. She can predict with 90% accuracy
              whether a person will find what they&apos;re looking for within the first
              3 seconds of watching them search. She calls it &ldquo;the moment of intent&rdquo;
              — that split second when someone&apos;s eyes either light up or glaze over.
            </p>
            <p className="text-lg leading-relaxed mt-4" style={{ color: "#999" }}>
              In her spare time, Zara is a competitive ballroom dancer. She says product
              design and dancing have the same core principle: &ldquo;Lead without forcing.
              The best experiences feel like you&apos;re choosing, even when you&apos;re
              being guided.&rdquo;
            </p>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* How Sirch Will Change Your Life */}
      <section className="relative py-32 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 text-center gradient-text">
            How Sirch Will Change Your Life
          </h2>
          <p className="text-xl leading-relaxed text-center mb-16" style={{ color: "#666" }}>
            This sounds dramatic. It isn&apos;t.
          </p>

          {[
            {
              title: "You'll make better decisions.",
              color: "#f0c050",
              text: "Right now, most of your decisions are based on the first result that seems good enough. You're not finding the best answer — you're finding the first acceptable one. Sirch shows you what every page actually says, so you can compare real information instead of headlines. Your decisions get better because your information gets better.",
            },
            {
              title: "You'll learn 10X faster.",
              color: "#e06050",
              text: "When you're researching something new, you currently spend 80% of your time navigating and 20% learning. Sirch inverts that ratio. You spend your time reading AI summaries of what pages actually say, not clicking through them one by one. A research session that used to take an hour takes six minutes. We've measured it.",
            },
            {
              title: "You'll feel less overwhelmed.",
              color: "#50b0e0",
              text: "Information overload is a real thing. It's why you feel exhausted after an hour of Googling even though you're just sitting in a chair. Your brain is doing thousands of micro-evaluations: Is this link relevant? Is this page trustworthy? Where's the actual answer? Sirch removes all of that cognitive overhead. The answer is right there. Your brain can relax.",
            },
            {
              title: "You'll rediscover curiosity.",
              color: "#60c060",
              text: "Remember when you used to go down rabbit holes for fun? When one question led to another and you'd look up and realize three hours had passed? That stopped happening because search became a chore. Sirch makes it effortless again. We've seen users search for 3X more queries per session — not because they have to, but because they want to. Each result opens a door instead of closing one.",
            },
            {
              title: "You'll get time back.",
              color: "#b060d0",
              text: "This is the big one. Our data shows that Sirch users save an average of 23 minutes per day compared to traditional search. That's 140 hours a year. That's three and a half work weeks. That's a vacation. That's learning a new language. That's writing a book. That's time you'll never get from a search engine that makes you click ten links to find one answer.",
            },
            {
              title: "You'll trust the internet again.",
              color: "#f08040",
              text: "The internet used to feel like a miracle. An infinite library at your fingertips. Then it got buried under ads, SEO spam, AI-generated garbage, and dark patterns designed to waste your time. Sirch cuts through all of it. When you hover over a result, you see what the page actually says — not what it's optimized to make you think it says. Truth becomes the default again.",
            },
          ].map((item, i) => (
            <div key={i} className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ background: item.color, boxShadow: `0 0 20px ${item.color}40` }} />
                <h3 className="text-2xl font-bold">{item.title}</h3>
              </div>
              <p className="text-lg leading-relaxed pl-8" style={{ color: "#999" }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* Testimonials (fictional) */}
      <section className="relative py-32 px-8" style={{ background: "#0a0a0a" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-16 text-center" style={{ color: "#f0c050" }}>
            What People Are Saying
          </h2>
          {[
            { quote: "I used to open 20 tabs for every search. Now I open zero. I just... read the answers. It feels like cheating.", name: "Dr. Sarah Kim", role: "Neuroscience researcher, Johns Hopkins" },
            { quote: "My students submit better papers now. They tell me it's because of Sirch. I tried it. They're right.", name: "Prof. Marcus Webb", role: "History Department, University of Edinburgh" },
            { quote: "I'm a journalist. I fact-check for a living. Sirch lets me verify claims against original sources in seconds instead of hours. It's changed how I work.", name: "Lucia Fernandez", role: "Investigative reporter, freelance" },
            { quote: "I have ADHD. Traditional search is my nightmare — too many choices, too many clicks, too much noise. Sirch is the first search engine that doesn't make my brain hurt.", name: "Jamie Ostrowski", role: "Software engineer, Brooklyn" },
            { quote: "We switched our entire research team to Sirch. Productivity went up 34% in the first month. That's not an exaggeration — we measured it.", name: "Raj Patel", role: "VP of Research, unnamed Fortune 500" },
            { quote: "I'm 74 years old. My granddaughter showed me Sirch. For the first time, the internet feels simple again. Like it was supposed to be.", name: "Eleanor Voss", role: "Retired teacher, Portland" },
          ].map((t, i) => (
            <div key={i} className="mb-12 pl-6" style={{ borderLeft: `3px solid ${COLORS[i % COLORS.length]}` }}>
              <p className="text-lg italic leading-relaxed" style={{ color: "#bbb" }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="text-sm mt-3 font-medium" style={{ color: COLORS[i % COLORS.length] }}>
                {t.name}
              </p>
              <p className="text-xs" style={{ color: "#555" }}>{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* The Manifesto */}
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
              "Speed is a feature. Slowness is a bug.",
              "Every person on earth deserves access to every piece of information ever published.",
              "The internet should feel like wonder, not work.",
              "If you have to read the instructions, we've failed.",
              "The only metric that matters is: did you find what you were looking for?",
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

      <div className="section-divider" />

      {/* The Road Ahead */}
      <section className="relative py-32 px-8" style={{ background: "#0a0a0a" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 gradient-text">
            The Road Ahead
          </h2>
          <p className="text-xl leading-relaxed" style={{ color: "#999" }}>
            What you see today is version one. And version one is already better than anything
            else out there. But we&apos;re just getting started.
          </p>
          <div className="mt-12 space-y-10">
            {[
              {
                title: "Conversational Search",
                desc: "Ask a follow-up question without starting over. Sirch will remember what you were looking for and build on it.",
                color: "#f0c050",
              },
              {
                title: "Source Verification",
                desc: "Every AI summary will link to the exact paragraph on the source page. You'll be able to verify any claim in one click.",
                color: "#e06050",
              },
              {
                title: "Collaborative Search",
                desc: "Share a search session with someone. See their highlights, their summaries, their path through the results. Research becomes a team sport.",
                color: "#50b0e0",
              },
              {
                title: "Offline Intelligence",
                desc: "Save pages and their AI summaries for offline access. Build a personal knowledge base that grows with every search.",
                color: "#60c060",
              },
              {
                title: "The Sirch API",
                desc: "Build on top of Sirch. Use our real-time page reading technology in your own applications. If your app needs to understand a webpage, we'll do it for you.",
                color: "#b060d0",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-6">
                <div
                  className="w-4 h-4 rounded-sm flex-shrink-0 mt-1.5"
                  style={{
                    background: item.color,
                    boxShadow: `0 0 15px ${item.color}40`,
                    animation: `float ${3 + i * 0.3}s ease-in-out infinite`,
                  }}
                />
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-base leading-relaxed" style={{ color: "#888" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* A Letter */}
      <section className="relative py-32 px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center" style={{ color: "#888" }}>
            A Letter From Our Founders
          </h2>
          <div className="space-y-6 text-lg leading-relaxed" style={{ color: "#999" }}>
            <p>Dear curious person,</p>
            <p>
              If you&apos;ve read this far, you&apos;re exactly the kind of person we built Sirch for.
              You care about finding real answers. You&apos;re tired of wading through noise.
              You believe the internet should be better than it is.
            </p>
            <p>
              We do too. That&apos;s why seven of us left stable jobs, drained our savings,
              and spent three years in a tiny office building something that most people
              said was impossible. &ldquo;You can&apos;t read every page in real time,&rdquo;
              they said. &ldquo;The latency alone would kill you.&rdquo;
            </p>
            <p>
              They were almost right. We nearly ran out of money twice. Jin-Soo rewrote the
              infrastructure three times. Tomás had what he calls a &ldquo;productive breakdown&rdquo;
              in month 14. Priya threatened to quit when we tried to add a hamburger menu.
              (She was right. We didn&apos;t add it.)
            </p>
            <p>
              But here we are. And it works. Not perfectly — not yet — but well enough that
              we can&apos;t imagine going back to the old way. We use Sirch for everything.
              Research, shopping, learning, cooking, settling arguments, planning trips,
              understanding the news. It&apos;s become the way we interact with all of
              human knowledge.
            </p>
            <p>
              We want it to be that for you too.
            </p>
            <p>
              Search shouldn&apos;t be a chore. Finding things should feel like magic.
              We&apos;re not there yet, but we&apos;re closer than anyone has ever been.
              And every day, we get a little closer.
            </p>
            <p>
              Thank you for trying Sirch. Thank you for reading this. Thank you for caring
              about how information works.
            </p>
            <p className="mt-8" style={{ color: "#666" }}>
              With gratitude and an unreasonable amount of optimism,
            </p>
            <p className="font-semibold gradient-text text-xl">
              Mika, Tomás, Priya, Jin-Soo, Amara, Leo & Zara
            </p>
            <p className="text-sm" style={{ color: "#444" }}>
              The Sirch Team — New York City, {new Date().getFullYear()}
            </p>
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
          This entire about page — every word, every stat, every team member, every testimonial, every claim — was generated by AI.
          None of these people exist. None of these stats are real. But the search engine is.
        </p>
        <p className="text-xs mt-2" style={{ color: "#333" }}>
          © {new Date().getFullYear()} Sirch AI
        </p>
      </footer>
    </div>
  )
}
