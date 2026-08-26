"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserCommunityIdentity,
  GraphNode,
  MatchRecommendation,
  PeerProfile,
  ProjectOpportunity,
  CommunityEvent,
  CommunitySignal,
  ParsedIntent,
} from "@/types";
import {
  INITIAL_USER_IDENTITY,
  MOCK_PEERS,
  MOCK_PROJECTS,
  MOCK_EVENTS,
  MOCK_SIGNALS,
  MOCK_GRAPH_NODES,
  MOCK_GRAPH_EDGES,
} from "@/data/mockCommunityData";
import { rankCandidatesForQuery } from "@/lib/matchingEngine";

export type ScreenType = "onboarding" | "identity" | "home" | "graph" | "matchmaker";

interface InvitationData {
  candidateId: string;
  candidateName: string;
  projectTitle: string;
  role: string;
  message: string;
  hours: number;
  timestamp: string;
}

interface CommunityContextType {
  identity: UserCommunityIdentity;
  isOnboarded: boolean;
  activeScreen: ScreenType;
  selectedGraphNode: GraphNode | null;
  matchQuery: string;
  parsedIntent: ParsedIntent;
  matchResults: MatchRecommendation[];
  invitations: InvitationData[];
  toastMessage: string | null;
  peers: PeerProfile[];
  projects: ProjectOpportunity[];
  events: CommunityEvent[];
  signals: CommunitySignal[];
  graphNodes: GraphNode[];
  setIdentity: React.Dispatch<React.SetStateAction<UserCommunityIdentity>>;
  setActiveScreen: (screen: ScreenType) => void;
  setSelectedGraphNode: (node: GraphNode | null) => void;
  setMatchQuery: (query: string) => void;
  completeOnboarding: (newIdentity: UserCommunityIdentity) => void;
  searchMatches: (intentQuery: string) => void;
  sendInvitation: (invitation: Omit<InvitationData, "timestamp">) => void;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [identity, setIdentity] = useState<UserCommunityIdentity>(INITIAL_USER_IDENTITY);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(true);
  const [activeScreen, setActiveScreen] = useState<ScreenType>("home");
  const [selectedGraphNode, setSelectedGraphNode] = useState<GraphNode | null>(null);
  
  const [matchQuery, setMatchQuery] = useState<string>(
    "I need a frontend developer for my healthcare AI project who can contribute 8–10 hours per week."
  );

  // Dynamic state computed from matchingEngine
  const initialResult = rankCandidatesForQuery(matchQuery, MOCK_PEERS, identity);
  const [parsedIntent, setParsedIntent] = useState<ParsedIntent>(initialResult.intent);
  const [matchResults, setMatchResults] = useState<MatchRecommendation[]>(initialResult.matches);
  
  const [invitations, setInvitations] = useState<InvitationData[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Re-run matching engine whenever query or identity changes
  useEffect(() => {
    const { intent, matches } = rankCandidatesForQuery(matchQuery, MOCK_PEERS, identity);
    setParsedIntent(intent);
    setMatchResults(matches);
  }, [matchQuery, identity]);

  const completeOnboarding = (newIdentity: UserCommunityIdentity) => {
    setIdentity(newIdentity);
    setIsOnboarded(true);
    setActiveScreen("identity");
    showToast("Community Identity successfully synthesized! Explore your constellation.");
  };

  const searchMatches = (query: string) => {
    setMatchQuery(query);
  };

  const sendInvitation = (invitation: Omit<InvitationData, "timestamp">) => {
    const newInv: InvitationData = {
      ...invitation,
      timestamp: "Just now",
    };
    setInvitations((prev) => [newInv, ...prev]);
    showToast(`Mission invitation sent to ${invitation.candidateName} for "${invitation.projectTitle}"!`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const clearToast = () => setToastMessage(null);

  // Dynamic graph nodes incorporating live candidate scores
  const dynamicGraphNodes: GraphNode[] = [
    {
      id: "user_me",
      label: `${identity.name} (You)`,
      type: "user",
      cluster: "Core User",
      radius: 24,
      x: 0,
      y: 0,
      data: {
        avatar: identity.avatar,
        subtitle: `${identity.skills[0]?.name || "Dev"} • ${identity.availabilityHours}h/w`,
        description: `Primary Goal: ${identity.primaryGoal} | ${identity.activeIntent || identity.headline}`,
      },
    },
    ...MOCK_GRAPH_NODES.filter((n) => n.id !== "user_me").map((node) => {
      if (node.type === "peer") {
        const liveMatch = matchResults.find((m) => m.candidate.id === node.id);
        if (liveMatch) {
          return {
            ...node,
            label: `${liveMatch.candidate.name} (${liveMatch.compatibilityScore}%)`,
            data: {
              ...node.data,
              matchScore: liveMatch.compatibilityScore,
              scoreBreakdown: liveMatch.breakdown,
              subtitle: `${liveMatch.candidate.skills[0]?.name || "Tech"} • ${liveMatch.candidate.availabilityHours}h/w`,
              description: `${liveMatch.compatibilityScore}% Compatibility: ${liveMatch.whyThisWorks.theyOffer}`,
            },
          };
        }
      }
      return node;
    }),
  ];

  return (
    <CommunityContext.Provider
      value={{
        identity,
        isOnboarded,
        activeScreen,
        selectedGraphNode,
        matchQuery,
        parsedIntent,
        matchResults,
        invitations,
        toastMessage,
        peers: MOCK_PEERS,
        projects: MOCK_PROJECTS,
        events: MOCK_EVENTS,
        signals: MOCK_SIGNALS,
        graphNodes: dynamicGraphNodes,
        setIdentity,
        setActiveScreen,
        setSelectedGraphNode,
        setMatchQuery,
        completeOnboarding,
        searchMatches,
        sendInvitation,
        showToast,
        clearToast,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return context;
}
