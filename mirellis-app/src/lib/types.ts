export type ResponseOption = { id: string; label: string };

export type Experience = {
  id: string;
  sourceId: string;
  version: string;
  semanticVersion: string;
  state: string;
  title: string;
  beliefUnderTest: string;
  capability: string;
  prompt: string;
  choicePrompt: string;
  options: ResponseOption[];
  action: string;
  observation: string;
  reflection: string;
  completion: string;
  fallback: string;
  contentHash: string;
};

export type Transition = {
  id: string;
  title: string;
  question: string;
  states: string[];
  experiences: Experience[];
};

export type RouteType = 'guided' | 'minimum' | 'saved' | 'self-guided' | 'no-app';
export type ExplicitFit = 'fit' | 'partly-fit' | 'not-for-me';

export type EvidenceAtom = {
  id: string;
  transitionId: string;
  experienceId: string;
  kind: ExplicitFit;
  createdAt: string;
  expiresAt: string;
};

export type Attempt = {
  transitionId: string;
  experienceId: string;
  currentStep: 'preview' | 'choice' | 'action' | 'reflect' | 'complete';
  selectedValue?: string;
  note?: string;
  routeType?: RouteType;
  startedAt: string;
};

export type ObservatoryRouteType = 'primary' | 'alternate' | 'minimum' | 'self-guided' | 'skipped' | 'exited';

export type ObservatoryRecord = {
  id: string;
  transitionId: string;
  experienceId: string;
  curriculumVersion: string;
  occurredAtLocal: string;
  routeType: ObservatoryRouteType;
  explicitResponse?: string;
  policyVersion: string;
};

// Open text is deliberately separated from structured practice events. No
// recommendation or operational module imports this type.
export type PrivateNote = {
  id: string;
  linkedRecordId?: string;
  createdAtLocal: string;
  text: string;
  source: 'local';
};

export type SavedCue = {
  id: string;
  transitionId: string;
  label: string;
  originRecordId: string;
  createdAtLocal: string;
  suggestionState: 'available' | 'hidden-by-user';
  suggestionHiddenUntil?: string;
};

export type PersonalRoute = {
  id: string;
  transitionId: string;
  label?: string;
  cueIds: [string] | [string, string];
  createdAtLocal: string;
};

export type ReviewNote = {
  id: string;
  transitionId: string;
  recordIds: string[];
  text: string;
  createdAtLocal: string;
};

export type AppData = {
  schemaVersion: 6;
  safetyAcknowledged: boolean;
  analyticsOptIn: boolean;
  researchOptIn: boolean;
  completed: Record<string, string>;
  routes: Record<string, string[]>;
  evidence: EvidenceAtom[];
  selfGuidedReflections: Record<string, number>;
  observatoryRecords: ObservatoryRecord[];
  savedCues: SavedCue[];
  personalRoutes: PersonalRoute[];
  reviewNotes: ReviewNote[];
  privateNotes: PrivateNote[];
  reducedMotion: boolean;
  attempt?: Attempt;
};

export const initialData: AppData = {
  schemaVersion: 6,
  safetyAcknowledged: false,
  analyticsOptIn: false,
  researchOptIn: false,
  completed: {},
  routes: {},
  evidence: [],
  selfGuidedReflections: {},
  observatoryRecords: [],
  savedCues: [],
  personalRoutes: [],
  reviewNotes: [],
  privateNotes: [],
  reducedMotion: false,
};
