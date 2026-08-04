import type { AppData, ObservatoryRecord, PersonalRoute, PrivateNote, ReviewNote, SavedCue } from './types';

export const OBSERVATORY_VERSION = '4.0.0';
export const PRIVATE_TEXT_LIMIT = 280;

export function routeTypeForRecord(routeType?: string): ObservatoryRecord['routeType'] {
  if (routeType === 'minimum') return 'minimum';
  if (routeType === 'self-guided' || routeType === 'saved' || routeType === 'no-app') return 'self-guided';
  return 'primary';
}

export function sortedRecords(data: AppData, transitionId?: string): ObservatoryRecord[] {
  return data.observatoryRecords
    .filter((record) => !transitionId || record.transitionId === transitionId)
    .slice()
    .sort((a, b) => new Date(b.occurredAtLocal).getTime() - new Date(a.occurredAtLocal).getTime());
}

export function noteForRecord(data: AppData, recordId: string): PrivateNote | undefined {
  return data.privateNotes.find((note) => note.linkedRecordId === recordId);
}

export function savePrivateNote(data: AppData, recordId: string, text: string): AppData {
  const cleanText = text.trim();
  if (!cleanText || cleanText.length > PRIVATE_TEXT_LIMIT) throw new Error(`A private note is limited to ${PRIVATE_TEXT_LIMIT} characters.`);
  const existing = noteForRecord(data, recordId);
  const note: PrivateNote = existing
    ? { ...existing, text: cleanText }
    : { id: `note-${crypto.randomUUID()}`, linkedRecordId: recordId, createdAtLocal: new Date().toISOString(), text: cleanText, source: 'local' };
  return { ...data, privateNotes: existing ? data.privateNotes.map((item) => item.id === note.id ? note : item) : [...data.privateNotes, note] };
}

export function createCue(data: AppData, record: ObservatoryRecord, label: string): AppData {
  const cleanLabel = label.trim();
  if (!cleanLabel || cleanLabel.length > 80) throw new Error('A cue needs a label of up to 80 characters.');
  if (data.savedCues.some((cue) => cue.originRecordId === record.id)) return data;
  const cue: SavedCue = {
    id: `cue-${crypto.randomUUID()}`,
    transitionId: record.transitionId,
    label: cleanLabel,
    originRecordId: record.id,
    createdAtLocal: new Date().toISOString(),
    suggestionState: 'available',
  };
  return { ...data, savedCues: [...data.savedCues, cue] };
}

export function removeRecord(data: AppData, recordId: string): AppData {
  const removedCueIds = new Set(data.savedCues.filter((cue) => cue.originRecordId === recordId).map((cue) => cue.id));
  return {
    ...data,
    observatoryRecords: data.observatoryRecords.filter((record) => record.id !== recordId),
    privateNotes: data.privateNotes.filter((note) => note.linkedRecordId !== recordId),
    savedCues: data.savedCues.filter((cue) => cue.originRecordId !== recordId),
    personalRoutes: data.personalRoutes.filter((route) => !route.cueIds.some((id) => removedCueIds.has(id))),
    reviewNotes: data.reviewNotes.filter((note) => !note.recordIds.includes(recordId)),
  };
}

export function removeCue(data: AppData, cueId: string): AppData {
  return {
    ...data,
    savedCues: data.savedCues.filter((cue) => cue.id !== cueId),
    personalRoutes: data.personalRoutes.filter((route) => !route.cueIds.includes(cueId)),
  };
}

export function removeTransitionObservatoryData(data: AppData, transitionId: string): AppData {
  const cueIds = new Set(data.savedCues.filter((cue) => cue.transitionId === transitionId).map((cue) => cue.id));
  return {
    ...data,
    observatoryRecords: data.observatoryRecords.filter((record) => record.transitionId !== transitionId),
    privateNotes: data.privateNotes.filter((note) => !data.observatoryRecords.some((record) => record.id === note.linkedRecordId && record.transitionId === transitionId)),
    savedCues: data.savedCues.filter((cue) => cue.transitionId !== transitionId),
    personalRoutes: data.personalRoutes.filter((route) => route.transitionId !== transitionId && !route.cueIds.some((id) => cueIds.has(id))),
    reviewNotes: data.reviewNotes.filter((note) => note.transitionId !== transitionId),
  };
}

export function createPersonalRoute(data: AppData, transitionId: string, cueIds: string[], label?: string): AppData {
  if (cueIds.length < 1 || cueIds.length > 2 || new Set(cueIds).size !== cueIds.length) throw new Error('A personal route needs one or two distinct cues.');
  if (cueIds.some((id) => !data.savedCues.some((cue) => cue.id === id && cue.transitionId === transitionId))) throw new Error('A route can only use visible cues from its transition.');
  const route: PersonalRoute = {
    id: `route-${crypto.randomUUID()}`,
    transitionId,
    cueIds: cueIds as PersonalRoute['cueIds'],
    label: label?.trim().slice(0, 80) || undefined,
    createdAtLocal: new Date().toISOString(),
  };
  return { ...data, personalRoutes: [...data.personalRoutes, route] };
}

export function createReviewNote(data: AppData, transitionId: string, recordIds: string[], text: string): AppData {
  const cleanText = text.trim();
  if (!cleanText || cleanText.length > PRIVATE_TEXT_LIMIT) throw new Error(`A private note is limited to ${PRIVATE_TEXT_LIMIT} characters.`);
  const visibleIds = new Set(data.observatoryRecords.filter((record) => record.transitionId === transitionId).map((record) => record.id));
  if (recordIds.length === 0 || recordIds.some((id) => !visibleIds.has(id))) throw new Error('A review note can only refer to visible records from one transition.');
  const note: ReviewNote = { id: `review-${crypto.randomUUID()}`, transitionId, recordIds, text: cleanText, createdAtLocal: new Date().toISOString() };
  return { ...data, reviewNotes: [...data.reviewNotes, note] };
}

export function exportObservatory(data: AppData): string {
  const visible = {
    version: OBSERVATORY_VERSION,
    exportedAtLocal: new Date().toISOString(),
    records: data.observatoryRecords,
    savedCues: data.savedCues,
    personalRoutes: data.personalRoutes,
    reviewNotes: data.reviewNotes,
    privateNotes: data.privateNotes,
  };
  return JSON.stringify(visible, null, 2);
}

export function assertObservatoryIntegrity(data: AppData): void {
  const recordIds = new Set(data.observatoryRecords.map((record) => record.id));
  const cueIds = new Set(data.savedCues.map((cue) => cue.id));
  if (recordIds.size !== data.observatoryRecords.length || cueIds.size !== data.savedCues.length) throw new Error('Observatory identifiers must be unique.');
  for (const cue of data.savedCues) if (!recordIds.has(cue.originRecordId)) throw new Error('Every cue requires a visible source record.');
  for (const route of data.personalRoutes) if (route.cueIds.some((cueId) => !cueIds.has(cueId))) throw new Error('Every personal route requires visible cues.');
  for (const note of data.reviewNotes) if (note.recordIds.some((recordId) => !recordIds.has(recordId))) throw new Error('Every review note requires visible source records.');
  for (const note of data.privateNotes) if (note.linkedRecordId && !recordIds.has(note.linkedRecordId)) throw new Error('Every private note requires a visible source record.');
}
