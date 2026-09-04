export type ReleaseEvidenceStatus = 'verified' | 'pending' | 'blocked';

export const AFTER_WORK_RELEASE_CANDIDATE = '2026.08-phase-0';

export const releaseOwners = {
  releaseAuthority: 'Aseem Sharda',
  productOwner: 'Aseem Sharda',
  editorialOwner: 'Aseem Sharda',
  privacyOwner: 'Aseem Sharda',
  supportContact: 'contact@lambdalifestyle.com',
  incidentOwner: 'Aseem Sharda',
  pauseAuthority: 'Aseem Sharda',
  rollbackOwner: 'Aseem Sharda',
  accessibilityOwner: 'Aseem Sharda',
} as const;

export const supportCoverage = {
  channel: 'Email at contact@lambdalifestyle.com',
  acknowledgementTarget: 'Within two business days during the controlled pilot',
  urgentBoundary: 'Mirellis does not provide emergency, crisis, medical, clinical, or therapy support.',
  pauseRule: 'A confirmed safety, privacy, deletion, consent, accessibility, or forced-route defect pauses the affected release path.',
} as const;

export const releaseEvidence = [
  { id: 'automated-product-tests', status: 'verified', evidence: 'TypeScript, unit tests, and production build are required for the candidate evidence pack.' },
  { id: 'claim-and-url-register', status: 'verified', evidence: 'Phase 0 creates a reviewable redirect register, canonical safeguard, and automated public-claim triage.' },
  { id: 'people-owned-operations', status: 'verified', evidence: 'Release, support, incident, pause, rollback, privacy, editorial, and accessibility ownership is recorded in this file.' },
  { id: 'human-accessibility-review', status: 'pending', evidence: 'A named human must record keyboard, screen-reader, contrast, touch-target, text-scaling, and reduced-motion results on supported devices.' },
  { id: 'qualitative-pilot', status: 'pending', evidence: 'The approved 8–12-person After Work pilot has not yet produced a signed review decision.' },
  { id: 'commerce-operations', status: 'pending', evidence: 'Checkout, payment, shipping, fulfilment, refund, and transactional-email evidence must be recorded without placing an unintended order.' },
] as const satisfies ReadonlyArray<{ id: string; status: ReleaseEvidenceStatus; evidence: string }>;

export const releaseDecision = {
  status: releaseEvidence.every((item) => item.status === 'verified') ? 'certified' : 'preflight',
  releaseCandidate: AFTER_WORK_RELEASE_CANDIDATE,
  scope: 'One public After Work route, one optional private 21-day programme, and one local private record.',
  explicitExclusions: ['mass paid acquisition', 'additional app transitions', 'clinical or health outcomes', 'automatic research participation', 'private app analytics'],
} as const;

export function assertReleaseRecordIntegrity(): void {
  const people = Object.values(releaseOwners);
  if (people.some((owner) => !owner.trim())) throw new Error('Every release role must have an accountable owner or contact.');
  if (!supportCoverage.channel.includes('@')) throw new Error('The controlled pilot must have a working support channel.');
  if (new Set(releaseEvidence.map((item) => item.id)).size !== releaseEvidence.length) throw new Error('Release evidence IDs must be unique.');
  if (releaseDecision.status === 'certified' && releaseEvidence.some((item) => item.status !== 'verified')) throw new Error('A release cannot be certified with pending or blocked evidence.');
}
