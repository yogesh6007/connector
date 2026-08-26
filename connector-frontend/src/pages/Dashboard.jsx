import React, { useState } from 'react';
import './Dashboard.css';
import { 
  currentUser as initialUser, 
  dashboardStats, 
  recommendedItems
} from '../data/dashboardData';

export default function Dashboard() {
  const [user, setUser] = useState(initialUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const filteredRecommendations = (recommendedItems || []).filter(item => {
    const title = item.title || item.name || '';
    const desc = item.desc || item.role || '';
    const query = searchQuery.toLowerCase();
    return title.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
  });

  const handleClearNotifications = () => {
    setUser(prev => ({ ...prev, unreadNotifications: 0 }));
  };

  if (!user) return <div className="loading-state">Loading...</div>;

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR NAVIGATION */}
      <aside className="sidebar">
        <div className="brand-logo">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <h3 className="brand-title">CONNECTOR</h3>
            <span className="brand-sub">Student Portal</span>
          </div>
        </div>

        <nav className="nav-menu">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>Dashboard</span>
          </button>
          <button className={`nav-item ${activeTab === 'discover' ? 'active' : ''}`} onClick={() => setActiveTab('discover')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
            <span>Discover</span>
          </button>
          <button className={`nav-item ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>Events</span>
          </button>
          <button className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            <span>Projects</span>
          </button>
          <button className={`nav-item ${activeTab === 'connections' ? 'active' : ''}`} onClick={() => setActiveTab('connections')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Connections</span>
          </button>
          <button className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>Messages</span>
            {user.unreadMessages > 0 && <span className="nav-badge purple">{user.unreadMessages}</span>}
          </button>
          <button className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => { setActiveTab('notifications'); handleClearNotifications(); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span>Notifications</span>
            {user.unreadNotifications > 0 && <span className="nav-badge red">{user.unreadNotifications}</span>}
          </button>
          <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Profile</span>
          </button>
        </nav>

        <div className="sidebar-user-footer">
          <img src={user.avatar} alt={user.name} className="user-avatar-sm" />
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        {/* TOP NAVBAR */}
        <header className="top-header">
          <div className="search-bar-container">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Search people, projects, events or communities..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="header-actions">
            <button className="icon-btn" onClick={() => setActiveTab('messages')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </button>
            
            {/* NOTIFICATION BUTTON IN NAVBAR */}
            <button className="icon-btn relative" onClick={handleClearNotifications}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {user.unreadNotifications > 0 && <span className="dot-badge"></span>}
            </button>
            <img src={user.avatar} alt={user.name} className="header-avatar" />
          </div>
        </header>

        {/* WELCOME SECTION */}
        <section className="welcome-section">
          <div>
            <h1 className="greeting-text">Good evening, {user.name ? user.name.split(' ')[0] : 'Student'} 👋</h1>
            <p className="greeting-sub">Wednesday, 26 August · Here's what's new for you</p>
          </div>
          <div className="network-pill">
            <span className="pill-lbl">Your network</span>
            <span className="pill-val">{user.connectionsCount} connections</span>
            <img src={user.avatar} alt="network" className="network-avatar" />
          </div>
        </section>

        {/* METRICS STATS GRID */}
        <section className="stats-grid">
          {(dashboardStats || []).map(stat => (
            <div key={stat.id} className="stat-card">
              <div className="stat-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
              </div>
              <div className="stat-data">
                <span className="stat-count">{stat.count}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </section>

        {/* RECOMMENDED FOR YOU CAROUSEL */}
        <section className="section-block">
          <div className="section-header">
            <h3><span className="sparkle">✨</span> Recommended for You</h3>
            <button className="see-all-btn" onClick={() => setActiveTab('discover')}>See all &gt;</button>
          </div>

          <div className="cards-horizontal-scroll">
            {filteredRecommendations.length > 0 ? (
              filteredRecommendations.map(item => (
                <div key={item.id} className="rec-card">
                  {item.image && (
                    <div className="card-image-hero" style={{ backgroundImage: `url(${item.image})` }}>
                      <span className="badge-type">{item.type}</span>
                      <span className="badge-match">{item.match}</span>
                    </div>
                  )}
                  <div className="card-body">
                    {!item.image && (
                      <div className="card-top-meta">
                        {item.avatar ? (
                          <img src={item.avatar} alt={item.name} className="card-user-avatar" />
                        ) : (
                          <span className="badge-type purple-soft">{item.type}</span>
                        )}
                        <span className="badge-match">{item.match}</span>
                      </div>
                    )}
                    <h4 className="card-title">{item.title || item.name}</h4>
                    {item.role && <p className="card-sub">{item.role}</p>}
                    {item.desc && <p className="card-desc">{item.desc}</p>}
                    {item.date && <p className="card-sub">{item.date}</p>}

                    {item.tags && (
                      <div className="card-tags">
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className="tag-chip">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results-msg">No results matching "{searchQuery}"</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}