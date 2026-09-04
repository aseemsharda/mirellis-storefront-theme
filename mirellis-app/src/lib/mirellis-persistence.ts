import type { SupabaseClient } from '@supabase/supabase-js';

export type MirellisEventType = 'concern_selected' | 'protocol_started' | 'protocol_result_recorded' | 'tradeoff_selected';

export async function ensureMirellisProfile(client: SupabaseClient, userId: string) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const { error } = await client.from('mirellis_profiles').upsert({ user_id: userId, timezone }, { onConflict: 'user_id' });
  if (error) throw error;
}

export async function saveActiveConcern(client: SupabaseClient, userId: string, concernKey: string, concernFamily: string) {
  const { error } = await client.from('mirellis_active_routes').upsert({
    user_id: userId,
    concern_key: concernKey,
    concern_family: concernFamily,
    last_seen_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
  if (error) throw error;
}

export async function recordMirellisEvent(client: SupabaseClient, userId: string, eventType: MirellisEventType, eventData: Record<string, string>) {
  const { error } = await client.from('mirellis_journey_events').insert({
    user_id: userId,
    event_type: eventType,
    event_data: eventData,
  });
  if (error) throw error;
}
