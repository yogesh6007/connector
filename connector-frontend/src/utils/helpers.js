export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

export function formatDeadline(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getMatchScoreColor(score) {
  if (score >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (score >= 75) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (score >= 60) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-slate-50 text-slate-700 border-slate-200';
}

export function getMatchScoreBadgeColor(score) {
  if (score >= 90) return 'bg-emerald-500 text-white';
  if (score >= 75) return 'bg-indigo-600 text-white';
  if (score >= 60) return 'bg-amber-500 text-white';
  return 'bg-slate-500 text-white';
}

export function getStatusBadgeColor(status) {
  switch (status?.toLowerCase()) {
    case 'accepted':
    case 'completed':
    case 'published':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'interview':
    case 'shortlisted':
    case 'in development':
    case 'recruiting teammates':
      return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    case 'under review':
    case 'applied':
    case 'idea / planning':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'rejected':
    case 'closed':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
}

export function truncateText(text, maxLength = 120) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function getInitials(name) {
  if (!name) return 'CO';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
