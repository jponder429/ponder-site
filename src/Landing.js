import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#0e0c0a",
  bgAlt: "#141210",
  bgCard: "#1a1714",
  bgCardHover: "#201d18",
  gold: "#c4a46b",
  goldLight: "#d9bc8a",
  goldDark: "#9a7a45",
  goldFaint: "#c4a46b18",
  ink: "#f0ebe3",
  inkMid: "#c8bfb0",
  inkLight: "#8a8070",
  border: "#2e2820",
  borderGold: "#c4a46b40",
};

const styles = {
  nav: {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    padding: "20px 48px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    borderBottom: `1px solid ${C.border}`,
    backdropFilter: "blur(20px)",
    background: "rgba(14,12,10,0.85)",
  },
  logo: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 800, fontSize: 26, color: C.ink, letterSpacing: "-0.01em",
    textDecoration: "none",
  },
  logoPeriod: { color: C.gold },
  navLinks: { display: "flex", alignItems: "center", gap: 32 },
  navLink: {
    color: C.inkMid, fontSize: 15, fontFamily: "'Cormorant Garamond', Georgia, serif",
    textDecoration: "none", letterSpacing: "0.02em", cursor: "pointer",
    transition: "color 0.2s",
  },
  demoBtn: {
    padding: "10px 24px",
    background: "transparent",
    border: `1px solid ${C.borderGold}`,
    color: C.gold,
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 700, fontSize: 14,
    borderRadius: 2, cursor: "pointer",
    letterSpacing: "0.05em",
    transition: "all 0.2s",
  },
  hero: {
    minHeight: "100vh",
    display: "flex", flexDirection: "column",
    justifyContent: "center", alignItems: "center",
    textAlign: "center",
    padding: "120px 48px 80px",
    position: "relative",
    overflow: "hidden",
  },
  heroEyebrow: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
    color: C.gold, marginBottom: 28,
  },
  heroH1: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 800, fontSize: "clamp(44px, 7vw, 88px)",
    color: C.ink, lineHeight: 1.05,
    maxWidth: 900, marginBottom: 8,
  },
  heroH1Gold: { color: C.gold, fontStyle: "italic" },
  heroSub: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "clamp(18px, 2.5vw, 24px)",
    color: C.inkMid, maxWidth: 600,
    lineHeight: 1.7, margin: "24px auto 48px",
    fontStyle: "italic",
  },
  heroActions: { display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" },
  btnPrimary: {
    padding: "16px 36px",
    background: C.gold, color: "#0e0c0a",
    border: "none", borderRadius: 2,
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 700, fontSize: 16,
    cursor: "pointer", letterSpacing: "0.03em",
    transition: "all 0.2s",
  },
  btnSecondary: {
    padding: "16px 36px",
    background: "transparent",
    border: `1px solid ${C.border}`,
    color: C.inkMid, borderRadius: 2,
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontStyle: "italic", fontSize: 18,
    cursor: "pointer", letterSpacing: "0.02em",
    transition: "all 0.2s",
  },
  statsRow: {
    display: "flex", justifyContent: "center", gap: 0,
    borderTop: `1px solid ${C.border}`,
    borderBottom: `1px solid ${C.border}`,
    margin: "0",
    background: C.bgAlt,
  },
  statItem: {
    flex: 1, maxWidth: 220,
    padding: "36px 24px", textAlign: "center",
    borderRight: `1px solid ${C.border}`,
  },
  statNum: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 800, fontSize: 44, color: C.gold,
    lineHeight: 1, marginBottom: 8,
  },
  statLabel: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 10, letterSpacing: "0.15em",
    textTransform: "uppercase", color: C.inkLight,
  },
  section: { padding: "100px 48px", maxWidth: 1160, margin: "0 auto" },
  sectionEyebrow: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
    color: C.gold, marginBottom: 20,
  },
  sectionH2: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)",
    color: C.ink, lineHeight: 1.1, marginBottom: 16,
  },
  sectionH2Gold: { color: C.gold },
  sectionBody: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 20, color: C.inkMid, lineHeight: 1.75,
    maxWidth: 640, fontStyle: "italic",
  },
  tiersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 1, marginTop: 56,
    border: `1px solid ${C.border}`,
  },
  tierCard: {
    background: C.bgCard, padding: "40px 36px",
    borderRight: `1px solid ${C.border}`,
    position: "relative", overflow: "hidden",
    transition: "background 0.2s",
  },
  tierCardFeatured: {
    background: "#1e1a14",
    borderTop: `3px solid ${C.gold}`,
  },
  tierTag: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
    color: C.gold, marginBottom: 16,
    background: C.goldFaint,
    display: "inline-block", padding: "4px 10px",
  },
  tierName: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 800, fontSize: 28, color: C.ink, marginBottom: 8,
  },
  tierPrice: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 700, fontSize: 36, color: C.gold, marginBottom: 16,
  },
  tierDesc: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 17, color: C.inkMid, lineHeight: 1.65,
    fontStyle: "italic", marginBottom: 24,
  },
  tierMeta: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 11, color: C.inkLight, lineHeight: 1.8,
  },
  verticalsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 1, marginTop: 56,
    border: `1px solid ${C.border}`,
  },
  verticalCard: {
    background: C.bgCard, padding: "28px 24px",
    borderRight: `1px solid ${C.border}`,
    borderBottom: `1px solid ${C.border}`,
    transition: "background 0.2s",
    cursor: "default",
  },
  verticalLead: {
    gridColumn: "span 2",
    background: "#1a1610",
    borderLeft: `3px solid ${C.gold}`,
  },
  verticalName: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 700, fontSize: 20, color: C.ink, marginBottom: 8,
  },
  verticalDesc: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 15, color: C.inkLight, lineHeight: 1.6,
  },
  missionBlock: {
    background: C.bgCard,
    borderTop: `1px solid ${C.border}`,
    borderBottom: `1px solid ${C.border}`,
    padding: "80px 48px",
    textAlign: "center",
  },
  missionQuote: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontStyle: "italic", fontWeight: 700,
    fontSize: "clamp(22px, 3.5vw, 40px)",
    color: C.ink, maxWidth: 860, margin: "0 auto",
    lineHeight: 1.35,
  },
  missionQuoteGold: { color: C.gold },
  missionAttr: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 11, letterSpacing: "0.15em",
    textTransform: "uppercase", color: C.inkLight,
    marginTop: 24,
  },
  demoSection: {
    padding: "100px 48px",
    background: C.bgAlt,
    textAlign: "center",
  },
  demoCard: {
    maxWidth: 740, margin: "48px auto 0",
    background: C.bgCard,
    border: `1px solid ${C.borderGold}`,
    borderRadius: 4, padding: "40px",
    textAlign: "left",
  },
  demoCardLabel: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
    color: C.gold, marginBottom: 16,
  },
  demoScenario: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 17, color: C.inkMid, lineHeight: 1.75,
    fontStyle: "italic", marginBottom: 24,
    borderLeft: `2px solid ${C.borderGold}`,
    paddingLeft: 20,
  },
  demoQ: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 700, fontSize: 20, color: C.ink,
    marginBottom: 20, lineHeight: 1.4,
  },
  demoOptions: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 },
  demoOpt: (active) => ({
    padding: "14px 18px", borderRadius: 3,
    border: `1px solid ${active ? C.gold : C.border}`,
    background: active ? C.goldFaint : "transparent",
    color: active ? C.gold : C.inkMid,
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 16, cursor: "default", lineHeight: 1.5,
    display: "flex", gap: 12, alignItems: "flex-start",
  }),
  demoOptKey: (active) => ({
    fontFamily: "'DM Mono', monospace",
    fontSize: 11, color: active ? C.gold : C.inkLight,
    minWidth: 18, paddingTop: 2, fontWeight: 500,
  }),
  footer: {
    background: "#080705",
    borderTop: `1px solid ${C.border}`,
    padding: "60px 48px 40px",
  },
  footerTop: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: 48,
    flexWrap: "wrap", gap: 40,
  },
  footerLogo: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 800, fontSize: 32, color: C.ink,
  },
  footerTagline: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontStyle: "italic", fontSize: 16,
    color: C.inkLight, marginTop: 8, maxWidth: 320,
  },
  footerBottom: {
    borderTop: `1px solid ${C.border}`,
    paddingTop: 28,
    display: "flex", justifyContent: "space-between",
    alignItems: "center", flexWrap: "wrap", gap: 12,
  },
  footerCopy: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 11, color: C.inkLight, letterSpacing: "0.05em",
  },
};

const tiers = [
  { name: "Associate", price: "$249", tag: "Foundation", questions: 60, time: "90 min", pass: "70%", desc: "Foundational AI ethics literacy across the core framework. The entry credential for practitioners new to AI ethics." },
  { name: "Professional", price: "$349", tag: "Most Popular", questions: 80, time: "2 hrs", pass: "75%", desc: "Applied ethics and vertical specialization. For practitioners actively deploying or overseeing AI systems.", featured: true },
  { name: "Master", price: "$549", tag: "Advanced", questions: "100 + case study", time: "2.5 hrs", pass: "80%", desc: "Strategic leadership and case study analysis. The most rigorous credential in the Ponder ecosystem." },
];

const verticals = [
  { name: "Law", desc: "Attorney competence, confidentiality, bias, supervision, and bar obligations in AI-assisted legal practice.", lead: true },
  { name: "Healthcare", desc: "Clinical AI tools, patient data, diagnostic systems, and HIPAA-adjacent AI deployment." },
  { name: "Finance", desc: "Algorithmic trading, credit scoring, fraud detection, and robo-advisory under SEC and FINRA." },
  { name: "K–12 Education", desc: "Student data privacy, academic integrity, and age-appropriate AI use in classrooms." },
  { name: "Collegiate Education", desc: "Academic integrity, research ethics, and institutional policy for higher education." },
  { name: "Creative", desc: "Generative AI, intellectual property, authorship, and the ethics of AI-assisted creative work." },
  { name: "Technology", desc: "Bias mitigation, responsible deployment, and ethics for developers and product teams." },
  { name: "Science & Research", desc: "Reproducibility, bias, and research integrity for AI use in data analysis and publications." },
  { name: "General", desc: "Cross-industry AI ethics for practitioners outside the named verticals." },
];

const sampleScenario = "A litigation associate uses an AI tool to draft a motion. The AI cites three cases — two are real, one does not exist. The associate files the motion without verifying the citations.";
const sampleQ = "What is the primary ethical violation?";
const sampleOpts = ["Using AI tools in legal practice", "Failing to supervise and verify AI-generated work before filing", "Not disclosing AI use to the client", "Using a non-approved vendor"];

function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function RevealSection({ children, style }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div ref={ref} style={{ ...style, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
      {children}
    </div>
  );
}

export default function Landing({ onDemo }) {
  const [hoveredBtn, setHoveredBtn] = useState(null);

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      {/* Noise overlay */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

      {/* NAV */}
      <nav style={styles.nav}>
        <span style={styles.logo}>Ponder<span style={styles.logoPeriod}>.</span></span>
        <div style={styles.navLinks}>
          <span style={styles.navLink} onClick={() => document.getElementById('credentials')?.scrollIntoView({ behavior: 'smooth' })}>Credentials</span>
          <span style={styles.navLink} onClick={() => document.getElementById('verticals')?.scrollIntoView({ behavior: 'smooth' })}>Verticals</span>
          <span style={styles.navLink} onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>About</span>
          <button
            style={{ ...styles.demoBtn, ...(hoveredBtn === 'nav' ? { background: C.goldFaint, borderColor: C.gold } : {}) }}
            onMouseEnter={() => setHoveredBtn('nav')}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={onDemo}
          >Try a Sample Exam</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 30%, #2a1f0e18 0%, transparent 70%)", pointerEvents: "none" }} />
        <p style={styles.heroEyebrow}>AI Ethics Certification · The Present Company</p>
        <h1 style={styles.heroH1}>
          The standard for<br />
          <span style={styles.heroH1Gold}>responsible AI.</span>
        </h1>
        <p style={styles.heroSub}>
          Practitioner-first. Scenario-based. Built for the people actually deploying AI — not theorists observing from a distance.
        </p>
        <div style={styles.heroActions}>
          <button
            style={{ ...styles.btnPrimary, ...(hoveredBtn === 'hero1' ? { background: C.goldLight } : {}) }}
            onMouseEnter={() => setHoveredBtn('hero1')}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={onDemo}
          >Try a Sample Exam</button>
          <button
            style={{ ...styles.btnSecondary, ...(hoveredBtn === 'hero2' ? { color: C.ink, borderColor: C.inkMid } : {}) }}
            onMouseEnter={() => setHoveredBtn('hero2')}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => document.getElementById('credentials')?.scrollIntoView({ behavior: 'smooth' })}
          >View Credentials</button>
        </div>
      </section>

      {/* STATS */}
      <div style={styles.statsRow}>
        {[["9", "Industry Verticals"], ["3", "Credential Tiers"], ["120+", "SKUs at Launch"], ["2yr", "Renewal Cycle"]].map(([num, label], i) => (
          <div key={i} style={{ ...styles.statItem, ...(i === 3 ? { borderRight: "none" } : {}) }}>
            <div style={styles.statNum}>{num}</div>
            <div style={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {/* MISSION */}
      <div style={styles.missionBlock}>
        <RevealSection>
          <p style={styles.missionQuote}>
            "We are not here to slow AI down.<br />
            <span style={styles.missionQuoteGold}>We are here to make sure it deserves to go fast.</span>"
          </p>
          <p style={styles.missionAttr}>The Present Company · Ponder Ethical Foundation</p>
        </RevealSection>
      </div>

      {/* CREDENTIALS */}
      <section id="credentials" style={{ padding: "100px 48px", background: C.bg }}>
        <RevealSection style={{ maxWidth: 1160, margin: "0 auto" }}>
          <p style={styles.sectionEyebrow}>Credential Architecture</p>
          <h2 style={styles.sectionH2}>Three tiers.<br /><span style={styles.sectionH2Gold}>One ecosystem.</span></h2>
          <p style={styles.sectionBody}>Each credential builds on the last. Associate builds foundational literacy. Professional applies it. Master leads with it.</p>
          <div style={styles.tiersGrid}>
            {tiers.map((tier, i) => (
              <div key={i} style={{ ...styles.tierCard, ...(tier.featured ? styles.tierCardFeatured : {}), ...(i === 2 ? { borderRight: "none" } : {}) }}>
                <div style={styles.tierTag}>{tier.tag}</div>
                <div style={styles.tierName}>{tier.name}</div>
                <div style={styles.tierPrice}>{tier.price}</div>
                <div style={styles.tierDesc}>{tier.desc}</div>
                <div style={styles.tierMeta}>
                  {tier.questions} questions · {tier.time} · {tier.pass} pass mark
                </div>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* VERTICALS */}
      <section id="verticals" style={{ padding: "100px 48px", background: C.bgAlt }}>
        <RevealSection style={{ maxWidth: 1160, margin: "0 auto" }}>
          <p style={styles.sectionEyebrow}>Industry Verticals</p>
          <h2 style={styles.sectionH2}>Built for the industries<br /><span style={styles.sectionH2Gold}>where risk is highest.</span></h2>
          <p style={styles.sectionBody}>Nine verticals. Designed to go from general to granular. Law leads — more coming.</p>
          <div style={styles.verticalsGrid}>
            {verticals.map((v, i) => (
              <div key={i} style={{ ...styles.verticalCard, ...(v.lead ? styles.verticalLead : {}) }}>
                {v.lead && <div style={{ ...styles.tierTag, marginBottom: 12 }}>Lead Vertical</div>}
                <div style={styles.verticalName}>{v.name}</div>
                <div style={styles.verticalDesc}>{v.desc}</div>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* DEMO PREVIEW */}
      <section style={styles.demoSection}>
        <RevealSection>
          <p style={styles.sectionEyebrow}>Sample Exam</p>
          <h2 style={{ ...styles.sectionH2, marginBottom: 8 }}>See what Ponder<br /><span style={styles.sectionH2Gold}>actually tests.</span></h2>
          <p style={{ ...styles.sectionBody, margin: "0 auto 0" }}>Scenario-based. Judgment-focused. Not trivia.</p>
          <div style={styles.demoCard}>
            <div style={styles.demoCardLabel}>Scenario · Law Vertical · Associate</div>
            <div style={styles.demoScenario}>{sampleScenario}</div>
            <div style={styles.demoQ}>{sampleQ}</div>
            <div style={styles.demoOptions}>
              {sampleOpts.map((opt, i) => (
                <div key={i} style={styles.demoOpt(i === 1)}>
                  <span style={styles.demoOptKey(i === 1)}>{String.fromCharCode(65 + i)}.</span>
                  <span>{opt}</span>
                </div>
              ))}
            </div>
            <button
              style={{ ...styles.btnPrimary, width: "100%", ...(hoveredBtn === 'demo' ? { background: C.goldLight } : {}) }}
              onMouseEnter={() => setHoveredBtn('demo')}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={onDemo}
            >Take the Full Sample Exam</button>
          </div>
        </RevealSection>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "100px 48px", background: C.bg }}>
        <RevealSection style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={styles.sectionEyebrow}>About</p>
          <h2 style={styles.sectionH2}>Built by a practitioner.<br /><span style={styles.sectionH2Gold}>Not a research lab.</span></h2>
          <p style={{ ...styles.sectionBody, marginTop: 24, maxWidth: "100%" }}>
            Ponder is the flagship product of The Present Company — an AI ethics infrastructure company founded by Jeanette Ponder, a four-year AI practitioner with 23 years in production management. The product name is not a coincidence. People have always remarked that her last name suits her.
          </p>
          <p style={{ ...styles.sectionBody, marginTop: 20, maxWidth: "100%" }}>
            Ponder exists to protect and build public trust in AI. Every harm mitigated, every organization equipped, every practitioner credentialed makes AI safer, more accountable, and more viable as a force for genuine progress.
          </p>
          <div style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["4 Yrs AI Practitioner", "Prompt Engineering", "Model Training", "23 Yrs Production Mgmt", "1871 Chicago Member"].map((tag, i) => (
              <span key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, background: C.goldFaint, border: `1px solid ${C.borderGold}`, padding: "5px 12px", borderRadius: 2 }}>{tag}</span>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={styles.footerTop}>
            <div>
              <div style={styles.footerLogo}>Ponder<span style={{ color: C.gold }}>.</span></div>
              <div style={styles.footerTagline}>The first practitioner-led AI ethics certification ecosystem.</div>
            </div>
            <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
              <div>
                <div style={{ ...styles.sectionEyebrow, marginBottom: 16 }}>Product</div>
                {["Credentials", "Verticals", "Pricing", "Sample Exam"].map((l, i) => (
                  <div key={i} style={{ ...styles.navLink, display: "block", marginBottom: 10, color: C.inkLight, fontSize: 15 }}>{l}</div>
                ))}
              </div>
              <div>
                <div style={{ ...styles.sectionEyebrow, marginBottom: 16 }}>Company</div>
                {["About", "Marginalia", "Contingent Systems", "Contact"].map((l, i) => (
                  <div key={i} style={{ ...styles.navLink, display: "block", marginBottom: 10, color: C.inkLight, fontSize: 15 }}>{l}</div>
                ))}
              </div>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <div style={styles.footerCopy}>© 2026 The Present Company · thepresentco.com · thinkwithponder.com</div>
            <div style={styles.footerCopy}>Pre-seed Stage · Chicago, IL · 1871 Member</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
