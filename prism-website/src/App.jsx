import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   PRISM — A New Engine for Human Imagination
   Cinematic dark / red / purple / magenta palette
   ───────────────────────────────────────────── */

// ── Intersection Observer hook ──
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── Reveal wrapper ──
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ── Decorative geometric accent (inspired by Prezi squiggly elements) ──
function DecoAccent({ type = "zigzag", color = "#8B2252", style: s = {} }) {
  if (type === "zigzag") {
    return (
      <svg viewBox="0 0 120 24" fill="none" style={{ width: 120, height: 24, ...s }}>
        <polyline points="0,20 15,4 30,20 45,4 60,20 75,4 90,20 105,4 120,20" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === "dots") {
    return (
      <svg viewBox="0 0 100 20" fill="none" style={{ width: 100, height: 20, ...s }}>
        {[0, 25, 50, 75].map((x) => (
          <circle key={x} cx={x + 12} cy={10} r={4} fill={color} opacity={0.6} />
        ))}
      </svg>
    );
  }
  if (type === "diamond") {
    return (
      <svg viewBox="0 0 40 40" fill="none" style={{ width: 40, height: 40, ...s }}>
        <rect x="10" y="10" width="20" height="20" rx="2" transform="rotate(45 20 20)" stroke={color} strokeWidth="2" fill="none" />
      </svg>
    );
  }
  if (type === "triangle") {
    return (
      <svg viewBox="0 0 36 36" fill="none" style={{ width: 36, height: 36, ...s }}>
        <polygon points="18,4 34,32 2,32" stroke={color} strokeWidth="2" fill="none" />
      </svg>
    );
  }
  return null;
}

// ── Section divider with gradient ──
function Divider({ gradient = "linear-gradient(90deg, transparent, #C4351A, transparent)" }) {
  return <div style={{ height: 1, background: gradient, opacity: 0.5, margin: 0 }} />;
}

// ── PRISM Logo SVG (geometric prism mark) ──
function PrismLogo({ size = 40 }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
      <defs>
        <linearGradient id="prismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E74BA3" />
          <stop offset="33%" stopColor="#C4351A" />
          <stop offset="66%" stopColor="#8B2252" />
          <stop offset="100%" stopColor="#4DD0E1" />
        </linearGradient>
      </defs>
      <polygon points="24,4 44,40 4,40" stroke="url(#prismGrad)" strokeWidth="2.5" fill="none" />
      <line x1="24" y1="4" x2="14" y2="40" stroke="#C4351A" strokeWidth="1.5" opacity="0.5" />
      <line x1="24" y1="4" x2="34" y2="40" stroke="#8B2252" strokeWidth="1.5" opacity="0.5" />
      <line x1="24" y1="4" x2="24" y2="40" stroke="#E74BA3" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

// ── Grain overlay component ──
function GrainOverlay() {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.35,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    }} />
  );
}

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════
export default function PrismWebsite() {
  const [scrolled, setScrolled] = useState(false);
  const videoRef = useRef(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleVideo = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setVideoPlaying(true); }
    else { v.pause(); setVideoPlaying(false); }
  }, []);

  // ── Section gradient config (diversified, never repeating) ──
  const gradients = {
    hero: "radial-gradient(ellipse 70% 60% at 20% 70%, rgba(196,53,26,0.3) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 30%, rgba(139,34,82,0.2) 0%, transparent 60%)",
    manifesto: "radial-gradient(ellipse 60% 50% at 70% 50%, rgba(77,208,225,0.08) 0%, transparent 60%)",
    video: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(139,34,82,0.15) 0%, transparent 70%)",
    whatIs: "radial-gradient(ellipse 60% 50% at 30% 60%, rgba(196,53,26,0.1) 0%, transparent 60%)",
    bridge: "radial-gradient(ellipse 50% 40% at 60% 40%, rgba(231,75,163,0.1) 0%, transparent 60%)",
    training: "radial-gradient(ellipse 70% 50% at 80% 60%, rgba(77,208,225,0.12) 0%, transparent 60%)",
    agency: "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(139,34,82,0.15) 0%, transparent 60%)",
    studio: "radial-gradient(ellipse 60% 50% at 70% 40%, rgba(196,53,26,0.12) 0%, transparent 60%)",
    why: "radial-gradient(ellipse 60% 50% at 40% 60%, rgba(231,75,163,0.1) 0%, transparent 60%)",
    cta: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(196,53,26,0.25) 0%, transparent 70%)",
  };

  // ── Section-specific accent gradients for headings ──
  const headingGradients = {
    hero: "linear-gradient(135deg, #E74BA3, #C4351A, #8B2252)",
    manifesto: "linear-gradient(90deg, #4DD0E1, #80CBC4)",
    whatIs: "linear-gradient(90deg, #C4351A, #E74BA3)",
    bridge: "linear-gradient(90deg, #8B2252, #4DD0E1)",
    training: "linear-gradient(90deg, #E74BA3, #C91D7D)",
    agency: "linear-gradient(90deg, #4DD0E1, #80CBC4)",
    studio: "linear-gradient(90deg, #C4351A, #8B2252)",
    why: "linear-gradient(90deg, #E74BA3, #4DD0E1)",
    cta: "linear-gradient(135deg, #C4351A, #E74BA3, #8B2252)",
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#0a0608", color: "#f0ebe0", lineHeight: 1.6, overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; }
        ::selection { background: rgba(231,75,163,0.3); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scrollPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        a { text-decoration: none; color: inherit; }
      `}</style>

      {/* ═══ NAVIGATION ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? "0.7rem 0" : "1.2rem 0",
        background: "rgba(10,6,8,0.8)", backdropFilter: "blur(20px) saturate(1.2)",
        borderBottom: "1px solid rgba(240,235,224,0.06)", transition: "padding 0.3s",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#top" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <img src="prism-logo-mark.png" alt="PRISM" style={{ width: 32, height: 32 }} />
            <span style={{ fontWeight: 900, fontSize: "1.2rem", letterSpacing: "0.25em", color: "#f0ebe0" }}>PRISM</span>
          </a>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            {["About", "Training", "Agency", "Studio", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{
                color: "#8a7e84", fontSize: "0.8rem", fontWeight: 500,
                letterSpacing: "0.08em", textTransform: "uppercase", transition: "color 0.3s",
              }}
                onMouseEnter={(e) => (e.target.style.color = "#f0ebe0")}
                onMouseLeave={(e) => (e.target.style.color = "#8a7e84")}
              >{item}</a>
            ))}
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="top" style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", padding: "8rem 2rem 6rem",
      }}>
        <div style={{ position: "absolute", inset: 0, background: gradients.hero }} />
        <GrainOverlay />
        {/* Floating prism cube */}
        <img src="" alt="" style={{
          position: "absolute", right: "5%", top: "15%", width: "clamp(200px, 25vw, 400px)",
          opacity: 0.2, animation: "float 6s ease-in-out infinite", zIndex: 0,
          filter: "blur(1px)", pointerEvents: "none",
        }} />
        {/* Decorative geometric pattern - top left */}
        <img src="deco-geometric-pattern.png" alt="" style={{
          position: "absolute", left: "-5%", bottom: "10%", width: "clamp(150px, 20vw, 300px)",
          opacity: 0.06, transform: "rotate(-15deg)", zIndex: 0, pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 1000 }}>
          <Reveal>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#E74BA3", marginBottom: "2rem" }}>
              A New Engine for Human Imagination
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <h1 style={{ fontSize: "clamp(4rem, 14vw, 10rem)", fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.04em", marginBottom: "1.5rem" }}>
  <span style={{ color: "#fff" }}>PRISM</span>
</h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 700, marginBottom: "1.5rem", lineHeight: 1.3, color: "#fff" }}>
              A global creative system designed to launch the next generation of <span style={{ background: headingGradients.training, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>world-shaping IP</span>.
            </p>
          </Reveal>
          <Reveal delay={0.45}>
            <p style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", color: "#8a7e84", fontWeight: 300, maxWidth: 720, margin: "0 auto 3rem", lineHeight: 1.7 }}>
              PRISM is a creative production and innovation company building the future of storytelling. We train creators. We produce premium creative work. We develop original IP designed for global audiences.
            </p>
          </Reveal>
          <Reveal delay={0.6}>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="#about" style={{
                padding: "1rem 2.5rem", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.15em",
                textTransform: "uppercase", background: "#C4351A", color: "#fff", border: "none", cursor: "pointer",
                transition: "all 0.3s",
              }}>Discover PRISM</a>
              <a href="#contact" style={{
                padding: "1rem 2.5rem", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.15em",
                textTransform: "uppercase", background: "transparent", color: "#f0ebe0",
                border: "1px solid rgba(240,235,224,0.15)", cursor: "pointer", transition: "all 0.3s",
              }}>Partner With Us</a>
            </div>
          </Reveal>
        </div>
        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", opacity: 0, animation: "fadeUp 0.8s 1.2s forwards" }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8a7e84" }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #E74BA3, transparent)", animation: "scrollPulse 2s infinite" }} />
        </div>
      </section>

      {/* ═══ MANIFESTO ═══ */}
      <section style={{ position: "relative", padding: "clamp(5rem, 10vw, 10rem) 2rem", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: gradients.manifesto }} />
        <GrainOverlay />
        {/* Atmospheric portrait */}
        <img src="creative-portrait-afro.png" alt="" style={{
          position: "absolute", right: "-5%", bottom: "-5%", height: "80%",
          opacity: 0.07, zIndex: 0, pointerEvents: "none", filter: "grayscale(0.5)",
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#4DD0E1", marginBottom: "1.5rem" }}>The World Is Waiting</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.05, marginBottom: "1.5rem", color: "#fff" }}>
              The World Is Waiting For{" "}
              <span style={{ background: headingGradients.manifesto, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>New Stories</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontSize: "1.1rem", color: "#8a7e84", fontStyle: "italic", marginBottom: "2.5rem" }}>
              The global supply chain for storytelling is strained.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "clamp(1.5rem, 4vw, 2.4rem)", fontWeight: 700, marginBottom: "3rem" }}>
              <span style={{ color: "#C4351A" }}>Too expensive.</span>
              <span style={{ color: "#E74BA3" }}>Too slow.</span>
              <span style={{ color: "#8B2252" }}>Too homogeneous.</span>
              <span style={{ color: "#4DD0E1" }}>Too risk-averse.</span>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <DecoAccent type="zigzag" color="#8B2252" style={{ margin: "0 auto 2rem" }} />
          </Reveal>
          <Reveal delay={0.5}>
            <p style={{ fontSize: "1.1rem", color: "#8a7e84", maxWidth: 720, margin: "0 auto 2rem", lineHeight: 1.8 }}>
              <strong style={{ color: "#f0ebe0" }}>Audiences want new voices.</strong>{" "}
              <strong style={{ color: "#f0ebe0" }}>Platforms need more content.</strong>{" "}
              Culture is shifting faster than traditional production systems can keep up.
            </p>
            <p style={{ fontSize: "clamp(1.1rem, 2vw, 1.3rem)", color: "#f0ebe0", maxWidth: 720, margin: "0 auto", lineHeight: 1.6, fontWeight: 500 }}>
              PRISM exists to meet this moment. Not as another agency. Not as another studio. But as a{" "}
              <span style={{ color: "#4DD0E1" }}>new creative infrastructure layer</span> for the modern world.
            </p>
          </Reveal>
        </div>
      </section>

      <Divider gradient="linear-gradient(90deg, transparent, #8B2252, transparent)" />

      {/* ═══ VIDEO SECTION ═══ */}
      <section id="story" style={{ position: "relative", padding: "clamp(5rem, 8vw, 8rem) 2rem", background: "#050304" }}>
        <div style={{ position: "absolute", inset: 0, background: gradients.video }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#E74BA3", marginBottom: "1rem" }}>See the Vision</p>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#fff" }}>The PRISM Story</h2>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div onClick={toggleVideo} style={{
              position: "relative", width: "100%", aspectRatio: "16/9", background: "#000",
              border: "1px solid rgba(240,235,224,0.12)", overflow: "hidden", cursor: "pointer",
            }}>
              {/* Corner accents */}
              {[
                { top: -1, left: -1, borderTop: "2px solid #C4351A", borderLeft: "2px solid #C4351A" },
                { top: -1, right: -1, borderTop: "2px solid #8B2252", borderRight: "2px solid #8B2252" },
                { bottom: -1, left: -1, borderBottom: "2px solid #E74BA3", borderLeft: "2px solid #E74BA3" },
                { bottom: -1, right: -1, borderBottom: "2px solid #4DD0E1", borderRight: "2px solid #4DD0E1" },
              ].map((s, i) => (
                <div key={i} style={{ position: "absolute", width: 28, height: 28, zIndex: 3, pointerEvents: "none", ...s }} />
              ))}

              <video ref={videoRef} preload="metadata" playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onEnded={() => setVideoPlaying(false)}>
                <source src="prism_prezi.mp4" type="video/mp4" />
              </video>

              {!videoPlaying && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(10,6,8,0.55)", zIndex: 2, transition: "background 0.4s",
                }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: "50%", border: "2px solid rgba(240,235,224,0.6)",
                    display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(196,53,26,0.15)",
                  }}>
                    <div style={{ width: 0, height: 0, borderLeft: "24px solid #f0ebe0", borderTop: "14px solid transparent", borderBottom: "14px solid transparent", marginLeft: 6 }} />
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <Divider gradient="linear-gradient(90deg, transparent, #E74BA3, transparent)" />

      {/* ═══ WHAT IS PRISM ═══ */}
      <section id="about" style={{ position: "relative", padding: "clamp(5rem, 10vw, 10rem) 2rem", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: gradients.whatIs }} />
        {/* Newton prism experiment — atmospheric background */}
        <img src="newton-prism-experiment.jpg" alt="" style={{
          position: "absolute", right: "-2%", top: "50%", transform: "translateY(-50%)",
          width: "clamp(250px, 35vw, 500px)", opacity: 0.08, zIndex: 0,
          pointerEvents: "none", filter: "grayscale(0.3)",
        }} />
        {/* Purple zigzag accent */}
        <img src="deco-zigzag-purple.png" alt="" style={{
          position: "absolute", left: "2%", bottom: "8%", width: "clamp(80px, 12vw, 160px)",
          opacity: 0.12, zIndex: 0, pointerEvents: "none", transform: "rotate(-10deg)",
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#C4351A", marginBottom: "1.5rem" }}>What Is PRISM</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.05, marginBottom: "1.5rem", color: "#fff" }}>
              A Creative BPO for{" "}
              <span style={{ background: headingGradients.whatIs, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>the World</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontSize: "1.15rem", color: "#f0ebe0", maxWidth: 760, lineHeight: 1.7, fontWeight: 400, marginBottom: "2rem" }}>
              PRISM is building a distributed creative production system designed for the AI era — where global brands, streaming platforms, technology companies, and creators can access agile, high-quality, culturally intelligent creative production at scale.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "3rem" }}>
              {["Creative training", "Agency production", "AI-powered workflows", "Original IP development", "Distributed creator networks"].map((item, i) => {
                const colors = ["#C4351A", "#E74BA3", "#4DD0E1", "#8B2252", "#80CBC4"];
                return (
                  <span key={item} style={{
                    padding: "0.7rem 1.3rem", fontSize: "0.85rem", color: "#f0ebe0", fontWeight: 500,
                    background: "#1a1013", borderLeft: `3px solid ${colors[i]}`,
                  }}>{item}</span>
                );
              })}
            </div>
          </Reveal>
          <Reveal delay={0.35}>
            <DecoAccent type="dots" color="#E74BA3" style={{ marginBottom: "1rem" }} />
            <p style={{ fontSize: "1rem", color: "#8a7e84" }}>…into one connected ecosystem.</p>
          </Reveal>
        </div>
      </section>

      {/* ═══ BRIDGE: ART & COMMERCE ═══ */}
      <section style={{
        position: "relative", padding: "clamp(5rem, 10vw, 8rem) 2rem", textAlign: "center",
        borderTop: "1px solid rgba(240,235,224,0.06)", borderBottom: "1px solid rgba(240,235,224,0.06)",
      }}>
        <div style={{ position: "absolute", inset: 0, background: gradients.bridge }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#8B2252", marginBottom: "1.5rem" }}>Art & Commerce</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "2rem", color: "#fff" }}>
              PRISM Bridges the Gap Between{" "}
              <span style={{ background: headingGradients.bridge, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Art & Commerce</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontSize: "1.1rem", color: "#8a7e84", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              We help creators become commercially fluent. We help brands become culturally relevant.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <DecoAccent type="diamond" color="#4DD0E1" style={{ margin: "1.5rem auto" }} />
          </Reveal>
          <Reveal delay={0.35}>
            <p style={{ fontSize: "clamp(1.1rem, 2vw, 1.3rem)", color: "#f0ebe0", fontWeight: 500, lineHeight: 1.5 }}>
              Where <span style={{ color: "#E74BA3" }}>strategy meets imagination</span>.<br />
              Where <span style={{ color: "#4DD0E1" }}>creativity meets systems</span>.<br />
              Where <span style={{ color: "#8B2252" }}>stories become scalable</span>.
            </p>
          </Reveal>
        </div>
      </section>

      <Divider gradient="linear-gradient(90deg, transparent, #4DD0E1, transparent)" />

      {/* ═══ WHAT WE DO — THREE PILLARS ═══ */}
      <section style={{ padding: "clamp(4rem, 8vw, 6rem) 2rem 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#C91D7D", marginBottom: "1rem" }}>What We Do</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", color: "#fff" }}>
              Three Divisions.<br />
              <span style={{ background: headingGradients.cta, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>One Connected Ecosystem.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <DecoAccent type="zigzag" color="#C91D7D" style={{ margin: "2rem auto 0" }} />
          </Reveal>
        </div>
      </section>

      {/* ─── 01 PRISM TRAINING (HERO DIVISION) ─── */}
      <section id="training" style={{ position: "relative", padding: "clamp(4rem, 6vw, 6rem) 2rem clamp(5rem, 8vw, 8rem)" }}>
        <div style={{ position: "absolute", inset: 0, background: gradients.training }} />
        <GrainOverlay />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "2rem" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.85rem", color: "#E74BA3", letterSpacing: "0.15em" }}>01</span>
              <h2 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1, marginTop: "0.5rem", color: "#fff" }}>
                PRISM{" "}
                <span style={{ background: headingGradients.training, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Training</span>
              </h2>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#4DD0E1", marginTop: "0.75rem" }}>Building Sustainable Creators</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontSize: "1.1rem", color: "#8a7e84", maxWidth: 760, lineHeight: 1.8, fontWeight: 300, marginBottom: "3rem" }}>
              A modern creative learning and industry upskilling platform designed for the future of storytelling. We equip creators, teams, and organizations with the creative, strategic, and production capabilities needed to thrive.
            </p>
          </Reveal>

          {/* Three training sub-programs in visual blocks */}
          <Reveal delay={0.2}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1px", background: "rgba(240,235,224,0.06)", border: "1px solid rgba(240,235,224,0.06)", marginBottom: "3rem" }}>
              {/* Incubator */}
              <div style={{ background: "#120a0d", padding: "2.5rem" }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#C4351A", letterSpacing: "0.2em" }}>PROGRAM 01</span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", margin: "0.75rem 0 1rem" }}>The 12-Week PRISM Creative Incubator</h3>
                <p style={{ fontSize: "0.9rem", color: "#8a7e84", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                  An immersive AI-first creative incubator designed to help creators build sustainable careers in the modern creator economy.
                </p>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#E74BA3", marginBottom: "0.75rem" }}>Career Pathways</p>
                {["Original IP Creators", "Platform Builders", "Artist Collaborators", "Commercial Creators", "Hybrid Creators"].map((p) => (
                  <p key={p} style={{ fontSize: "0.85rem", color: "#8a7e84", padding: "0.4rem 0", borderBottom: "1px solid rgba(240,235,224,0.06)" }}>
                    <span style={{ color: "#C4351A", marginRight: "0.5rem" }}>→</span> {p}
                  </p>
                ))}
              </div>

              {/* Curriculum Design */}
              <div style={{ background: "#120a0d", padding: "2.5rem" }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#8B2252", letterSpacing: "0.2em" }}>PROGRAM 02</span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", margin: "0.75rem 0 1rem" }}>Curriculum Design & Industry Capacity Building</h3>
                <p style={{ fontSize: "0.9rem", color: "#8a7e84", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                  We partner with brands, institutions, creative ecosystems, and industry stakeholders to design and deliver future-focused creative learning experiences.
                </p>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#4DD0E1", marginBottom: "0.75rem" }}>We help organizations</p>
                {["Upskill creative teams", "Integrate AI into creative workflows", "Build internal storytelling capability", "Train emerging creative talent"].map((p) => (
                  <p key={p} style={{ fontSize: "0.85rem", color: "#8a7e84", padding: "0.4rem 0", borderBottom: "1px solid rgba(240,235,224,0.06)" }}>
                    <span style={{ color: "#8B2252", marginRight: "0.5rem" }}>→</span> {p}
                  </p>
                ))}
              </div>

              {/* Creative Leadership */}
              <div style={{ background: "#120a0d", padding: "2.5rem" }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#4DD0E1", letterSpacing: "0.2em" }}>PROGRAM 03</span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", margin: "0.75rem 0 1rem" }}>Creative Leadership & Industry Workshops</h3>
                <p style={{ fontSize: "0.9rem", color: "#8a7e84", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                  Short-form workshops and executive learning experiences for professionals navigating the future of creativity and AI-powered production.
                </p>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#E74BA3", marginBottom: "0.75rem" }}>Topics include</p>
                {["AI & the future of creativity", "Creative leadership", "Storytelling for brands", "Platform-native content strategy", "Creator economy trends", "Creative entrepreneurship"].map((p) => (
                  <p key={p} style={{ fontSize: "0.85rem", color: "#8a7e84", padding: "0.4rem 0", borderBottom: "1px solid rgba(240,235,224,0.06)" }}>
                    <span style={{ color: "#4DD0E1", marginRight: "0.5rem" }}>→</span> {p}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Why PRISM Training */}
          <Reveal delay={0.3}>
            <DecoAccent type="triangle" color="#E74BA3" style={{ marginBottom: "1.5rem" }} />
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C4351A", marginBottom: "1.5rem" }}>Why PRISM Training</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem" }}>
              {[
                { title: "AI-First Curriculum", desc: "Creators learn modern production workflows using the latest AI creative tools.", color: "#C4351A" },
                { title: "Real Production Experience", desc: "Creators develop films, branded content, social campaigns, and platform-native work.", color: "#E74BA3" },
                { title: "Creativity + Commerce", desc: "PRISM develops creators who understand both artistic excellence and commercial execution.", color: "#8B2252" },
                { title: "Built for the Modern Creator Economy", desc: "Prepares creators for platforms, agencies, original IP creation, and evolving AI-powered industries.", color: "#4DD0E1" },
              ].map((c) => (
                <div key={c.title} style={{ paddingTop: "1.5rem", borderTop: `2px solid ${c.color}` }}>
                  <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>{c.title}</h4>
                  <p style={{ fontSize: "0.85rem", color: "#8a7e84", lineHeight: 1.7 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Divider gradient="linear-gradient(90deg, transparent, #C91D7D, transparent)" />

      {/* ─── 02 PRISM AGENCY ─── */}
      <section id="agency" style={{ position: "relative", padding: "clamp(5rem, 8vw, 8rem) 2rem", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: gradients.agency }} />
        <GrainOverlay />
        {/* Creative woman in ankara — accent portrait */}
        <img src="creative-woman-ankara.png" alt="" style={{
          position: "absolute", left: "-3%", top: "10%", height: "60%",
          opacity: 0.1, zIndex: 0, pointerEvents: "none",
        }} />
        {/* Texture grid accent */}
        <img src="texture-grid-red.png" alt="" style={{
          position: "absolute", right: "0", bottom: "0", width: "clamp(120px, 15vw, 250px)",
          opacity: 0.05, zIndex: 0, pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.85rem", color: "#4DD0E1", letterSpacing: "0.15em" }}>02</span>
            <h2 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1, marginTop: "0.5rem", color: "#fff" }}>
              PRISM{" "}
              <span style={{ background: headingGradients.agency, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Agency</span>
            </h2>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B2252", marginTop: "0.75rem", marginBottom: "2rem" }}>Premium Creative Services at Scale</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontSize: "1.1rem", color: "#8a7e84", maxWidth: 760, lineHeight: 1.8, fontWeight: 300, marginBottom: "3rem" }}>
              A full-service creative agency delivering premium creative work for African and international clients. Powered by top-performing talent from the PRISM ecosystem, AI-enhanced workflows, and commercially driven strategy.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(240,235,224,0.06)" }}>
              {[
                { title: "Brand Strategy & Creative Development", desc: "We help brands define how they show up in culture.", tags: ["Brand positioning", "Creative direction", "Campaign development", "Visual identity"], color: "#C4351A" },
                { title: "AI-Powered Advertising", desc: "Modern advertising leveraging AI-native workflows to accelerate creative production at premium quality.", tags: ["Rapid campaigns", "Performance creative", "A/B testing", "Localization"], color: "#E74BA3" },
                { title: "Content Production", desc: "From cinematic storytelling to social-first execution — content built for modern audiences and platforms.", tags: ["Commercial", "Branded content", "Social video", "Documentary", "Motion graphics"], color: "#8B2252" },
                { title: "Platform & Creator Content", desc: "We help brands and creators build meaningful digital presence and sustained audience engagement.", tags: ["YouTube", "TikTok", "Podcast", "Creator partnerships"], color: "#4DD0E1" },
              ].map((svc) => (
                <div key={svc.title} style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "2rem", padding: "2rem 0", borderBottom: "1px solid rgba(240,235,224,0.06)", alignItems: "start" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, lineHeight: 1.2, color: "#fff", borderLeft: `3px solid ${svc.color}`, paddingLeft: "1rem" }}>{svc.title}</h3>
                  <div>
                    <p style={{ fontSize: "0.95rem", color: "#8a7e84", lineHeight: 1.7, marginBottom: "1rem" }}>{svc.desc}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {svc.tags.map((t) => (
                        <span key={t} style={{ fontSize: "0.7rem", padding: "0.35rem 0.8rem", border: "1px solid rgba(240,235,224,0.08)", color: "#8a7e84", fontFamily: "'Space Mono', monospace" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Divider gradient="linear-gradient(90deg, transparent, #8B2252, transparent)" />

      {/* ─── 03 PRISM IP STUDIO ─── */}
      <section id="studio" style={{ position: "relative", padding: "clamp(5rem, 8vw, 8rem) 2rem", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: gradients.studio }} />
        <GrainOverlay />
        {/* Creative woman with sunglasses — global stories energy */}
        <img src="creative-woman-sunglasses.png" alt="" style={{
          position: "absolute", right: "-2%", top: "5%", height: "70%",
          opacity: 0.1, zIndex: 0, pointerEvents: "none",
        }} />
        {/* Geometric accent */}
        <img src="deco-geometric-pattern.png" alt="" style={{
          position: "absolute", left: "0", bottom: "0", width: "clamp(100px, 15vw, 220px)",
          opacity: 0.04, zIndex: 0, pointerEvents: "none", transform: "rotate(15deg)",
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.85rem", color: "#C4351A", letterSpacing: "0.15em" }}>03</span>
            <h2 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1, marginTop: "0.5rem", color: "#fff" }}>
              PRISM{" "}
              <span style={{ background: headingGradients.studio, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>IP Studio</span>
            </h2>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#E74BA3", marginTop: "0.75rem", marginBottom: "2rem" }}>Developing Stories That Travel</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontSize: "1.1rem", color: "#8a7e84", maxWidth: 760, lineHeight: 1.8, fontWeight: 300, marginBottom: "2rem" }}>
              PRISM IP Studio develops original formats, concepts, and entertainment properties designed for global audiences.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <h3 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, marginBottom: "1.5rem", color: "#fff" }}>
              Not <em style={{ fontStyle: "normal", background: headingGradients.studio, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>"African stories."</em>{" "}
              <span style={{ background: headingGradients.agency, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Global stories.</span>
            </h3>
          </Reveal>
          <Reveal delay={0.25}>
            <p style={{ fontSize: "1rem", color: "#8a7e84", maxWidth: 700, lineHeight: 1.7, marginBottom: "2rem" }}>
              Built with new depth. New rhythm. New emotional palettes.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ padding: "2rem", borderLeft: "3px solid #C4351A", background: "#120a0d", marginBottom: "2.5rem", maxWidth: 700 }}>
              <p style={{ fontSize: "1rem", color: "#f0ebe0", lineHeight: 1.8 }}>
                We believe the future belongs to stories with:<br />
                <strong style={{ color: "#E74BA3" }}>→ strong emotional architecture,</strong><br />
                <strong style={{ color: "#4DD0E1" }}>→ distinct creative identity,</strong><br />
                <strong style={{ color: "#8B2252" }}>→ and universal resonance.</strong>
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.35}>
            <DecoAccent type="zigzag" color="#4DD0E1" style={{ marginBottom: "1.5rem" }} />
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C4351A", marginBottom: "1rem" }}>What We Develop</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {["YouTube-native formats", "Documentary & unscripted", "Branded entertainment", "Social storytelling", "Original digital IP", "Creative franchises", "Format development & pilots"].map((f) => (
                <span key={f} style={{ padding: "0.7rem 1.3rem", border: "1px solid rgba(240,235,224,0.12)", fontSize: "0.85rem", color: "#8a7e84", transition: "all 0.3s" }}>{f}</span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(240,235,224,0.06)" }}>
              <p style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)", fontWeight: 600, lineHeight: 1.4, color: "#f0ebe0" }}>
                This is where <span style={{ color: "#4DD0E1" }}>ideas become worlds</span>.<br />
                And <span style={{ color: "#E74BA3" }}>worlds become franchises</span>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Divider gradient="linear-gradient(90deg, transparent, #E74BA3, transparent)" />

      {/* ═══ WHY PRISM ═══ */}
      <section style={{ position: "relative", padding: "clamp(5rem, 8vw, 8rem) 2rem" }}>
        <div style={{ position: "absolute", inset: 0, background: gradients.why }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#E74BA3", marginBottom: "1.5rem" }}>Why PRISM</p>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#fff", marginBottom: "3rem" }}>
              Why{" "}
              <span style={{ background: headingGradients.why, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PRISM</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem" }}>
              {[
                { title: "AI-Native by Design", desc: "We use AI to accelerate ideation, production, editing, localization, and creative iteration — enabling faster delivery without sacrificing quality.", color: "#C4351A" },
                { title: "Built for Scale", desc: "A connected network of creative production hubs capable of delivering high-volume, high-quality work across multiple markets.", color: "#E74BA3" },
                { title: "Platform-First Thinking", desc: "Content designed for how audiences consume media now — social-first, creator-led, mobile-native, and globally distributed.", color: "#4DD0E1" },
                { title: "Developing the Next Generation", desc: "PRISM helps creators not only produce great work — but build sustainable careers, businesses, audiences, and intellectual property.", color: "#8B2252" },
              ].map((c) => (
                <div key={c.title} style={{ paddingTop: "2rem", borderTop: `2px solid ${c.color}` }}>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>{c.title}</h4>
                  <p style={{ fontSize: "0.9rem", color: "#8a7e84", lineHeight: 1.7 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ PARTNERS ═══ */}
      <section style={{ padding: "clamp(5rem, 8vw, 8rem) 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#8B2252", marginBottom: "1.5rem" }}>Who We Work With</p>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", marginBottom: "2rem" }}>
              Partners & <span style={{ background: "linear-gradient(90deg, #C4351A, #8B2252)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Collaborators</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "2rem" }}>
              {["Global brands", "Streaming platforms", "Technology companies", "Media companies", "Startups & ventures", "Broadcasters", "Creative institutions", "Foundations & ecosystem partners"].map((p) => (
                <span key={p} style={{ padding: "0.8rem 1.5rem", border: "1px solid rgba(240,235,224,0.12)", fontSize: "0.85rem", color: "#8a7e84" }}>{p}</span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p style={{ fontSize: "1rem", color: "#8a7e84", maxWidth: 720, lineHeight: 1.7 }}>
              We collaborate with organizations looking for bold storytelling, modern production capability, and culturally relevant creative execution.
            </p>
          </Reveal>
        </div>
      </section>

      <Divider gradient="linear-gradient(90deg, transparent, #C4351A, transparent)" />

      {/* ═══ CTA ═══ */}
      <section id="contact" style={{ position: "relative", textAlign: "center", padding: "clamp(6rem, 12vw, 14rem) 2rem", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: gradients.cta }} />
        <GrainOverlay />
        {/* Futuristic creator — "Imagine It First" */}
        <img src="futuristic-creator.png" alt="" style={{
          position: "absolute", right: "5%", bottom: "0", height: "70%",
          opacity: 0.12, zIndex: 0, pointerEvents: "none",
        }} />
        {/* Purple zigzag accent left */}
        <img src="deco-zigzag-purple.png" alt="" style={{
          position: "absolute", left: "3%", top: "20%", width: "clamp(60px, 10vw, 120px)",
          opacity: 0.1, zIndex: 0, pointerEvents: "none", transform: "rotate(90deg)",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#C4351A", marginBottom: "2rem" }}>The Future</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 style={{ fontSize: "clamp(2.2rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1, marginBottom: "2.5rem", letterSpacing: "-0.03em", color: "#fff" }}>
              The Future Belongs<br />To Those Who<br />
              <span style={{ background: headingGradients.cta, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Imagine It First</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <DecoAccent type="zigzag" color="#E74BA3" style={{ margin: "0 auto 2rem" }} />
            <p style={{ fontSize: "1.1rem", color: "#8a7e84", maxWidth: 720, margin: "0 auto 1.5rem", lineHeight: 1.7 }}>
              PRISM is building a new model for creative production — one where technology, talent, and storytelling converge to create globally resonant work at scale.
            </p>
            <p style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)", fontWeight: 700, margin: "2rem 0 3rem", lineHeight: 1.4, color: "#f0ebe0" }}>
              This is not just a production company.<br />
              <span style={{ background: headingGradients.cta, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>It is a new engine for human imagination.</span>
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <a href="mailto:hello@prism.studio" style={{
              display: "inline-block", padding: "1rem 2.5rem", fontSize: "0.8rem", fontWeight: 700,
              letterSpacing: "0.15em", textTransform: "uppercase", background: "#C4351A", color: "#fff",
              border: "none", cursor: "pointer", transition: "all 0.3s",
            }}>Get in Touch</a>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "4rem 2rem 2rem", borderTop: "1px solid rgba(240,235,224,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "4rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <img src="prism-logo-mark.png" alt="PRISM" style={{ width: 28, height: 28 }} />
                <span style={{ fontWeight: 900, fontSize: "1rem", letterSpacing: "0.25em" }}>PRISM</span>
              </div>
              <p style={{ color: "#8a7e84", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: 320 }}>
                A new engine for human imagination. A global creative system designed to launch the next generation of world-shaping IP.
              </p>
            </div>
            {[
              { title: "Company", links: [{ label: "About", href: "#about" }, { label: "Partners", href: "#partners" }, { label: "Contact", href: "#contact" }] },
              { title: "Divisions", links: [{ label: "PRISM Training", href: "#training" }, { label: "PRISM Agency", href: "#agency" }, { label: "PRISM IP Studio", href: "#studio" }] },
              { title: "Connect", links: [{ label: "LinkedIn", href: "#" }, { label: "Instagram", href: "#" }, { label: "YouTube", href: "#" }] },
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C4351A", marginBottom: "1.25rem" }}>{col.title}</h4>
                {col.links.map((l) => (
                  <a key={l.label} href={l.href} style={{ display: "block", color: "#8a7e84", fontSize: "0.9rem", marginBottom: "0.75rem", transition: "color 0.3s" }}
                    onMouseEnter={(e) => (e.target.style.color = "#f0ebe0")}
                    onMouseLeave={(e) => (e.target.style.color = "#8a7e84")}
                  >{l.label}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "2rem", borderTop: "1px solid rgba(240,235,224,0.06)", fontSize: "0.75rem", color: "#8a7e84" }}>
            <span>© 2026 PRISM. All rights reserved.</span>
            <span style={{ fontFamily: "'Space Mono', monospace" }}>A New Engine for Human Imagination</span>
          </div>
        </div>
      </footer>
    </div>
  );
}