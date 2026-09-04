import type { Answers, MomentKey } from './unified-product';

export const UNIFIED_STORAGE_KEY = 'mirellis-unified-v1-v2';
export const LEGACY_AFTER_WORK_KEY = 'mirellis-after-work-v2';
export const LEGACY_AFTER_WORK_DRAFT_KEY = 'mirellis-after-work-draft-v2';

export type PracticeState = 'active' | 'paused' | 'left' | 'completed' | 'saved' | 'discarded';
export type PatternState = 'presented' | 'confirmed' | 'rejected' | 'alternative' | 'unlabelled';

export type UnifiedSession = {
  id: string;
  moment: MomentKey;
  state: PracticeState;
  phase: 'questions' | 'pattern' | 'recommendation' | 'practice' | 'focus-session' | 'reflection';
  questionIndex: number;
  practiceStep: number;
  answers: Answers;
  recommendationKey?: string;
  patternState?: PatternState;
  timerDurationSeconds?: number;
  timerRemainingSeconds?: number;
  timerEndAt?: string;
  startedAt: string;
  updatedAt: string;
};

export type UnifiedRecord = {
  id: string;
  moment: MomentKey;
  practiceKey: string;
  practiceName: string;
  completedAt: string;
  outcome: 'yes' | 'partly' | 'no' | 'not-sure';
  evidence: { questionId: string; answer: string }[];
  patternState?: PatternState;
  note?: string;
  saved: boolean;
  timestampProvenance?: 'live' | 'recalled';
};

export type ExperimentObservation = {
  id: string;
  recordedAt: string;
  provenance: 'live' | 'recalled' | 'confirmed';
  values: Record<string, string>;
};

export type UnifiedExperiment = {
  id: string;
  moment: MomentKey;
  practiceKey: string;
  practiceName: string;
  plannedSessions: number;
  createdAt: string;
  status: 'active' | 'complete';
  observations: ExperimentObservation[];
};

export type UnifiedPreferences = {
  reducedMotion: boolean;
  focusIntention: string;
  focusDuration: 15 | 25 | 45;
  focusBoundary: string;
};

export type UnifiedState = {
  schemaVersion: 1;
  activeSession?: UnifiedSession;
  records: UnifiedRecord[];
  experiments: UnifiedExperiment[];
  preferences: UnifiedPreferences;
};

export const initialUnifiedState: UnifiedState = {
  schemaVersion: 1,
  records: [],
  experiments: [],
  preferences: {
    reducedMotion: false,
    focusIntention: 'Deep work on the proposal',
    focusDuration: 25,
    focusBoundary: 'Pause social feeds until this session ends',
  },
};

export function normaliseUnifiedState(value: unknown): UnifiedState {
  if (!value || typeof value !== 'object') return initialUnifiedState;
  const candidate = value as Partial<UnifiedState>;
  const normalised: UnifiedState = {
    schemaVersion: 1,
    records: Array.isArray(candidate.records) ? candidate.records : [],
    experiments: Array.isArray(candidate.experiments) ? candidate.experiments : [],
    preferences: {
      reducedMotion: Boolean(candidate.preferences?.reducedMotion),
      focusIntention: typeof candidate.preferences?.focusIntention === 'string' ? candidate.preferences.focusIntention : initialUnifiedState.preferences.focusIntention,
      focusDuration: candidate.preferences?.focusDuration === 15 || candidate.preferences?.focusDuration === 45 ? candidate.preferences.focusDuration : 25,
      focusBoundary: typeof candidate.preferences?.focusBoundary === 'string' ? candidate.preferences.focusBoundary : initialUnifiedState.preferences.focusBoundary,
    },
  };
  if (candidate.activeSession) normalised.activeSession = candidate.activeSession;
  return normalised;
}

export function loadUnifiedState(storage: Pick<Storage, 'getItem'>): UnifiedState {
  try {
    const raw = storage.getItem(UNIFIED_STORAGE_KEY);
    return raw ? normaliseUnifiedState(JSON.parse(raw)) : initialUnifiedState;
  } catch {
    return initialUnifiedState;
  }
}

export function saveUnifiedState(storage: Pick<Storage, 'setItem'>, state: UnifiedState) {
  storage.setItem(UNIFIED_STORAGE_KEY, JSON.stringify(state));
}

export function deleteAllMirellisLocalData(storage: Pick<Storage, 'removeItem'>) {
  storage.removeItem(UNIFIED_STORAGE_KEY);
  storage.removeItem(LEGACY_AFTER_WORK_KEY);
  storage.removeItem(LEGACY_AFTER_WORK_DRAFT_KEY);
}

export function createSession(moment: MomentKey, now = new Date()): UnifiedSession {
  const timestamp = now.toISOString();
  return {
    id: `session-${timestamp}-${Math.random().toString(36).slice(2)}`,
    moment,
    state: 'active',
    phase: 'questions',
    questionIndex: 0,
    practiceStep: 0,
    answers: {},
    startedAt: timestamp,
    updatedAt: timestamp,
  };
}

export function recordFromSession(
  session: UnifiedSession,
  practiceName: string,
  outcome: UnifiedRecord['outcome'],
  note: string,
  now = new Date(),
): UnifiedRecord {
  return {
    id: `record-${session.id}`,
    moment: session.moment,
    practiceKey: session.recommendationKey ?? 'unknown',
    practiceName,
    completedAt: now.toISOString(),
    outcome,
    evidence: Object.entries(session.answers).map(([questionId, answer]) => ({ questionId, answer })),
    patternState: session.patternState,
    note: note.trim() || undefined,
    saved: false,
  };
}

export function recordIsVisible(record: UnifiedRecord): boolean {
  return record.saved || record.outcome === 'yes' || record.outcome === 'partly';
}

export function experimentForRecord(record: UnifiedRecord, now = new Date()): UnifiedExperiment | undefined {
  const plannedSessions = record.moment === 'night' || record.moment === 'waking' ? 7 : record.moment === 'focus' ? 3 : 0;
  if (!plannedSessions) return undefined;
  return {
    id: `experiment-${record.id}`,
    moment: record.moment,
    practiceKey: record.practiceKey,
    practiceName: record.practiceName,
    plannedSessions,
    createdAt: now.toISOString(),
    status: 'active',
    observations: [],
  };
}
