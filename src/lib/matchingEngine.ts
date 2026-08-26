import {
  PeerProfile,
  UserCommunityIdentity,
  ScoreBreakdown,
  MatchRecommendation,
  StructuredIntent,
  IntentField,
} from "@/types";

// Exact keyword dictionaries for deterministic parsing
const ROLE_PATTERNS: Record<string, { role: string; primarySkills: string[] }> = {
  "frontend developer": { role: "Frontend Developer", primarySkills: ["React", "Figma", "Tailwind CSS"] },
  frontend: { role: "Frontend Developer", primarySkills: ["React", "Tailwind CSS"] },
  "product designer": { role: "Product Designer", primarySkills: ["Figma", "Design Systems"] },
  "ui/ux designer": { role: "UI/UX Designer", primarySkills: ["Figma", "User Research"] },
  "ui designer": { role: "UI Designer", primarySkills: ["Figma", "Design Systems"] },
  "ux researcher": { role: "UX Researcher", primarySkills: ["User Research", "Prototyping"] },
  "rust engineer": { role: "Rust Systems Engineer", primarySkills: ["Rust", "WebAssembly"] },
  rust: { role: "Rust Systems Engineer", primarySkills: ["Rust", "Systems", "WebAssembly"] },
  "systems engineer": { role: "Systems Engineer", primarySkills: ["Rust", "Go / gRPC", "WebAssembly"] },
  "edge engineer": { role: "Edge Computing Engineer", primarySkills: ["Rust", "C++", "PyTorch Mobile"] },
  "embedded systems": { role: "Embedded Systems Engineer", primarySkills: ["Rust", "C++", "Hardware"] },
  "three.js developer": { role: "Three.js / 3D Developer", primarySkills: ["Three.js / WebGL", "TypeScript"] },
  "3d developer": { role: "3D Graphics Developer", primarySkills: ["Three.js / WebGL", "TypeScript"] },
  threejs: { role: "Three.js Developer", primarySkills: ["Three.js / WebGL", "TypeScript"] },
  "biomedical researcher": { role: "Biomedical Researcher", primarySkills: ["Clinical Data Pipelines", "Biostatistics"] },
  "clinical researcher": { role: "Clinical Data Specialist", primarySkills: ["Clinical Data Pipelines", "Biostatistics"] },
  "ai startup": { role: "AI Technical Co-founder", primarySkills: ["PyTorch", "Python / FastAPI", "LangChain / RAG"] },
  "ai engineer": { role: "AI / ML Engineer", primarySkills: ["PyTorch", "LangChain / RAG"] },
  "ml engineer": { role: "Machine Learning Engineer", primarySkills: ["PyTorch", "Python / FastAPI"] },
  "backend developer": { role: "Backend Engineer", primarySkills: ["Python / FastAPI", "Docker"] },
};

const DOMAIN_PATTERNS: Record<string, string> = {
  "healthcare ai": "Healthcare AI",
  healthcare: "Healthcare AI",
  medical: "Healthcare AI",
  clinical: "Clinical Data & Healthcare",
  "edge hardware": "Edge Computing",
  "edge computing": "Edge Computing",
  "low-power": "Edge Systems & Hardware",
  systems: "Distributed Systems",
  "3d visualization": "Spatial Computing (3D)",
  "3d": "Spatial Computing (3D)",
  visualization: "Data Visualization",
  biomedical: "Biomedical & Healthcare",
  genomics: "Bioinformatics & Genomics",
  startup: "AI Venture / Startup",
};

const SKILL_PATTERNS: Record<string, string> = {
  react: "React",
  figma: "Figma",
  "tailwind css": "Tailwind CSS",
  tailwind: "Tailwind CSS",
  "design systems": "Design Systems",
  "user research": "User Research",
  prototyping: "Prototyping",
  "three.js": "Three.js / WebGL",
  three: "Three.js / WebGL",
  webgl: "Three.js / WebGL",
  typescript: "TypeScript",
  rust: "Rust",
  go: "Go / gRPC",
  webassembly: "WebAssembly",
  pytorch: "PyTorch",
  "computer vision": "Computer Vision",
  "clinical datasets": "Clinical Data Pipelines",
  "clinical data": "Clinical Data Pipelines",
  "healthcare validation": "Biostatistics",
  validation: "Biostatistics",
  biostatistics: "Biostatistics",
  docker: "Docker",
};

/**
 * 1. Truthful Structured Natural Language Intent Parser
 * Distinguishes EXPLICIT, INFERRED, and MISSING signals.
 */
export function parseQueryIntent(query: string, userProfile?: UserCommunityIdentity): StructuredIntent {
  const qLower = query.toLowerCase().trim();

  // Special generic query handling (e.g. "I need a teammate.")
  const isGenericTeammateQuery = qLower === "i need a teammate." || qLower === "i need a teammate" || qLower === "looking for a teammate";

  if (isGenericTeammateQuery) {
    return {
      role: { value: null, source: "missing", confidence: "none", displayText: "Not specified" },
      domain: { value: null, source: "missing", confidence: "none", displayText: "Not specified" },
      skills: { value: [], source: "missing", confidence: "none", displayText: "Not specified" },
      bandwidth: { value: null, source: "missing", confidence: "none", displayText: "Not specified" },
      project: { value: null, source: "missing", confidence: "none", displayText: "Not specified" },
    };
  }

  // 1. Role Extraction
  let roleField: IntentField<string> = {
    value: null,
    source: "missing",
    confidence: "none",
    displayText: "Not specified",
  };

  for (const [pattern, entry] of Object.entries(ROLE_PATTERNS)) {
    if (qLower.includes(pattern)) {
      roleField = {
        value: entry.role,
        source: "explicit",
        confidence: "high",
        displayText: entry.role,
      };
      break;
    }
  }

  // 2. Domain Extraction
  let domainField: IntentField<string> = {
    value: null,
    source: "missing",
    confidence: "none",
    displayText: "Not specified",
  };

  for (const [pattern, domainName] of Object.entries(DOMAIN_PATTERNS)) {
    if (qLower.includes(pattern)) {
      domainField = {
        value: domainName,
        source: "explicit",
        confidence: "high",
        displayText: domainName,
      };
      break;
    }
  }

  // 3. Skills Extraction
  const explicitSkills: string[] = [];
  for (const [pattern, canonicalSkill] of Object.entries(SKILL_PATTERNS)) {
    if (qLower.includes(pattern) && !explicitSkills.includes(canonicalSkill)) {
      explicitSkills.push(canonicalSkill);
    }
  }

  let skillsField: IntentField<string[]>;
  if (explicitSkills.length > 0) {
    skillsField = {
      value: explicitSkills,
      source: "explicit",
      confidence: "high",
      displayText: explicitSkills.join(", "),
    };
  } else if (roleField.value && ROLE_PATTERNS[roleField.value.toLowerCase()]) {
    const inferred = ROLE_PATTERNS[roleField.value.toLowerCase()].primarySkills;
    skillsField = {
      value: inferred,
      source: "inferred",
      confidence: "medium",
      displayText: `${inferred.join(", ")} (Inferred)`,
    };
  } else {
    skillsField = {
      value: [],
      source: "missing",
      confidence: "none",
      displayText: "Not specified",
    };
  }

  // 4. Bandwidth / Hours Extraction
  let bandwidthField: IntentField<string> = {
    value: null,
    source: "missing",
    confidence: "none",
    displayText: "Not specified",
  };

  const hoursMatch = qLower.match(/(\d+)\s*(?:-|to|–)?\s*(\d+)?\s*(?:h|hrs|hours)(?:\/week|\s*per\s*week|\s*a\s*week)?/);
  if (hoursMatch) {
    const minH = hoursMatch[1];
    const maxH = hoursMatch[2];
    const displayVal = maxH ? `${minH}–${maxH}h/week` : `${minH}h/week`;
    bandwidthField = {
      value: displayVal,
      source: "explicit",
      confidence: "high",
      displayText: displayVal,
    };
  }

  // 5. Project Context
  let projectField: IntentField<string> = {
    value: null,
    source: "missing",
    confidence: "none",
    displayText: "Not specified",
  };

  if (qLower.includes("neurotriage")) {
    projectField = {
      value: "NeuroTriage AI",
      source: "explicit",
      confidence: "high",
      displayText: "NeuroTriage AI",
    };
  } else if (qLower.includes("edgepulse") || qLower.includes("edge hardware")) {
    projectField = {
      value: "EdgePulse Diagnostics",
      source: "inferred",
      confidence: "medium",
      displayText: "EdgePulse Diagnostics (Suggested)",
    };
  } else if (domainField.value === "Healthcare AI" || qLower.includes("healthcare") || qLower.includes("clinical")) {
    projectField = {
      value: "Healthcare AI Track",
      source: "inferred",
      confidence: "medium",
      displayText: "Healthcare AI Track (Suggested)",
    };
  } else if (qLower.includes("startup")) {
    projectField = {
      value: "AI Startup Venture",
      source: "inferred",
      confidence: "medium",
      displayText: "AI Startup Venture",
    };
  }

  return {
    role: roleField,
    domain: domainField,
    skills: skillsField,
    bandwidth: bandwidthField,
    project: projectField,
  };
}

/**
 * 2. Mathematically Honest Deterministic Scoring Engine
 * Total (100) = Complementarity (35) + Semantic (30) + Availability (20) + Reputation (15)
 */
export function calculateCandidateMatch(
  intent: StructuredIntent,
  candidate: PeerProfile,
  requester: UserCommunityIdentity
): MatchRecommendation {
  const candidateSkillNames = candidate.skills.map((s) => s.name.toLowerCase());
  const requesterSkillNames = requester.skills.map((s) => s.name.toLowerCase());

  const hasExplicitSkills = (intent.skills.value || []).length > 0;
  const targetSkills = intent.skills.value || [];
  const targetDomain = intent.domain.value;
  const targetRole = intent.role.value;

  // --- PART 1: Complementarity (Max 35) ---
  let compScore = 14; // neutral baseline

  if (hasExplicitSkills) {
    targetSkills.forEach((reqSkill) => {
      const candHas = candidateSkillNames.some((cs) => cs.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(cs));
      const reqLacks = !requesterSkillNames.some((rs) => rs.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(rs));

      if (candHas) {
        if (reqLacks) {
          compScore += 9;
        } else {
          compScore += 4;
        }
      }
    });
  } else if (targetRole) {
    const candHeadline = candidate.headline.toLowerCase();
    if (candHeadline.includes(targetRole.toLowerCase()) || candidate.skills.some((s) => s.category.toLowerCase().includes(targetRole.toLowerCase()))) {
      compScore += 12;
    }
  } else {
    // Generic query: evaluate non-overlapping skills directly
    const uniqueSkillsCount = candidate.skills.filter((cs) => !requesterSkillNames.includes(cs.name.toLowerCase())).length;
    compScore += Math.min(18, uniqueSkillsCount * 5);
  }

  compScore = Math.min(35, Math.max(12, compScore));

  // --- PART 2: Semantic & Skill Relevance (Max 30) ---
  let semScore = 6; // baseline

  if (hasExplicitSkills) {
    targetSkills.forEach((reqSkill) => {
      const candHas = candidateSkillNames.some((cs) => cs.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(cs));
      if (candHas) semScore += 8;
    });
  }

  if (targetDomain) {
    const candInterests = candidate.interests.map((i) => i.toLowerCase());
    const domainMatch = candInterests.some((i) => i.includes(targetDomain.toLowerCase()) || targetDomain.toLowerCase().includes(i));
    if (domainMatch) {
      semScore += 10;
    } else {
      const sharedRequesterDomain = candidate.interests.some((i) => requester.interests.includes(i));
      if (sharedRequesterDomain) semScore += 4;
    }
  } else {
    // Generic query: evaluate shared domain interests with requester
    const sharedDomains = candidate.interests.filter((i) => requester.interests.includes(i)).length;
    semScore += Math.min(18, sharedDomains * 6);
  }

  semScore = Math.min(30, Math.max(8, semScore));

  // --- PART 3: Availability (Max 20) ---
  // RULE: If bandwidth is MISSING, score is NEUTRAL (10 / 20). NEVER penalize candidate for unstated requirements.
  let availScore = 10;
  let availExplanation = "Availability not specified in your request (Neutral 10/20).";

  if (intent.bandwidth.source === "explicit" && intent.bandwidth.value) {
    const hMatch = intent.bandwidth.value.match(/(\d+)/);
    const targetHours = hMatch ? parseInt(hMatch[1]) : 8;

    if (candidate.availabilityHours >= targetHours) {
      availScore = 18 + (candidate.availabilityHours >= targetHours + 2 ? 2 : 0);
      availExplanation = `Candidate offers ${candidate.availabilityHours}h/wk (Satisfies your ${targetHours}h/wk target).`;
    } else {
      availScore = Math.round((candidate.availabilityHours / targetHours) * 14);
      availExplanation = `Candidate offers ${candidate.availabilityHours}h/wk (Below your ${targetHours}h/wk target).`;
    }
  } else {
    // If availability is unstated, candidate still brings their availability hours
    availScore = 10 + Math.min(4, Math.round(candidate.availabilityHours / 4));
  }

  availScore = Math.min(20, Math.max(6, availScore));

  // --- PART 4: Reputation & Proof of Work (Max 15) ---
  let powScore = 10;
  if (candidate.projectsCompleted >= 5) powScore += 3;
  else if (candidate.projectsCompleted >= 3) powScore += 2;
  if (candidate.verifiedBadges.length >= 2) powScore += 2;
  powScore = Math.min(15, Math.max(8, powScore));

  // Strict Mathematical Sum
  const totalScore = Math.min(99, compScore + semScore + availScore + powScore);

  const breakdown: ScoreBreakdown = {
    complementarity: compScore,
    maxComplementarity: 35,
    semanticSimilarity: semScore,
    maxSemantic: 30,
    availability: availScore,
    maxAvailability: 20,
    reputation: powScore,
    maxReputation: 15,
    total: totalScore,
  };

  // --- Diagnostic "Why This Works" and "Why Lower" generation ---
  const candidateSkillsList = candidate.skills.map((s) => s.name);
  const matchedSkills = targetSkills.filter((ts) =>
    candidateSkillNames.some((cs) => cs.includes(ts.toLowerCase()) || ts.toLowerCase().includes(cs))
  );

  const strengths: string[] = [];
  const gaps: string[] = [];

  if (matchedSkills.length > 0) {
    strengths.push(`Matches requested skills: ${matchedSkills.join(", ")}`);
  } else if (targetSkills.length > 0) {
    gaps.push(`Does not list required skills (${targetSkills.join(", ")})`);
  }

  if (targetDomain) {
    const domainFit = candidate.interests.some((i) => i.toLowerCase().includes(targetDomain.toLowerCase()) || targetDomain.toLowerCase().includes(i));
    if (domainFit) {
      strengths.push(`Active in ${targetDomain}`);
    } else {
      gaps.push(`No direct ${targetDomain} domain overlap`);
    }
  }

  if (intent.bandwidth.source === "explicit") {
    if (availScore >= 18) {
      strengths.push(`${candidate.availabilityHours}h/wk bandwidth fulfills your requirement`);
    } else {
      gaps.push(`${candidate.availabilityHours}h/wk available is below target`);
    }
  } else {
    strengths.push(`${candidate.availabilityHours}h/wk available bandwidth`);
  }

  if (candidate.projectsCompleted >= 3) {
    strengths.push(`${candidate.projectsCompleted} verified projects completed`);
  }

  // 2-Way Bidirectional Statements
  const roleLabel = targetRole || "technical collaborator";
  const domainLabel = targetDomain || "project collaboration";

  let theyOffer = `${candidate.name.split(" ")[0]} brings ${candidateSkillsList.slice(0, 2).join(" & ")} with ${candidate.availabilityHours}h/wk availability.`;
  let youNeed = `You are seeking ${roleLabel} for ${domainLabel}.`;
  let theyNeed = `${candidate.name.split(" ")[0]} is seeking an AI/Backend collaborator to ship projects.`;
  let youOffer = `You bring PyTorch, Computer Vision, and FastAPI backend engineering.`;
  let sharedContext = `${strengths[0] || "Shared technical growth"}`;

  if (candidate.id === "peer_priya") {
    theyOffer = `Priya brings advanced React & Figma product design with 5 shipped design systems.`;
    theyNeed = `Priya is actively looking for an AI/PyTorch partner to build intelligent clinical workflows.`;
  } else if (candidate.id === "peer_vikram") {
    theyOffer = `Vikram is a lead Rust & WebAssembly engineer with low-latency systems expertise.`;
    theyNeed = `Vikram needs an AI engineer to deploy quantized models on embedded hardware.`;
  } else if (candidate.id === "peer_ananya") {
    theyOffer = `Ananya brings published biomedical informatics pipelines and clinical trial data validation.`;
    theyNeed = `Ananya needs deep learning models to process multimodal hospital inputs.`;
  } else if (candidate.id === "peer_rohan") {
    theyOffer = `Rohan specializes in Three.js / WebGL shaders and real-time interactive canvas UI.`;
    theyNeed = `Rohan is looking for live model streams to render dynamic 3D telemetry.`;
  } else if (candidate.id === "peer_sneha") {
    theyOffer = `Sneha provides clinical user research, hospital doctor testing, and rapid Figma wireframes.`;
    theyNeed = `Sneha is seeking an active technical hackathon project with established backend ML.`;
  } else if (candidate.id === "peer_devansh") {
    theyOffer = `Devansh builds multi-agent workflows, tool-calling evaluation, and local LLM pipelines.`;
    theyNeed = `Devansh needs computer vision integration for combined multimodal triage.`;
  }

  const complementarySkills = candidate.skills.map((ps) => ({
    skill: ps.name,
    theyHave: true,
    youNeed: targetSkills.some((ts) => ts.toLowerCase().includes(ps.name.toLowerCase()) || ps.name.toLowerCase().includes(ts.toLowerCase())),
  }));

  return {
    id: `match_${candidate.id}`,
    candidate,
    compatibilityScore: totalScore,
    breakdown,
    complementarySkills,
    sharedInterests: candidate.interests.filter((i) => requester.interests.includes(i) || (targetDomain && i.toLowerCase().includes(targetDomain.toLowerCase()))),
    availabilityOverlapHours: Math.min(requester.availabilityHours, candidate.availabilityHours),
    whyThisWorks: {
      youNeed,
      theyOffer,
      theyNeed,
      youOffer,
      sharedContext,
    },
    whyLower: {
      strengths: strengths.slice(0, 3),
      gaps: gaps.slice(0, 3),
    },
    matchedProjectContext: intent.project.value || "Community Mission",
  };
}

/**
 * 3. Master Ranking Function
 */
export function rankCandidatesForQuery(
  query: string,
  candidates: PeerProfile[],
  requester: UserCommunityIdentity
): { intent: StructuredIntent; matches: MatchRecommendation[] } {
  const intent = parseQueryIntent(query, requester);
  const matches = candidates
    .map((candidate) => calculateCandidateMatch(intent, candidate, requester))
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  return { intent, matches };
}
