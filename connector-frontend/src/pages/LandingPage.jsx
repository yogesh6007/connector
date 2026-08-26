import React, { useState } from 'react';
import './LandingPage.css';

// SVG Brand Logo Component (Cleaned & Integrated Text)
const ConnectorLogo = ({ size = "normal" }) => (
  <div className={`connector-logo-brand ${size}`}>
    <svg 
      className="connector-logo-svg" 
      viewBox="0 0 240 50" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CONNECTOR logo"
    >
      {/* Connector Node Symbol */}
      <path d="M 18,12 C 4,12 4,38 18,38 L 26,38" stroke="#2563EB" strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M 26,12 C 40,12 40,38 26,38 L 18,38" stroke="#14B8A6" strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M 14,25 L 30,25" stroke="#6366F1" strokeWidth="4.5" strokeLinecap="round"/>
      <circle cx="14" cy="25" r="3.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2"/>
      <circle cx="30" cy="25" r="3.5" fill="#FFFFFF" stroke="#14B8A6" strokeWidth="2"/>

      {/* Embedded Integrated Typography */}
      <text 
        x="48" 
        y="33" 
        fontFamily="Inter, system-ui, -apple-system, sans-serif" 
        fontSize="24" 
        fontWeight="800" 
        letterSpacing="-0.5"
      >
        <tspan fill="#181A1D">CONNECT</tspan>
        <tspan fill="#2563EB">OR</tspan>
      </text>
    </svg>
  </div>
);

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="landing-page-root">
      
      {/* 1. STICKY NAVBAR */}
      <header className="navbar-container">
        <div className="navbar-inner">
          <a href="#top" className="nav-logo-link">
            <ConnectorLogo />
          </a>

          <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#benefits" onClick={() => setMobileMenuOpen(false)}>Benefits</a>
            <a href="#organizers" onClick={() => setMobileMenuOpen(false)}>For Organizers</a>
          </nav>

          <div className="nav-actions">
            <a href="login" className="btn-text">Log In</a>
            <a href="get-started" className="btn-primary">Get Started</a>
            
            <button 
              className="mobile-hamburger" 
              onClick={toggleMenu}
              aria-label="Toggle Navigation Menu"
            >
              <span className={`bar ${mobileMenuOpen ? 'bar-top-active' : ''}`}></span>
              <span className={`bar ${mobileMenuOpen ? 'bar-mid-active' : ''}`}></span>
              <span className={`bar ${mobileMenuOpen ? 'bar-bot-active' : ''}`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="hero-section" id="top">
        <div className="hero-grid-bg" />
        <div className="hero-content">
          
          {/* Left Column */}
          <div className="hero-text-col">
            <div className="eyebrow-pill">
              <span className="eyebrow-dot"></span>
              CONNECT • DISCOVER • GROW
            </div>

            <h1 className="hero-headline">
              Your next <span className="highlight-green">opportunity</span> starts with a connection.
            </h1>

            <p className="hero-subtext">
              CONNECTOR brings students, mentors, and organizations together to discover 
              meaningful career paths, develop valuable skills, and find the right opportunities.
            </p>

            <div className="hero-cta-group">
              <a href="#get-started" className="btn-primary lg">Start Your Journey ↗</a>
              <a href="#how-it-works" className="btn-secondary lg">See How It Works ↓</a>
            </div>

            <div className="trust-indicator">
              <div className="avatar-stack">
                <span className="avatar av-1">SK</span>
                <span className="avatar av-2">MR</span>
                <span className="avatar av-3">AL</span>
                <span className="avatar av-4">JD</span>
              </div>
              <p className="trust-text">
                Joined by <strong>emerging talent, mentors & leaders</strong> across 25+ professional domains.
              </p>
            </div>
          </div>

          {/* Right Column (Abstract Connection Viz) */}
          <div className="hero-viz-col">
            <div className="viz-viewport">
              {/* Background Grid Lines */}
              <div className="viz-fine-grid"></div>

              {/* Orbit Rings */}
              <div className="viz-orbit outer"></div>
              <div className="viz-orbit inner"></div>

              {/* Central Core */}
              <div className="viz-core-node">
                <ConnectorLogo size="small" />
              </div>

              {/* Node Lines */}
              <svg className="viz-connecting-lines" viewBox="0 0 500 500">
                <line x1="250" y1="250" x2="110" y2="120" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4"/>
                <line x1="250" y1="250" x2="410" y2="150" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4"/>
                <line x1="250" y1="250" x2="130" y2="390" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4"/>
                <line x1="250" y1="250" x2="390" y2="370" stroke="#10B981" strokeWidth="1.5" opacity="0.4"/>
              </svg>

              {/* Floating Cards */}
              <div className="floating-card card-match float-1">
                <div className="card-badge green">MATCH — 94%</div>
                <div className="card-title">Product Designer</div>
                <div className="card-tags">UX • Design • Research</div>
              </div>

              <div className="floating-card card-gap float-2">
                <div className="card-badge orange">SKILL GAP</div>
                <div className="card-title">3 skills to improve</div>
                <div className="skill-pills">
                  <span>Data Viz</span>
                  <span>System Architecture</span>
                </div>
              </div>

              <div className="floating-card card-opp float-3">
                <div className="card-badge blue">NEW OPPORTUNITY</div>
                <div className="card-title">Product & Tech Mentorship</div>
                <div className="card-subtext">Matched with Senior Director</div>
              </div>

              {/* Orbit Nodes */}
              <div className="orbit-node node-a">
                <span className="node-label">Mentors</span>
              </div>
              <div className="orbit-node node-b">
                <span className="node-label">Talent</span>
              </div>
              <div className="orbit-node node-c">
                <span className="node-label">Orgs</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. ECOSYSTEM TRANSITION BAR */}
      <section className="transition-bar-section">
        <div className="transition-container">
          <div className="step-trio">
            <span className="trio-item"><strong>01</strong> DISCOVER</span>
            <span className="trio-divider">/</span>
            <span className="trio-item"><strong>02</strong> DEVELOP</span>
            <span className="trio-divider">/</span>
            <span className="trio-item"><strong>03</strong> CONNECT</span>
          </div>
          <div className="philosophy-statement">
            "One platform for the entire journey from curiosity to opportunity."
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section className="features-section" id="features">
        <div className="section-header">
          <span className="section-eyebrow">THE ECOSYSTEM</span>
          <h2 className="section-title">
            More than a platform.<br />A career ecosystem.
          </h2>
          <p className="section-desc">
            CONNECTOR helps people understand where they want to go, what they need to get there, 
            and who can help them along the way.
          </p>
        </div>

        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-meta">CAREER DISCOVERY</div>
            <h3 className="feature-heading">Discover Your Path</h3>
            <p className="feature-text">
              Explore career possibilities tailored to your unique interests, education background, 
              skills, and long-term ambitions.
            </p>
            <div className="feature-illustration discovery-mini">
              <div className="mini-bar width-80"></div>
              <div className="mini-bar width-50"></div>
              <div className="mini-bar width-90"></div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-meta">SKILL DEVELOPMENT</div>
            <h3 className="feature-heading">Build Your Skills</h3>
            <p className="feature-text">
              Gain clarity on the exact skills required for your desired direction and identify 
              actionable areas to grow.
            </p>
            <div className="feature-illustration skill-mini">
              <div className="skill-check">✓ Data Analytics</div>
              <div className="skill-check">✓ Strategic Thinking</div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-meta">OPPORTUNITY MATCHING</div>
            <h3 className="feature-heading">Find Opportunities</h3>
            <p className="feature-text">
              Discover curated internships, projects, events, mentorships, and real-world 
              roles aligned with your trajectory.
            </p>
            <div className="feature-illustration opp-mini">
              <div className="mini-tag">Matched • 98%</div>
            </div>
          </div>

          {/* Feature 4 (Full Width Card) */}
          <div className="feature-card feature-wide">
            <div className="wide-content-left">
              <div className="feature-meta">EVERY DOMAIN WELCOME</div>
              <h3 className="feature-heading">Your degree doesn't define your destination.</h3>
              <p className="feature-text">
                Careers are dynamic. CONNECTOR supports traditional tech roles alongside 
                diverse non-technical industries—enabling cross-functional growth across 
                every professional domain.
              </p>
            </div>
            
            <div className="wide-domains-grid">
              <span className="domain-pill">Technology</span>
              <span className="domain-pill">Design</span>
              <span className="domain-pill">Business</span>
              <span className="domain-pill">Engineering</span>
              <span className="domain-pill">Science</span>
              <span className="domain-pill">Management</span>
              <span className="domain-pill">Creative</span>
              <span className="domain-pill">Healthcare</span>
              <span className="domain-pill">Finance</span>
              <span className="domain-pill">Marketing</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="section-header dark">
          <span className="section-eyebrow light">THE PROCESS</span>
          <h2 className="section-title light">
            From where you are<br />to where you could be.
          </h2>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-num">01</div>
            <h3 className="step-title">Tell us about yourself</h3>
            <p className="step-desc">
              Share your education, current interests, existing skills, experience, and 
              aspiring career domains.
            </p>
            <div className="step-tags">
              <span>Education</span> • <span>Interests</span> • <span>Skills</span>
            </div>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-num">02</div>
            <h3 className="step-title">Explore possibilities</h3>
            <p className="step-desc">
              Discover tailored career paths and opportunities intelligent algorithms align 
              with your authentic profile.
            </p>
            <div className="step-tags">
              <span>Pathways</span> • <span>Roles</span>
            </div>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-num">03</div>
            <h3 className="step-title">Identify what you need</h3>
            <p className="step-desc">
              Uncover specific skill gaps, knowledge requirements, and curated growth areas 
              needed for your goal.
            </p>
            <div className="step-tags">
              <span>Skill Gaps</span> • <span>Roadmaps</span>
            </div>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-num">04</div>
            <h3 className="step-title">Make the connection</h3>
            <p className="step-desc">
              Engage directly with experienced mentors, leading organizations, real projects, 
              and career opportunities.
            </p>
            <div className="step-tags">
              <span>Mentors</span> • <span>Organizations</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BENEFITS / VALUE SECTION */}
      <section className="benefits-section" id="benefits">
        <div className="section-header">
          <span className="section-eyebrow">WHY CONNECTOR</span>
          <h2 className="section-title">A better way to move forward.</h2>
        </div>

        <div className="value-grid">
          <div className="value-card">
            <div className="value-stat">360°</div>
            <h4 className="value-title">Career Visibility</h4>
            <p className="value-desc">
              Clear insight into where you stand, where you want to go, and every step in between.
            </p>
          </div>

          <div className="value-card">
            <div className="value-stat">01</div>
            <h4 className="value-title">Unified Journey</h4>
            <p className="value-desc">
              No more fragmented tools. Discovery, learning, and networking live seamlessly together.
            </p>
          </div>

          <div className="value-card">
            <div className="value-stat">∞</div>
            <h4 className="value-title">Possibilities</h4>
            <p className="value-desc">
              Cross-industry visibility opens doors to non-linear, multi-disciplinary pathways.
            </p>
          </div>

          <div className="value-card">
            <div className="value-stat">24/7</div>
            <h4 className="value-title">Ecosystem Access</h4>
            <p className="value-desc">
              Continuous access to community-driven mentorship, organizations, and real projects.
            </p>
          </div>
        </div>
      </section>

      {/* 7. ORGANIZER SECTION */}
      <section className="organizers-section" id="organizers">
        <div className="organizers-container">
          {/* Left Column Text */}
          <div className="organizers-text-col">
            <span className="section-eyebrow dark">FOR ORGANIZATIONS & MENTORS</span>
            <h2 className="organizers-headline">
              Don't just post an opportunity.<br />
              <span className="highlight-green-dark">Reach the right people.</span>
            </h2>
            <p className="organizers-subtext">
              Reach students and emerging talent whose interests, skills, and ambitions 
              naturally align with what your organization has to offer.
            </p>
            <a href="#become-organizer" className="btn-dark lg">Become an Organizer ↗</a>
          </div>

          {/* Right Column Dashboard Card */}
          <div className="organizers-viz-col">
            <div className="dashboard-preview-card">
              <div className="dash-header">
                <span className="dash-badge">FEATURED OPPORTUNITY</span>
                <span className="dash-status">Active Match</span>
              </div>
              
              <h3 className="dash-opp-title">Product Design Internship</h3>
              <p className="dash-opp-desc">"Help build products that make a difference."</p>
              
              <div className="dash-tags-row">
                <span className="dash-pill">Remote</span>
                <span className="dash-pill">3 Months</span>
                <span className="dash-pill">Paid</span>
              </div>

              <div className="dash-divider"></div>

              <div className="dash-footer-match">
                <div className="match-counter">
                  <strong>48</strong> potential matches found
                </div>
                <div className="match-avatars">
                  <div className="m-avatar m1"></div>
                  <div className="m-avatar m2"></div>
                  <div className="m-avatar m3"></div>
                  <div className="m-avatar count">+45</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="final-cta-section" id="get-started">
        <div className="cta-radial-bg" />
        <div className="cta-content">
          <h2 className="cta-headline">
            Your future isn't one fixed path.<br />
            <span className="highlight-green">Start exploring what comes next.</span>
          </h2>
          <p className="cta-subtext">
            Join thousands of students, mentors, and organizations shaping the future of work together.
          </p>
          <div className="cta-button-group">
            <a href="#register" className="btn-primary lg">Start Your Journey ↗</a>
            <a href="#organizer-signup" className="btn-secondary lg">I'm an Organizer</a>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="footer-section">
        <div className="footer-container">
          
          <div className="footer-brand-col">
            <ConnectorLogo />
            <p className="footer-tagline">Connect. Discover. Grow.</p>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <h4>PLATFORM</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#benefits">Benefits</a>
            </div>

            <div className="footer-col">
              <h4>DISCOVER</h4>
              <a href="#students">For Students</a>
              <a href="#organizers">For Organizers</a>
              <a href="#opportunities">Opportunities</a>
            </div>

            <div className="footer-col">
              <h4>COMPANY</h4>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <a href="#privacy">Privacy Policy</a>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <span>© 2026 CONNECTOR. All rights reserved.</span>
          <span className="footer-motto">Built for the next generation.</span>
        </div>
      </footer>

    </div>
  );
}