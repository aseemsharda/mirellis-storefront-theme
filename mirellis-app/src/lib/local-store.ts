import { initialData, type AppData } from './types';

const DATABASE = 'mirellis-transition-v1';
const STORE = 'application-state';
const KEY = 'local';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadData(): Promise<AppData> {
  try {
    const database = await openDatabase();
    const result = await new Promise<AppData | undefined>((resolve, reject) => {
      const request = database.transaction(STORE, 'readonly').objectStore(STORE).get(KEY);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    database.close();
    return {
      ...initialData,
      ...result,
      schemaVersion: 6,
      completed: result?.completed ?? {},
      routes: result?.routes ?? {},
      evidence: result?.evidence ?? [],
      selfGuidedReflections: result?.selfGuidedReflections ?? {},
      researchOptIn: result?.researchOptIn ?? false,
      savedCues: result?.savedCues ?? [],
      personalRoutes: result?.personalRoutes ?? [],
      reviewNotes: result?.reviewNotes ?? [],
      privateNotes: result?.privateNotes ?? (result?.observatoryRecords ?? []).flatMap((record) => {
        const legacy = record as typeof record & { reflectionText?: string };
        return legacy.reflectionText?.trim() ? [{ id: `note-migrated-${record.id}`, linkedRecordId: record.id, createdAtLocal: record.occurredAtLocal, text: legacy.reflectionText.trim(), source: 'local' as const }] : [];
      }),
      observatoryRecords: (result?.observatoryRecords ?? []).map((record) => {
        const { reflectionText: _legacyReflectionText, ...structuredRecord } = record as typeof record & { reflectionText?: string };
        return structuredRecord;
      }),
      reducedMotion: result?.reducedMotion ?? false,
    };
  } catch {
    return initialData;
  }
}

export async function saveData(data: AppData): Promise<void> {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const request = database.transaction(STORE, 'readwrite').objectStore(STORE).put(data, KEY);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  database.close();
}

export async function deleteData(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DATABASE);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}
