export type GoalType =
  | "BUILD"
  | "LEARN"
  | "FIND_TEAM"
  | "FIND_MENTOR"
  | "JOIN_COMMUNITY"
  | "FIND_OPPORTUNITIES";

export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced" | "Lead";

export type CollaborationStyle =
  | "Fast-paced Hackathons"
  | "Deep Research & Architecture"
  | "Weekend Open-Source"
  | "Casual Study Cohort";

export interface SkillItem {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "AI/ML" | "Design" | "Mobile" | "Systems" | "Domain";
  level: ExperienceLevel;
}

export interface UserCommunityIdentity {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  headline: string;
  primaryGoal: GoalType;
  secondaryGoals: GoalType[];
  skills: SkillItem[];
  interests: string[];
  experienceLevel: ExperienceLevel;
  availabilityHours: number;
  collaborationStyle: CollaborationStyle;
  activeIntent?: string;
  bio: string;
  karmaPoints: number;
  communities: string[];
  activeProjects: string[];
}

export type NodeType =
  | "user"
  | "peer"
  | "skill"
  | "interest"
  | "project"
  | "community"
  | "event";

export interface ScoreBreakdown {
  complementarity: number; // Max 35
  maxComplementarity: 35;
  semanticSimilarity: number; // Max 30
  maxSemantic: 30;
  availability: number; // Max 20
  maxAvailability: 20;
  reputation: number; // Max 15
  maxReputation: 15;
  total: number; // Exactly sum of above
}

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  cluster: "AI/ML" | "Design" | "Web Systems" | "Healthcare" | "Core User" | "General";
  radius: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  data?: {
    avatar?: string;
    subtitle?: string;
    description?: string;
    skills?: string[];
    matchScore?: number;
    scoreBreakdown?: ScoreBreakdown;
    availability?: number;
    membersCount?: number;
    openRoles?: string[];
    urgency?: "high" | "medium" | "low";
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  strength?: number;
  type: "skill_match" | "interest_shared" | "project_member" | "community_member" | "recommendation";
}

export interface PeerProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  headline: string;
  bio: string;
  skills: SkillItem[];
  interests: string[];
  experienceLevel: ExperienceLevel;
  availabilityHours: number;
  collaborationStyle: CollaborationStyle;
  activeIntent: string;
  communities: string[];
  projectsCompleted: number;
  karma: number;
  verifiedBadges: string[];
}

export type SignalSource = "explicit" | "inferred" | "missing";
export type SignalConfidence = "high" | "medium" | "low" | "none";

export interface IntentField<T> {
  value: T | null;
  source: SignalSource;
  confidence: SignalConfidence;
  displayText: string;
}

export interface StructuredIntent {
  role: IntentField<string>;
  domain: IntentField<string>;
  skills: IntentField<string[]>;
  bandwidth: IntentField<string>;
  project: IntentField<string>;
}

// Backward compatibility alias
export type ParsedIntent = StructuredIntent;

export interface MatchRecommendation {
  id: string;
  candidate: PeerProfile;
  compatibilityScore: number; // 0 - 100
  breakdown: ScoreBreakdown;
  complementarySkills: {
    skill: string;
    theyHave: boolean;
    youNeed: boolean;
  }[];
  sharedInterests: string[];
  availabilityOverlapHours: number;
  whyThisWorks: {
    youNeed: string;
    theyOffer: string;
    theyNeed: string;
    youOffer: string;
    sharedContext: string;
  };
  whyLower?: {
    strengths: string[];
    gaps: string[];
  };
  matchedProjectContext?: string;
}

export interface ProjectOpportunity {
  id: string;
  title: string;
  tagline: string;
  mission: string;
  communityName: string;
  targetDeadline?: string;
  urgency: "High (36h left)" | "Medium (Next Week)" | "Ongoing";
  openRoles: {
    roleTitle: string;
    requiredSkills: string[];
    hoursPerWeek: number;
    matchedSkillCount: number;
  }[];
  currentTeam: {
    name: string;
    role: string;
    avatar: string;
  }[];
  techStack: string[];
  relevanceScore: number;
  relevanceReason: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  type: "Hackathon" | "Technical Workshop" | "Project Sprint" | "Mentor AMA";
  organizerCommunity: string;
  dateTime: string;
  location: string;
  attendeeCount: number;
  knownAttendees: {
    name: string;
    avatar: string;
  }[];
  topics: string[];
  relevanceReason: string;
}

export interface CommunitySignal {
  id: string;
  type: "demand" | "milestone" | "skill_gap" | "squad_forming";
  text: string;
  timestamp: string;
  actionableContext?: string;
}
