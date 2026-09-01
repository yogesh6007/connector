import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { exploreService } from '../../services/exploreService';
import { useApp } from '../../context/AppContext';
import { PROJECT_DOMAINS, POPULAR_SKILLS, OPPORTUNITY_TYPES, WORK_MODES } from '../../utils/constants';
import {
  Compass,
  Search,
  Users2,
  FolderKanban,
  Building2,
  Briefcase,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  MessageSquare,
  MessageCircle,
  FileText
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { PostCard } from '../../components/feed/PostCard';

export const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialTab = searchParams.get('tab') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const [searchData, setSearchData] = useState({
    counts: { people: 0, projects: 0, posts: 0, organizations: 0, opportunities: 0, total: 0 },
    results: { people: [], projects: [], posts: [], organizations: [], opportunities: [] }
  });
  const [isLoading, setIsLoading] = useState(false);

  const { startConversation } = useApp();
  const navigate = useNavigate();

  const executeSearch = async () => {
    setIsLoading(true);
    try {
      const data = await exploreService.search({
        q: query,
        tab: activeTab,
        skill: selectedSkill !== 'all' ? selectedSkill : undefined,
        domain: selectedDomain !== 'all' ? selectedDomain : undefined,
        type: selectedType !== 'all' ? selectedType : undefined
      });
      setSearchData(data);
    } catch (err) {
      console.error('Explore search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, [query, activeTab, selectedSkill, selectedDomain, selectedType]);

  const handleSearchChange = (val) => {
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val, tab: activeTab });
    } else {
      setSearchParams({ tab: activeTab });
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (query.trim()) {
      setSearchParams({ q: query, tab: tabId });
    } else {
      setSearchParams({ tab: tabId });
    }
  };

  const handleDirectChat = (person) => {
    startConversation({
      id: person.id,
      name: person.name,
      avatar: person.avatar || person.logo,
      role: person.headline || person.tagline || 'User'
    });
    navigate('/student/messages');
  };

  const tabs = [
    { id: 'all', label: 'All Results', count: searchData.counts.total },
    { id: 'people', label: 'People', count: searchData.counts.people },
    { id: 'projects', label: 'Projects', count: searchData.counts.projects },
    { id: 'posts', label: 'Posts', count: searchData.counts.posts },
    { id: 'organizations', label: 'Organizations', count: searchData.counts.organizations },
    { id: 'opportunities', label: 'Opportunities', count: searchData.counts.opportunities }
  ];

  return (
    <div className="space-y-6">
      
      {/* Search Hero Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
            <Compass className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Universal Discovery Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Explore CONNECTOR</h1>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search CONNECTOR for people, projects, opportunities, posts..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === tab.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Faceted Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {(activeTab === 'all' || activeTab === 'people') && (
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-brand-500"
            >
              <option value="all">Filter by Skill (All)</option>
              {POPULAR_SKILLS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}

          {(activeTab === 'all' || activeTab === 'projects') && (
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-brand-500"
            >
              <option value="all">Filter by Domain (All)</option>
              {PROJECT_DOMAINS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          )}

          {(activeTab === 'all' || activeTab === 'opportunities') && (
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-brand-500"
            >
              <option value="all">Filter by Type (All)</option>
              {Object.values(OPPORTUNITY_TYPES).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Results Content */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          Searching real database records...
        </div>
      ) : searchData.counts.total === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
          <Search className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No results found</h3>
          <p className="text-xs text-slate-400">Try adjusting your query or filter parameters.</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* 1. PEOPLE */}
          {(activeTab === 'all' || activeTab === 'people') && searchData.results.people.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users2 className="w-4 h-4 text-brand-600" />
                <span>People ({searchData.results.people.length})</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchData.results.people.map(person => (
                  <div key={person.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between space-y-3">
                    <div className="flex items-start gap-3">
                      <Avatar src={person.avatar} name={person.name} size="md" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{person.name}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{person.college || person.organizationName}</p>
                        <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{person.headline || person.bio}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {(person.skills || []).slice(0, 3).map(sk => (
                        <span key={typeof sk === 'string' ? sk : sk.name} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {typeof sk === 'string' ? sk : sk.name}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                      <Link to={`/student/profile/${person.id}`} className="flex-1">
                        <Button
                          variant="secondary"
                          size="xs"
                          className="w-full"
                        >
                          View Profile
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleDirectChat(person)}
                      >
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. PROJECTS */}
          {(activeTab === 'all' || activeTab === 'projects') && searchData.results.projects.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FolderKanban className="w-4 h-4 text-purple-600" />
                <span>Projects ({searchData.results.projects.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchData.results.projects.map(proj => (
                  <div key={proj.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">{proj.domain}</span>
                      <Badge variant="brand" size="xs">{proj.status}</Badge>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{proj.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{proj.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-400">Lead: {proj.ownerName}</span>
                      <Link to={`/student/projects/${proj.id}`} className="font-bold text-brand-600 hover:text-brand-700">
                        View Project →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. OPPORTUNITIES */}
          {(activeTab === 'all' || activeTab === 'opportunities') && searchData.results.opportunities.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>Opportunities ({searchData.results.opportunities.length})</span>
              </h3>

              <div className="space-y-3">
                {searchData.results.opportunities.map(opp => (
                  <div key={opp.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={opp.orgLogo} name={opp.orgName} size="md" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{opp.title}</h4>
                        <p className="text-[11px] text-slate-500">{opp.orgName} • {opp.stipend} ({opp.workMode})</p>
                      </div>
                    </div>
                    <Link to={`/student/opportunities/${opp.id}`}>
                      <Button variant="primary" size="xs">
                        Community & Apply
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* 5. POSTS */}
          {(activeTab === 'all' || activeTab === 'posts') && searchData.results.posts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-600" />
                <span>Posts ({searchData.results.posts.length})</span>
              </h3>

              <div className="space-y-4">
                {searchData.results.posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
