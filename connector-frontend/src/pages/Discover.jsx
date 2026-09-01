import React, { useState } from 'react';
import './Discover.css';

const PEOPLE_DATA = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'UI/UX Designer',
    college: 'B.Des, NID Ahmedabad',
    match: '91% Match',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    tags: ['Figma', 'User Research', 'Prototyping']
  },
  {
    id: 2,
    name: 'Aarav Mehta',
    role: 'Product Designer',
    college: 'B.Tech + MBA, IIM Ahmedabad',
    match: '87% Match',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    tags: ['Product Strategy', 'Figma', 'User Research']
  },
  {
    id: 3,
    name: 'Sneha Patel',
    role: 'Marketing & Strategy',
    college: 'BBA Marketing, NMIMS Mumbai',
    match: '84% Match',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    tags: ['Digital Marketing', 'Content Strategy', 'Brand Building']
  },
  {
    id: 4,
    name: 'Arjun Singh',
    role: 'Backend Developer',
    college: 'B.Tech CS, BITS Pilani',
    match: '79% Match',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    tags: ['Python', 'Django', 'PostgreSQL']
  },
  {
    id: 5,
    name: 'Kavya Reddy',
    role: 'Data Scientist',
    college: 'M.Sc Data Science, IISc Bangalore',
    match: '82% Match',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    tags: ['Python', 'TensorFlow', 'Data Visualization']
  }
];

const PROJECTS_DATA = [
  {
    id: 1,
    title: 'Healthcare AI Platform',
    desc: 'Building an AI-powered platform that assists doctors in diagnosing diseases through medical imaging and patient data analysis. The platform uses computer vision and NLP to generate diagnostic reports and treatment recommendations.',
    match: '91% Match',
    lookingFor: ['Looking for: UI/UX Designer', 'Looking for: Marketing Strategist', 'Looking for: Frontend Developer'],
    status: 'Recruiting',
    statusClass: 'status-recruiting',
    deadline: 'Deadline: September 5, 2026'
  },
  {
    id: 2,
    title: 'Campus Startup Finder',
    desc: 'A platform connecting student entrepreneurs with co-founders, resources, and investor networks within Indian college campuses. Think of it as LinkedIn meets AngelList, built specifically for student startups.',
    match: '84% Match',
    lookingFor: ['Looking for: Full Stack Developer', 'Looking for: ML Engineer', 'Looking for: Content Writer'],
    status: 'In Progress',
    statusClass: 'status-progress',
    deadline: 'Deadline: September 20, 2026'
  },
  {
    id: 3,
    title: 'Adaptive EdTech Learning App',
    desc: 'An AI-driven adaptive learning platform that personalizes content delivery based on student learning patterns. The app adjusts difficulty, recommends resources, and provides real-time performance analytics.',
    match: '79% Match',
    lookingFor: ['Looking for: UI/UX Designer', 'Looking for: Backend Developer', 'Looking for: Business Analyst'],
    status: 'Team Formed',
    statusClass: 'status-formed',
    deadline: 'Deadline: October 1, 2026'
  }
];

const EVENTS_DATA = [
  {
    id: 1,
    title: 'AI Innovation Challenge',
    date: 'September 15, 2026',
    location: 'Online',
    match: '94% Match',
    bg: 'linear-gradient(135deg, #0284c7, #6366f1, #d946ef)'
  },
  {
    id: 2,
    title: 'Startup Pitch Competition',
    date: 'September 28, 2026',
    location: 'IIM Bangalore Campus',
    match: '87% Match',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600'
  },
  {
    id: 3,
    title: 'Design Thinking Workshop',
    date: 'October 5, 2026',
    location: 'Online (Zoom)',
    match: '78% Match',
    bg: 'linear-gradient(135deg, #f97316, #d946ef, #4f46e5)'
  },
  {
    id: 4,
    title: 'FinTech Hackathon 2026',
    date: 'October 18-19, 2026',
    location: 'Mumbai',
    match: '82% Match',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600'
  }
];

const MENTORS_DATA = [
  {
    id: 1,
    name: 'Dr. Anita Sharma',
    role: 'Professor & AI Researcher',
    college: 'IIT Delhi',
    match: '93% Match',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    tags: ['Machine Learning', 'Computer Vision', 'Deep Learning']
  },
  {
    id: 2,
    name: 'Prof. Vikram Nair',
    role: 'Entrepreneurship Professor',
    college: 'IIM Bangalore',
    match: '86% Match',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    tags: ['Entrepreneurship', 'Venture Capital', 'Startup Strategy']
  }
];

export default function Discover() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchInput, setSearchInput] = useState('I need a UI designer for my AI startup');
  const [headerSearch, setHeaderSearch] = useState('');

  const renderPeople = () => (
    <div className="discover-section">
      <div className="section-title-bar">
        <h3>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          People
        </h3>
        <span className="results-count">{PEOPLE_DATA.length} results</span>
      </div>
      <div className="people-grid">
        {PEOPLE_DATA.map(person => (
          <div key={person.id} className="person-card">
            <div className="card-header">
              <div className="person-profile">
                <img src={person.avatar} alt={person.name} className="person-avatar" />
                <div className="person-meta">
                  <h4>{person.name}</h4>
                  <p className="person-role">{person.role}</p>
                </div>
              </div>
              <span className="match-pill">{person.match}</span>
            </div>
            <p className="person-college">{person.college}</p>
            <div className="tag-chips">
              {person.tags.map((tag, idx) => (
                <span key={idx} className="chip">{tag}</span>
              ))}
            </div>
            <div className="card-actions">
              <button className="btn-primary">Connect</button>
              <button className="btn-secondary">Message</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="discover-section">
      <div className="section-title-bar">
        <h3>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          Projects
        </h3>
        <span className="results-count">{PROJECTS_DATA.length} results</span>
      </div>
      <div className="projects-grid">
        {PROJECTS_DATA.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-card-header">
              <h4>{project.title}</h4>
              <span className="match-pill">{project.match}</span>
            </div>
            <p className="project-desc">{project.desc}</p>
            <div className="looking-tags">
              {project.lookingFor.map((item, idx) => (
                <span key={idx} className="chip purple-chip">{item}</span>
              ))}
            </div>
            <div className="project-footer">
              <span className={`status-badge ${project.statusClass}`}>{project.status}</span>
              <span className="deadline-text">{project.deadline}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="discover-section">
      <div className="section-title-bar">
        <h3>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Events
        </h3>
        <span className="results-count">{EVENTS_DATA.length} results</span>
      </div>
      <div className="events-grid">
        {EVENTS_DATA.map(event => (
          <div key={event.id} className="event-card">
            <div 
              className="event-banner"
              style={event.bg ? { background: event.bg } : { backgroundImage: `url(${event.image})` }}
            >
              <span className="match-pill">{event.match}</span>
            </div>
            <div className="event-details">
              <h4>{event.title}</h4>
              <div className="event-meta">
                <span>📅 {event.date}</span>
                <span>📍 {event.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCommunities = () => (
    <div className="discover-section">
      <div className="section-title-bar">
        <h3>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          Communities
        </h3>
        <span className="results-count">0 results</span>
      </div>
      <div className="empty-state">
        <p>No active communities found matching your search term.</p>
      </div>
    </div>
  );

  const renderMentors = () => (
    <div className="discover-section">
      <div className="section-title-bar">
        <h3>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          Mentors
        </h3>
        <span className="results-count">{MENTORS_DATA.length} results</span>
      </div>
      <div className="mentors-grid">
        {MENTORS_DATA.map(mentor => (
          <div key={mentor.id} className="person-card">
            <div className="card-header">
              <div className="person-profile">
                <img src={mentor.avatar} alt={mentor.name} className="person-avatar" />
                <div className="person-meta">
                  <h4>{mentor.name}</h4>
                  <p className="person-role">{mentor.role}</p>
                  <p className="person-college">{mentor.college}</p>
                </div>
              </div>
              <span className="match-pill">{mentor.match}</span>
            </div>
            <div className="tag-chips">
              {mentor.tags.map((tag, idx) => (
                <span key={idx} className="chip orange-chip">{tag}</span>
              ))}
            </div>
            <div className="card-actions">
              <button className="btn-primary">Connect</button>
              <button className="btn-secondary">Message</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="discover-layout">
      {/* SIDEBAR NAVIGATION */}
      <aside className="sidebar">
        <div className="brand-logo">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <div>
            <h3 className="brand-title">CONNECTOR</h3>
            <span className="brand-sub">Student Portal</span>
          </div>
        </div>

        <nav className="nav-menu">
          <button className="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>Dashboard</span>
          </button>
          <button className="nav-item active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
            <span>Discover</span>
          </button>
          <button className="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>Events</span>
          </button>
          <button className="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            <span>Projects</span>
          </button>
          <button className="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Connections</span>
          </button>
          <button className="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>Messages</span>
            <span className="nav-badge purple">2</span>
          </button>
          <button className="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span>Notifications</span>
            <span className="nav-badge red">3</span>
          </button>
          <button className="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Profile</span>
          </button>
        </nav>

        <div className="sidebar-user-footer">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="Rahul Sharma" className="user-avatar-sm" />
          <div className="user-info">
            <span className="user-name">Rahul Sharma</span>
            <span className="user-role">Student</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="discover-main">
        {/* TOP NAVBAR */}
        <header className="top-header">
          <div className="search-bar-container">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Search people, projects, events or communities..." 
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
            />
          </div>

          <div className="header-actions">
            <button className="icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </button>
            <button className="icon-btn relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span className="dot-badge">3</span>
            </button>
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="Avatar" className="header-avatar" />
          </div>
        </header>

        {/* HERO TITLE BLOCK */}
        <section className="discover-hero">
          <h1 className="hero-title">Discover</h1>
          <p className="hero-sub">Find people, projects, events and communities matched to your profile</p>

          <div className="prompt-search-bar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              value={searchInput} 
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Ask anything or search..."
            />
            <button className="search-submit-btn">Search</button>
          </div>
        </section>

        {/* FILTER BAR TABS */}
        <section className="filter-tab-bar">
          <div className="tabs-left">
            <button className={`tab-pill ${activeTab === 'All' ? 'active' : ''}`} onClick={() => setActiveTab('All')}>
              <span>✨</span> All
            </button>
            <button className={`tab-pill ${activeTab === 'People' ? 'active' : ''}`} onClick={() => setActiveTab('People')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              People
            </button>
            <button className={`tab-pill ${activeTab === 'Projects' ? 'active' : ''}`} onClick={() => setActiveTab('Projects')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              Projects
            </button>
            <button className={`tab-pill ${activeTab === 'Events' ? 'active' : ''}`} onClick={() => setActiveTab('Events')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Events
            </button>
            <button className={`tab-pill ${activeTab === 'Communities' ? 'active' : ''}`} onClick={() => setActiveTab('Communities')}>
              <span>#</span> Communities
            </button>
            <button className={`tab-pill ${activeTab === 'Mentors' ? 'active' : ''}`} onClick={() => setActiveTab('Mentors')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              Mentors
            </button>
          </div>

          <button className="filter-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filters
          </button>
        </section>

        {/* CONDITIONALLY RENDER SECTIONS BASED ON SELECTED TAB */}
        <div className="discover-content-body">
          {(activeTab === 'All' || activeTab === 'People') && renderPeople()}
          {(activeTab === 'All' || activeTab === 'Projects') && renderProjects()}
          {(activeTab === 'All' || activeTab === 'Events') && renderEvents()}
          {(activeTab === 'All' || activeTab === 'Communities') && renderCommunities()}
          {(activeTab === 'All' || activeTab === 'Mentors') && renderMentors()}
        </div>
      </main>
    </div>
  );
}