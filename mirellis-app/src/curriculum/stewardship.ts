import { v1Transitions } from '@/lib/v1-transition-model';
import type { Experience, Transition } from '@/lib/types';

export const CURRICULUM_VERSION = '3.0.0';
export type CurriculumStatus = 'active-legacy' | 'draft' | 'review' | 'released' | 'retired';

export type CurriculumExperience = {
  id: string;
  semanticVersion: string;
  status: CurriculumStatus;
  transitionId: string;
  stateId: string;
  learnerObstacle: string;
  beliefUnderTest: string;
  capability: string;
  permittedEvidence: ['fit', 'partly-fit', 'not-for-me'];
  evidenceExpiryDays: 30;
  explanationTemplates: { requiredNext: string; recentFit: string; negativeFit: string };
  constraints: string[];
  safetyRoute: 'minimum-or-exit';
  acceptanceTestIds: string[];
  redTeamStatus: 'not-yet-reviewed' | 'passed';
  approval?: { reviewedVersion: string; approvers: string[]; changeRequestId: string };
};

export type TransitionDossier = {
  id: string;
  semanticVersion: string;
  status: 'active';
  title: string;
  purpose: string;
  boundary: string;
  stateMap: string[];
  safetyPerimeter: string[];
  experienceInventory: CurriculumExperience[];
  evolutionLog: string[];
};

const acceptanceTestIds = ['curriculum-schema-completeness', 'route-determinism', 'evidence-integrity', 'accessibility-controls', 'privacy-local-first'];
const safetyPerimeter = ['urgent', 'caregiving', 'driving', 'illness', 'acute-distress', 'movement-unavailable', 'leave-for-today'];

function dossierId(index: number) {
  return `TR-${String(index + 1).padStart(3, '0')}`;
}

function toCurriculumExperience(transition: Transition, experience: Experience): CurriculumExperience {
  return {
    id: experience.id,
    semanticVersion: experience.semanticVersion,
    status: 'active-legacy',
    transitionId: transition.id,
    stateId: experience.state,
    learnerObstacle: experience.beliefUnderTest,
    beliefUnderTest: experience.beliefUnderTest,
    capability: experience.capability,
    permittedEvidence: ['fit', 'partly-fit', 'not-for-me'],
    evidenceExpiryDays: 30,
    explanationTemplates: {
      requiredNext: 'This is the next experience in the path you started.',
      recentFit: 'You said this cue fit before.',
      negativeFit: 'This is hidden because you said it did not fit. You can restore it.',
    },
    constraints: safetyPerimeter,
    safetyRoute: 'minimum-or-exit',
    acceptanceTestIds,
    redTeamStatus: 'not-yet-reviewed',
  };
}

export const transitionDossiers: TransitionDossier[] = v1Transitions.map((transition, index) => ({
  id: dossierId(index),
  semanticVersion: CURRICULUM_VERSION,
  status: 'active',
  title: transition.title,
  purpose: transition.question,
  boundary: 'One voluntary micro-experiment at a time; no diagnosis, hidden inference, reward loop, or forced completion.',
  stateMap: transition.states,
  safetyPerimeter,
  experienceInventory: transition.experiences.map((experience) => toCurriculumExperience(transition, experience)),
  evolutionLog: ['CR-003: V3 stewardship framework applied; existing learning content remains unchanged and requires named review before a semantic change.'],
}));

export function assertCurriculumIntegrity(dossiers = transitionDossiers): void {
  if (dossiers.length !== 4) throw new Error(`Expected four active V1 transition dossiers, received ${dossiers.length}.`);
  const experienceIds = new Set<string>();
  for (const dossier of dossiers) {
    if (!/^TR-\d{3}$/.test(dossier.id)) throw new Error(`Invalid dossier ID: ${dossier.id}`);
    if (dossier.experienceInventory.length !== 15) throw new Error(`${dossier.id} must inventory fifteen experiences.`);
    if (dossier.stateMap.length !== 5) throw new Error(`${dossier.id} must define five learning states.`);
    if (!dossier.purpose || !dossier.boundary || dossier.safetyPerimeter.length === 0) throw new Error(`${dossier.id} is missing a required dossier field.`);
    for (const experience of dossier.experienceInventory) {
      if (experienceIds.has(experience.id)) throw new Error(`Duplicate curriculum experience ID: ${experience.id}`);
      experienceIds.add(experience.id);
      if (!/^\d+\.\d+\.\d+$/.test(experience.semanticVersion)) throw new Error(`${experience.id} requires a semantic version.`);
      if (!experience.learnerObstacle || !experience.beliefUnderTest || !experience.capability) throw new Error(`${experience.id} is missing its authoring contract.`);
      if (experience.evidenceExpiryDays !== 30) throw new Error(`${experience.id} has an invalid evidence policy.`);
      if (experience.constraints.length === 0 || !experience.safetyRoute || experience.acceptanceTestIds.length === 0) throw new Error(`${experience.id} is missing a safety or acceptance requirement.`);
      if (experience.status === 'released' && (!experience.approval || experience.approval.approvers.length === 0 || experience.redTeamStatus !== 'passed')) throw new Error(`${experience.id} cannot be released without named approval and a passed red-team review.`);
    }
  }
  if (experienceIds.size !== 60) throw new Error(`Expected 60 active V1 curriculum experiences, received ${experienceIds.size}.`);
}
