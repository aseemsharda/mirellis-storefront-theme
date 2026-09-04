import { transitionDossiers } from '@/curriculum/stewardship';
import { releaseDecision, releaseEvidence, releaseOwners, supportCoverage, type ReleaseEvidenceStatus } from './release-record';

export const LAUNCH_OPERATIONS_VERSION = '1.0.0';

export type ReadinessStatus = 'ready' | 'pending';

export type LaunchGate = {
  id: string;
  label: string;
  status: ReadinessStatus;
  detail: string;
};

export const operatingBoundary = {
  accountFree: true,
  localFirst: true,
  analyticsDefault: 'off',
  researchDefault: 'off',
  prohibited: ['personal AI', 'behavioural profiling', 'app push notifications', 'scores or streaks', 'health claims'],
  supportScope: ['installation and access', 'local-data controls', 'consent controls', 'route and accessibility defects'],
  supportExcludes: ['emergency, crisis, medical, clinical, or therapy support'],
} as const;

const hasNamedCurriculumApproval = transitionDossiers.every((dossier) =>
  dossier.experienceInventory.every((experience) =>
    experience.redTeamStatus === 'passed' && Boolean(experience.approval?.approvers.length),
  ),
);

export const launchGates: LaunchGate[] = [
  {
    id: 'curriculum',
    label: 'Curriculum approval',
    status: hasNamedCurriculumApproval ? 'ready' : 'pending',
    detail: hasNamedCurriculumApproval
      ? 'Every active experience has named approval and a passed red-team review.'
      : 'The V1/V2/V3 artefacts are present, but named approval and red-team review have not been recorded for the existing legacy experiences.',
  },
  {
    id: 'product',
    label: 'Local product controls',
    status: 'ready',
    detail: 'Core use is account-free and local-first, with four distinct person-selected actions, an optional 21-day programme, interruption/resume, and leaving without penalty.',
  },
  {
    id: 'privacy',
    label: 'Consent and deletion',
    status: 'ready',
    detail: 'Core local data is explained; analytics and research are separate, optional, and off by default; local deletion is available.',
  },
  {
    id: 'operations',
    label: 'People-owned operations',
    status: 'ready',
    detail: `Release, incident, pause, and rollback authority are assigned to ${releaseOwners.releaseAuthority}; pilot support is ${supportCoverage.channel}.`,
  },
  {
    id: 'accessibility',
    label: 'Accessibility review',
    status: 'pending',
    detail: 'Keyboard, screen reader, contrast, touch target, text scaling, and reduced-motion checks require recorded human verification.',
  },
];

export const launchState = {
  status: launchGates.every((gate) => gate.status === 'ready') && releaseDecision.status === 'certified' ? 'certified' : 'preflight',
  decisionRule: 'A Version 4 change must be evidence-bound, reversible, and approved by people; it cannot be inferred from engagement.',
  rollbackRule: 'Pause or roll back when a safety, privacy, accessibility, or route-control defect is confirmed.',
} as const;

export function assertLaunchOperationsIntegrity(gates = launchGates): void {
  const operationalEvidence: ReadonlyArray<{ id: string; status: ReleaseEvidenceStatus }> = releaseEvidence;
  if (!operatingBoundary.accountFree || !operatingBoundary.localFirst) throw new Error('Launch operations must preserve account-free, local-first core use.');
  if (operatingBoundary.analyticsDefault !== 'off' || operatingBoundary.researchDefault !== 'off') throw new Error('Optional learning consent must be off by default.');
  if (gates.length !== 5 || new Set(gates.map((gate) => gate.id)).size !== gates.length) throw new Error('Launch gates must be complete and uniquely identified.');
  if (!gates.some((gate) => gate.id === 'operations' && gate.status === 'ready')) throw new Error('People-owned operational assignments must be recorded.');
  if (operationalEvidence.some((item) => item.id === 'human-accessibility-review' && item.status !== 'verified') && launchState.status === 'certified') throw new Error('Formal launch cannot be certified without recorded human accessibility evidence.');
  if (launchState.status === 'certified' && !hasNamedCurriculumApproval) throw new Error('Curriculum cannot be certified without recorded named approval.');
}
