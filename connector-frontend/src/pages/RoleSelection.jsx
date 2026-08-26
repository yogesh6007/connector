import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RoleSelection.css';

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);

  const studentTags = ['Events', 'Projects', 'Connections', 'Communities'];
  const mentorTags = ['Create Events', 'Manage Communities', 'Analytics', 'Mentorship'];

  return (
    <div className="portal-container">
      {/* LEFT HERO PANEL */}
      <div className="portal-left-panel">
        {/* Decorative Background Glow Orbs */}
        <div className="glow-orb orb-top-left"></div>
        <div className="glow-orb orb-center-right"></div>
        <div className="glow-orb orb-bottom-right"></div>

        <div className="left-panel-content">
          {/* Header & Logo */}
          <div className="brand-header">
            <div className="logo-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div>
              <h2 className="brand-name">CONNECTOR</h2>
              <p className="brand-tagline">Discover. Connect. Collaborate. Grow.</p>
            </div>
          </div>

          {/* Main Copy */}
          <div className="hero-text-block">
            <h1 className="hero-headline">One platform for<br />every opportunity</h1>
            <p className="hero-description">
              Stop switching between LinkedIn, Discord, and Unstop. Everything you need to discover, connect, and collaborate is right here.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="feature-cards-grid">
            <div className="glass-card">
              <div className="card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h4 className="card-title">Find Teammates</h4>
              <p className="card-subtext">10,000+ students</p>
            </div>

            <div className="glass-card">
              <div className="card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h4 className="card-title">Events & Hackathons</h4>
              <p className="card-subtext">200+ per month</p>
            </div>

            <div className="glass-card">
              <div className="card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h4 className="card-title">Live Projects</h4>
              <p className="card-subtext">500+ recruiting</p>
            </div>

            <div className="glass-card">
              <div className="card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                </svg>
              </div>
              <h4 className="card-title">AI Matching</h4>
              <p className="card-subtext">94% accuracy</p>
            </div>
          </div>

          {/* Social Proof Footer */}
          <div className="hero-footer-trust">
            Trusted by students at IITs, NITs, IIMs and 200+ colleges
          </div>
        </div>
      </div>

      {/* RIGHT ROLE SELECTOR PANEL */}
      <div className="portal-right-panel">
        <div className="right-panel-content">
          <div className="welcome-header">
            <h2 className="welcome-title">Welcome back</h2>
            <p className="welcome-subtitle">How are you joining CONNECTOR today?</p>
          </div>

          {/* Role Cards List */}
          <div className="role-options-list">
            {/* Student Role Card -> Navigates to /student */}
            <Link 
              to="/student" 
              className={`role-selection-card ${selectedRole === 'student' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('student')}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="role-card-header">
                <div className="role-icon-wrapper student-theme">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <div className="role-main-info">
                  <h3 className="role-name">Student</h3>
                  <p className="role-description">Discover opportunities, find teammates, join communities</p>
                </div>
                <div className="arrow-indicator">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>

              <div className="role-pill-tags">
                {studentTags.map((tag, i) => (
                  <span key={i} className="pill-tag">{tag}</span>
                ))}
              </div>
            </Link>

            {/* Mentor Role Card -> Navigates to /organizer */}
            <Link 
              to="/organizer" 
              className={`role-selection-card ${selectedRole === 'mentor' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('mentor')}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="role-card-header">
                <div className="role-icon-wrapper mentor-theme">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </div>
                <div className="role-main-info">
                  <h3 className="role-name">Mentor</h3>
                  <p className="role-description">Create events, guide students, build communities</p>
                </div>
                <div className="arrow-indicator">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>

              <div className="role-pill-tags">
                {mentorTags.map((tag, i) => (
                  <span key={i} className="pill-tag">{tag}</span>
                ))}
              </div>
            </Link>
          </div>

          {/* Prototype Notice Box */}
          <div className="prototype-notice-box">
            <div className="notice-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
              </svg>
              <span>Demo Prototype</span>
            </div>
            <p className="notice-text">
              This is an interactive prototype. Click any role to explore the full CONNECTOR experience with realistic sample data.
            </p>
          </div>
        </div>

        {/* Floating Help Button */}
        <button className="help-fab" title="Help & Support">?</button>
      </div>
    </div>
  );
}