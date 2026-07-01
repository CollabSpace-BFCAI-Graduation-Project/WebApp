"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";

// ─── Data ────────────────────────────────────────────────────────────────────

const stats = [
  { value: "2,500+", label: "Active Teams" },
  { value: "50K+", label: "Team Members" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "4.9/5", label: "User Rating" },
];

const features = [
  {
    icon: "🌐",
    title: "Real-time 3D Spaces",
    description:
      "Step into immersive virtual rooms and collaborate with your team as if you were in the same office.",
  },
  {
    icon: "📂",
    title: "File Sharing",
    description:
      "Share documents, images, and assets seamlessly. Everything stays organized and accessible.",
  },
  {
    icon: "📊",
    title: "Team Analytics",
    description:
      "Track engagement, monitor activity, and gain insights to keep your team at peak performance.",
  },
];

const steps = [
  {
    num: "01",
    title: "Create Your Space",
    description:
      "Set up a virtual collaboration space in seconds. Customize it for your team's workflow.",
  },
  {
    num: "02",
    title: "Invite Your Team",
    description:
      "Send invitations to your team members. They join instantly — no downloads required.",
  },
  {
    num: "03",
    title: "Start Collaborating",
    description:
      "Meet in 3D, share files, chat in real time, and build something great together.",
  },
];

const powerFeatures = [
  {
    icon: "🎮",
    title: "3D Virtual Rooms",
    description: "Immersive browser-based workspaces built on WebGL",
  },
  {
    icon: "💬",
    title: "Instant Messaging",
    description: "Real-time text chat with threads, reactions, and mentions",
  },
  {
    icon: "🔔",
    title: "Smart Notifications",
    description: "Stay in the loop without being overwhelmed by noise",
  },
  {
    icon: "🔒",
    title: "Enterprise Security",
    description: "End-to-end encryption and role-based access controls",
  },
  {
    icon: "🎨",
    title: "Custom Themes",
    description: "Personalize your workspace with curated color palettes",
  },
  {
    icon: "📱",
    title: "Cross-Platform",
    description: "Works on web, mobile, and desktop — wherever you work",
  },
  {
    icon: "🤝",
    title: "Instant Invites",
    description: "Bring anyone into your space with a single shareable link",
  },
  {
    icon: "⚡",
    title: "Lightning Fast",
    description: "Optimized for low latency so collaboration feels instant",
  },
  {
    icon: "📈",
    title: "Analytics",
    description: "Understand how your team collaborates with rich insights",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Product Lead at Nexora",
    avatar: "SM",
    avatarColor: "#6366f1",
    quote:
      "CollabSpace transformed how our remote team works. The 3D rooms make it feel like we're truly in the same room. Productivity skyrocketed within the first week.",
  },
  {
    name: "James K.",
    role: "CTO at BrightLoop",
    avatar: "JK",
    avatarColor: "#f59e0b",
    quote:
      "The combination of real-time 3D collaboration and seamless file sharing is unmatched. We ditched four separate tools and replaced them all with CollabSpace.",
  },
  {
    name: "Amira T.",
    role: "Design Director at Palette",
    avatar: "AT",
    avatarColor: "#10b981",
    quote:
      "Finally, a platform that's actually beautiful to use. The design and performance are exceptional — our entire creative team was onboarded in a single afternoon.",
  },
];

const faqs = [
  {
    q: "Is CollabSpace really free to start?",
    a: "Yes! You can create a space, invite up to 10 team members, and access core features completely free. No credit card required.",
  },
  {
    q: "How many members can a space have?",
    a: "Free spaces support up to 10 members. Pro spaces support unlimited members with advanced admin controls.",
  },
  {
    q: "Does it work in all browsers?",
    a: "CollabSpace works in any modern browser that supports WebGL — Chrome, Firefox, Edge, and Safari are all fully supported.",
  },
  {
    q: "Can I use CollabSpace on mobile?",
    a: "Absolutely. Our Flutter mobile app brings the full CollabSpace experience to iOS and Android.",
  },
  {
    q: "Is my data secure?",
    a: "Security is our priority. All data is encrypted in transit and at rest. We are SOC 2 compliant with regular third-party audits.",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <div className="landing-root">
      {/* ── Navbar ───────────────────────────────────────────────────── */}
      <nav className="landing-nav">
        <div className="landing-container landing-nav-inner">
          <Link href="/" className="landing-logo">
            <span className="landing-logo-icon">⬡</span>
            <span>CollabSpace</span>
          </Link>
          <div className="landing-nav-actions">
            {mounted && isAuthenticated ? (
              <Link href="/spaces" className="landing-btn-primary">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="landing-btn-ghost">
                  Sign In
                </Link>
                <Link href="/register" className="landing-btn-primary">
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="landing-hero-bg" aria-hidden />
        <div className="landing-container landing-hero-inner">
          <div className="landing-badge">🚀 Now with Unity WebGL 3D rooms</div>
          <h1 className="landing-hero-heading">
            Where Teams{" "}
            <span className="landing-hero-accent">Come Alive</span>
          </h1>
          <p className="landing-hero-sub">
            CollabSpace is the browser-based 3D virtual workspace that brings
            your team together — no matter where they are in the world. Chat,
            share, create, and collaborate in real time.
          </p>
          <div className="landing-hero-cta">
            {mounted && isAuthenticated ? (
              <Link href="/spaces" className="landing-btn-primary landing-btn-lg">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/register" className="landing-btn-primary landing-btn-lg">
                  Start For Free
                </Link>
                <Link href="/register" className="landing-btn-outline landing-btn-lg">
                  See Demo →
                </Link>
              </>
            )}
          </div>
          {/* Mock dashboard preview */}
          <div className="landing-hero-preview" aria-label="Dashboard preview">
            <div className="landing-preview-bar">
              <span className="landing-dot red" />
              <span className="landing-dot yellow" />
              <span className="landing-dot green" />
              <span className="landing-preview-url">collabspace.app/spaces</span>
            </div>
            <div className="landing-preview-body">
              <div className="landing-preview-sidebar">
                {["Spaces", "Chat", "Team"].map((item) => (
                  <div key={item} className="landing-preview-sideitem">
                    <span className="landing-preview-sideicon" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="landing-preview-content">
                <div className="landing-preview-grid">
                  {[
                    { name: "Design Hub", color: "#6366f1" },
                    { name: "Dev Sprint", color: "#f59e0b" },
                    { name: "Marketing", color: "#10b981" },
                    { name: "Product", color: "#ec4899" },
                  ].map((space) => (
                    <div
                      key={space.name}
                      className="landing-preview-card"
                      style={{ "--card-color": space.color } as React.CSSProperties}
                    >
                      <div className="landing-preview-card-badge" />
                      <span>{space.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <section className="landing-stats">
        <div className="landing-container landing-stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="landing-stat">
              <div className="landing-stat-value">{stat.value}</div>
              <div className="landing-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Everything Your Team Needs ────────────────────────────────── */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">Everything Your Team Needs</h2>
            <p className="landing-section-sub">
              One platform to replace the chaos of scattered tools and endless
              meetings.
            </p>
          </div>
          <div className="landing-features-grid">
            {features.map((f) => (
              <div key={f.title} className="landing-feature-card">
                <div className="landing-feature-icon">{f.icon}</div>
                <h3 className="landing-feature-title">{f.title}</h3>
                <p className="landing-feature-desc">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">Get Started in Minutes</h2>
            <p className="landing-section-sub">
              Everything you need to transform how your team works, in three
              simple steps.
            </p>
          </div>
          <div className="landing-steps-grid">
            {steps.map((step, i) => (
              <div key={step.num} className="landing-step">
                <div className="landing-step-num">{step.num}</div>
                {i < steps.length - 1 && (
                  <div className="landing-step-connector" aria-hidden />
                )}
                <h3 className="landing-step-title">{step.title}</h3>
                <p className="landing-step-desc">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Power Features ───────────────────────────────────────────── */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">
              Packed with Powerful Features
            </h2>
            <p className="landing-section-sub">
              Built for modern teams who demand speed, clarity, and real
              connection.
            </p>
          </div>
          <div className="landing-power-grid">
            {powerFeatures.map((f) => (
              <div key={f.title} className="landing-power-card">
                <span className="landing-power-icon">{f.icon}</span>
                <div>
                  <div className="landing-power-title">{f.title}</div>
                  <div className="landing-power-desc">{f.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">Loved by Teams Worldwide</h2>
            <p className="landing-section-sub">
              Don&apos;t take our word for it — hear from the teams who rely on us
              every day.
            </p>
          </div>
          <div className="landing-testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.name} className="landing-testimonial">
                <div className="landing-testimonial-stars">★★★★★</div>
                <p className="landing-testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="landing-testimonial-author">
                  <div
                    className="landing-testimonial-avatar"
                    style={{ background: t.avatarColor }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="landing-testimonial-name">{t.name}</div>
                    <div className="landing-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="landing-section">
        <div className="landing-container landing-faq-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">
              Frequently Asked Questions
            </h2>
            <p className="landing-section-sub">
              Everything you need to know before getting started.
            </p>
          </div>
          <div className="landing-faq-list">
            {faqs.map((faq) => (
              <details key={faq.q} className="landing-faq-item">
                <summary className="landing-faq-q">
                  <span>{faq.q}</span>
                  <span className="landing-faq-chevron" aria-hidden>
                    ›
                  </span>
                </summary>
                <div className="landing-faq-a">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="landing-cta">
        <div className="landing-container landing-cta-inner">
          <h2 className="landing-cta-title">Ready to Transform Your Team?</h2>
          <p className="landing-cta-sub">
            Join thousands of teams already collaborating in 3D. Get started
            free today — no credit card required.
          </p>
          <div className="landing-cta-actions">
            {mounted && isAuthenticated ? (
              <Link href="/spaces" className="landing-btn-primary landing-btn-lg">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/register" className="landing-btn-primary landing-btn-lg">
                  Get Started Free
                </Link>
                <Link href="/login" className="landing-btn-outline-light landing-btn-lg">
                  Sign In →
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-container landing-footer-inner">
          <div className="landing-footer-brand">
            <Link href="/" className="landing-logo landing-logo-light">
              <span className="landing-logo-icon">⬡</span>
              <span>CollabSpace</span>
            </Link>
            <p className="landing-footer-tagline">
              The future of team collaboration.
            </p>
          </div>
          <div className="landing-footer-links">
            <div className="landing-footer-col">
              <div className="landing-footer-col-title">Product</div>
              <Link href="/spaces" className="landing-footer-link">Spaces</Link>
              <Link href="/chat" className="landing-footer-link">Chat</Link>
              <Link href="/team" className="landing-footer-link">Team</Link>
            </div>
            <div className="landing-footer-col">
              <div className="landing-footer-col-title">Account</div>
              {mounted && isAuthenticated ? (
                <Link href="/spaces" className="landing-footer-link">Dashboard</Link>
              ) : (
                <>
                  <Link href="/login" className="landing-footer-link">Sign In</Link>
                  <Link href="/register" className="landing-footer-link">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <span>© {new Date().getFullYear()} CollabSpace · BFCAI Graduation Project</span>
        </div>
      </footer>

      <style>{landingStyles}</style>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const landingStyles = `
  /* Reset & root */
  .landing-root {
    font-family: var(--font-heading, 'Inter', system-ui, sans-serif);
    background: var(--background);
    color: var(--foreground);
    min-height: 100vh;
    overflow-x: hidden;
    transition: background 0.3s, color 0.3s;
  }
  .landing-container {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 24px;
  }

  /* ── Navbar ── */
  .landing-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: color-mix(in srgb, var(--background) 85%, transparent);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }
  .landing-nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }
  .landing-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--foreground);
    text-decoration: none;
    letter-spacing: -0.5px;
  }
  .landing-logo-light { color: var(--foreground); }
  .landing-logo-icon {
    font-size: 1.4rem;
    background: linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 70%, var(--foreground)));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .landing-nav-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  /* ── Buttons ── */
  .landing-btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 22px;
    background: var(--primary);
    color: var(--primary-foreground);
    font-weight: 600;
    font-size: 0.9rem;
    border-radius: 10px;
    text-decoration: none;
    transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 20px color-mix(in srgb, var(--primary) 35%, transparent);
    white-space: nowrap;
  }
  .landing-btn-primary:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 8px 28px color-mix(in srgb, var(--primary) 45%, transparent);
  }
  .landing-btn-lg { padding: 14px 30px; font-size: 1rem; border-radius: 12px; }
  .landing-btn-ghost {
    display: inline-flex;
    align-items: center;
    padding: 10px 18px;
    color: var(--muted-foreground);
    font-weight: 500;
    font-size: 0.9rem;
    border-radius: 10px;
    text-decoration: none;
    transition: color 0.15s, background 0.15s;
  }
  .landing-btn-ghost:hover { color: var(--foreground); background: color-mix(in srgb, var(--foreground) 6%, transparent); }
  .landing-btn-outline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 22px;
    background: transparent;
    color: var(--foreground);
    font-weight: 600;
    font-size: 0.9rem;
    border-radius: 10px;
    border: 1.5px solid var(--border);
    text-decoration: none;
    transition: background 0.15s, border-color 0.15s, transform 0.15s;
    white-space: nowrap;
  }
  .landing-btn-outline:hover { background: color-mix(in srgb, var(--foreground) 7%, transparent); border-color: color-mix(in srgb, var(--foreground) 30%, transparent); transform: translateY(-1px); }
  .landing-btn-outline-light {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 22px;
    background: color-mix(in srgb, var(--foreground) 10%, transparent);
    color: var(--foreground);
    font-weight: 600;
    font-size: 0.9rem;
    border-radius: 10px;
    border: 1.5px solid var(--border);
    text-decoration: none;
    transition: background 0.15s, transform 0.15s;
    white-space: nowrap;
  }
  .landing-btn-outline-light:hover { background: color-mix(in srgb, var(--foreground) 18%, transparent); transform: translateY(-1px); }

  /* ── Hero ── */
  .landing-hero {
    position: relative;
    padding: 100px 0 80px;
    text-align: center;
    overflow: hidden;
  }
  .landing-hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in srgb, var(--primary) 18%, transparent) 0%, transparent 70%),
      radial-gradient(ellipse 60% 40% at 80% 80%, color-mix(in srgb, var(--primary) 10%, transparent) 0%, transparent 70%);
    pointer-events: none;
  }
  .landing-hero-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
  .landing-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 16px;
    background: color-mix(in srgb, var(--primary) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--primary) 30%, transparent);
    border-radius: 999px;
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--primary);
    letter-spacing: 0.01em;
  }
  .landing-hero-heading {
    font-size: clamp(2.4rem, 6vw, 4.2rem);
    font-weight: 800;
    line-height: 1.12;
    letter-spacing: -1.5px;
    color: var(--foreground);
    max-width: 760px;
  }
  .landing-hero-accent {
    background: linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 70%, var(--foreground)));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .landing-hero-sub {
    font-size: 1.1rem;
    color: var(--muted-foreground);
    max-width: 600px;
    line-height: 1.75;
    margin: 0;
  }
  .landing-hero-cta {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 8px;
  }

  /* Dashboard Preview */
  .landing-hero-preview {
    margin-top: 48px;
    width: 100%;
    max-width: 800px;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: 0 40px 100px -20px rgba(0,0,0,0.5), 0 0 0 1px var(--border);
    background: var(--card);
  }
  .landing-preview-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    background: color-mix(in srgb, var(--card) 90%, var(--foreground));
    border-bottom: 1px solid var(--border);
  }
  .landing-dot {
    width: 10px; height: 10px; border-radius: 50%;
    display: inline-block;
  }
  .landing-dot.red { background: #ef4444; }
  .landing-dot.yellow { background: #f59e0b; }
  .landing-dot.green { background: #22c55e; }
  .landing-preview-url {
    margin-left: 10px;
    font-size: 0.75rem;
    color: var(--muted-foreground);
    background: var(--background);
    padding: 3px 12px;
    border-radius: 6px;
    border: 1px solid var(--border);
  }
  .landing-preview-body {
    display: flex;
    height: 280px;
  }
  .landing-preview-sidebar {
    width: 120px;
    background: color-mix(in srgb, var(--card) 95%, #000);
    border-right: 1px solid var(--border);
    padding: 16px 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .landing-preview-sideitem {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 8px;
    font-size: 0.75rem;
    color: var(--muted-foreground);
    cursor: default;
    transition: background 0.15s, color 0.15s;
  }
  .landing-preview-sideitem:first-child {
    background: color-mix(in srgb, var(--primary) 15%, transparent);
    color: var(--primary);
  }
  .landing-preview-sideicon {
    width: 10px; height: 10px; background: currentColor;
    border-radius: 3px; flex-shrink: 0; opacity: 0.7;
  }
  .landing-preview-content {
    flex: 1;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .landing-preview-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    width: 100%;
    max-width: 420px;
  }
  .landing-preview-card {
    background: linear-gradient(135deg, var(--card-color, #6366f1) 0%, color-mix(in srgb, var(--card-color, #6366f1) 60%, #000) 100%);
    border-radius: 12px;
    padding: 20px 16px;
    font-size: 0.8rem;
    font-weight: 600;
    color: rgba(255,255,255,0.9);
    position: relative;
    overflow: hidden;
    aspect-ratio: 3/2;
    display: flex;
    align-items: flex-end;
    transition: transform 0.2s;
  }
  .landing-preview-card:hover { transform: translateY(-2px); }
  .landing-preview-card-badge {
    position: absolute;
    top: 12px; right: 12px;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.6);
    box-shadow: 0 0 6px rgba(255,255,255,0.8);
  }

  /* ── Stats ── */
  .landing-stats {
    background: linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 70%, var(--foreground)) 100%);
    padding: 40px 0;
  }
  .landing-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
  }
  .landing-stat {
    text-align: center;
    padding: 12px 0;
    position: relative;
  }
  .landing-stat + .landing-stat::before {
    content: '';
    position: absolute;
    left: 0; top: 20%; bottom: 20%;
    width: 1px;
    background: rgba(255,255,255,0.25);
  }
  .landing-stat-value {
    font-size: 2.2rem;
    font-weight: 800;
    color: var(--primary-foreground);
    line-height: 1.1;
    letter-spacing: -1px;
  }
  .landing-stat-label {
    font-size: 0.85rem;
    color: color-mix(in srgb, var(--primary-foreground) 80%, transparent);
    margin-top: 4px;
    font-weight: 500;
  }

  /* ── Sections ── */
  .landing-section {
    padding: 96px 0;
  }
  .landing-section-alt {
    background: color-mix(in srgb, var(--background) 96%, var(--foreground));
  }
  .landing-section-header {
    text-align: center;
    margin-bottom: 56px;
  }
  .landing-section-title {
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -1px;
    color: var(--foreground);
    margin-bottom: 14px;
    line-height: 1.15;
  }
  .landing-section-sub {
    font-size: 1.05rem;
    color: var(--muted-foreground);
    max-width: 520px;
    margin: 0 auto;
    line-height: 1.7;
  }

  /* Features 3-col */
  .landing-features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .landing-feature-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px 28px;
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .landing-feature-card:hover {
    border-color: color-mix(in srgb, var(--primary) 30%, transparent);
    transform: translateY(-4px);
    box-shadow: 0 20px 50px -15px color-mix(in srgb, var(--primary) 15%, transparent);
  }
  .landing-feature-icon {
    font-size: 2rem;
    margin-bottom: 16px;
  }
  .landing-feature-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 10px;
  }
  .landing-feature-desc {
    font-size: 0.9rem;
    color: var(--muted-foreground);
    line-height: 1.65;
  }

  /* Steps */
  .landing-steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    position: relative;
  }
  .landing-step {
    text-align: center;
    position: relative;
    padding-top: 8px;
  }
  .landing-step-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px; height: 56px;
    background: var(--primary);
    border-radius: 16px;
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--primary-foreground);
    margin-bottom: 20px;
    box-shadow: 0 8px 24px color-mix(in srgb, var(--primary) 30%, transparent);
  }
  .landing-step-connector {
    position: absolute;
    top: 36px;
    left: calc(50% + 40px);
    right: calc(-50% + 40px);
    height: 2px;
    background: linear-gradient(90deg, color-mix(in srgb, var(--primary) 50%, transparent), color-mix(in srgb, var(--primary) 10%, transparent));
    border-radius: 1px;
  }
  .landing-step-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 10px;
  }
  .landing-step-desc {
    font-size: 0.88rem;
    color: var(--muted-foreground);
    line-height: 1.65;
  }

  /* Power features 3-col grid */
  .landing-power-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .landing-power-card {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px;
    transition: border-color 0.2s, transform 0.15s;
  }
  .landing-power-card:hover {
    border-color: color-mix(in srgb, var(--primary) 25%, transparent);
    transform: translateY(-2px);
  }
  .landing-power-icon { font-size: 1.5rem; flex-shrink: 0; margin-top: 2px; }
  .landing-power-title {
    font-size: 0.92rem;
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 4px;
  }
  .landing-power-desc {
    font-size: 0.82rem;
    color: var(--muted-foreground);
    line-height: 1.55;
  }

  /* Testimonials */
  .landing-testimonials-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .landing-testimonial {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: border-color 0.2s, transform 0.2s;
  }
  .landing-testimonial:hover {
    border-color: color-mix(in srgb, var(--primary) 20%, transparent);
    transform: translateY(-3px);
  }
  .landing-testimonial-stars { color: #f59e0b; font-size: 0.9rem; letter-spacing: 1px; }
  .landing-testimonial-quote {
    font-size: 0.9rem;
    color: var(--muted-foreground);
    line-height: 1.7;
    flex: 1;
    font-style: italic;
  }
  .landing-testimonial-author {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .landing-testimonial-avatar {
    width: 38px; height: 38px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.78rem;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }
  .landing-testimonial-name {
    font-size: 0.88rem;
    font-weight: 700;
    color: var(--foreground);
  }
  .landing-testimonial-role {
    font-size: 0.78rem;
    color: var(--muted-foreground);
  }

  /* FAQ */
  .landing-faq-container { max-width: 720px; }
  .landing-faq-list { display: flex; flex-direction: column; gap: 10px; }
  .landing-faq-item {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .landing-faq-item[open] { border-color: color-mix(in srgb, var(--primary) 30%, transparent); }
  .landing-faq-q {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--foreground);
    cursor: pointer;
    list-style: none;
    user-select: none;
    gap: 12px;
  }
  .landing-faq-q::-webkit-details-marker { display: none; }
  .landing-faq-chevron {
    font-size: 1.4rem;
    color: var(--primary);
    transition: transform 0.2s;
    flex-shrink: 0;
  }
  .landing-faq-item[open] .landing-faq-chevron { transform: rotate(90deg); }
  .landing-faq-a {
    padding: 0 22px 18px;
    font-size: 0.88rem;
    color: var(--muted-foreground);
    line-height: 1.7;
    border-top: 1px solid var(--border);
    margin-top: 0;
    padding-top: 14px;
  }

  /* CTA */
  .landing-cta {
    background: linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 70%, #000) 100%);
    padding: 96px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .landing-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 80% at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 70%);
  }
  .landing-cta-inner { position: relative; }
  .landing-cta-title {
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 800;
    color: #fff;
    letter-spacing: -1.2px;
    margin-bottom: 16px;
    line-height: 1.15;
  }
  .landing-cta-sub {
    font-size: 1.05rem;
    color: rgba(255,255,255,0.8);
    max-width: 520px;
    margin: 0 auto 36px;
    line-height: 1.7;
  }
  .landing-cta-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
  }
  .landing-cta .landing-btn-primary {
    background: var(--primary-foreground);
    color: var(--primary);
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  }
  .landing-cta .landing-btn-primary:hover {
    background: #fafafa;
    box-shadow: 0 8px 28px rgba(0,0,0,0.3);
  }

  /* Footer */
  .landing-footer {
    background: color-mix(in srgb, var(--background) 98%, #000);
    border-top: 1px solid var(--border);
    padding: 56px 0 0;
  }
  .landing-footer-inner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 40px;
    padding-bottom: 48px;
  }
  .landing-footer-brand { max-width: 260px; }
  .landing-footer-tagline {
    font-size: 0.85rem;
    color: var(--muted-foreground);
    margin-top: 10px;
    line-height: 1.6;
  }
  .landing-footer-links {
    display: flex;
    gap: 48px;
  }
  .landing-footer-col {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .landing-footer-col-title {
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--muted-foreground);
    margin-bottom: 4px;
  }
  .landing-footer-link {
    font-size: 0.88rem;
    color: var(--muted-foreground);
    text-decoration: none;
    transition: color 0.15s;
  }
  .landing-footer-link:hover { color: var(--foreground); }
  .landing-footer-bottom {
    border-top: 1px solid var(--border);
    text-align: center;
    padding: 20px 24px;
    font-size: 0.78rem;
    color: var(--muted-foreground);
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .landing-features-grid,
    .landing-steps-grid,
    .landing-testimonials-grid { grid-template-columns: 1fr; }
    .landing-power-grid { grid-template-columns: repeat(2, 1fr); }
    .landing-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .landing-stat + .landing-stat::before { display: none; }
    .landing-step-connector { display: none; }
    .landing-footer-inner { flex-direction: column; }
    .landing-preview-sidebar { width: 90px; }
  }
  @media (max-width: 560px) {
    .landing-power-grid { grid-template-columns: 1fr; }
    .landing-stats-grid { grid-template-columns: 1fr 1fr; }
    .landing-hero-preview { display: none; }
    .landing-nav-actions .landing-btn-ghost { display: none; }
    .landing-footer-links { flex-direction: column; gap: 24px; }
  }
`;
