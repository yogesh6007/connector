// Swap this file's exports with live API responses when your backend is ready.

export const currentUser = {
  name: "Rahul Sharma",
  role: "Student",
  avatar: "https://i.pravatar.cc/150?img=12",
  connectionsCount: 47,
  unreadMessages: 2,
  unreadNotifications: 3
};

export const dashboardStats = [
  { id: 1, count: 2, label: "Events registered", icon: "calendar", color: "#6366F1" },
  { id: 2, count: 1, label: "Projects active", icon: "folder", color: "#8B5CF6" },
  { id: 3, count: 2, label: "Communities joined", icon: "users", color: "#10B981" },
  { id: 4, count: 47, label: "Connections total", icon: "trending-up", color: "#F59E0B" }
];

export const recommendedItems = [
  {
    id: 1,
    type: "Event",
    title: "AI Innovation Challenge",
    date: "September 15, 2026",
    match: "94% Match",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    type: "Project",
    title: "Healthcare AI Platform",
    desc: "Building an AI-powered platform that assists doctors in...",
    match: "91% Match",
    tags: ["UI/UX Designer", "Marketing Strategist"]
  },
  {
    id: 3,
    type: "User",
    name: "Priya Sharma",
    role: "UI/UX Designer",
    match: "91% Match",
    avatar: "https://i.pravatar.cc/150?img=47",
    tags: ["Figma", "User Research"]
  },
  {
    id: 4,
    type: "Event",
    title: "Startup Pitch Competition",
    date: "September 28, 2026",
    match: "87% Match",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 5,
    type: "Project",
    title: "Campus Startup Finder",
    desc: "A platform connecting student entrepreneurs with co-founder...",
    match: "84% Match",
    tags: ["Full Stack Developer", "ML Engineer"]
  },
  {
    id: 6,
    type: "User",
    name: "Aarav Mehta",
    role: "Product Designer",
    match: "87% Match",
    avatar: "https://i.pravatar.cc/150?img=11",
    tags: ["Product Strategy", "Figma"]
  }
];

export const recentConnections = [
  { id: 1, name: "Priya Sharma", role: "UI/UX Designer", match: "91% Match", avatar: "https://i.pravatar.cc/150?img=47" },
  { id: 2, name: "Aarav Mehta", role: "Product Designer", match: "87% Match", avatar: "https://i.pravatar.cc/150?img=11" },
  { id: 3, name: "Sneha Patel", role: "Marketing & Strategy", match: "84% Match", avatar: "https://i.pravatar.cc/150?img=5" }
];

export const recentMessages = [
  { id: 1, name: "Priya Sharma", text: "Sure! Let's connect on the AI Challenge project 😊", time: "2:34 PM", unread: 2, avatar: "https://i.pravatar.cc/150?img=47" },
  { id: 2, name: "Aarav Mehta", text: "The product roadmap looks solid. Let's finalize next week.", time: "Yesterday", unread: 0, avatar: "https://i.pravatar.cc/150?img=11" },
  { id: 3, name: "Dr. Anita Sharma", text: "See you at the challenge kick-off!", time: "Mon", unread: 1, avatar: "https://i.pravatar.cc/150?img=9" }
];

export const notifications = [
  { id: 1, text: "Priya Sharma accepted your connection request.", time: "5 min ago", unread: true },
  { id: 2, text: "Your application for Healthcare AI Platform was accepted! You're now a team member.", time: "1 hour ago", unread: true },
  { id: 3, text: "AI Innovation Challenge starts tomorrow. Check the #announcements channel for last-minute updates.", time: "2 hours ago", unread: true }
];