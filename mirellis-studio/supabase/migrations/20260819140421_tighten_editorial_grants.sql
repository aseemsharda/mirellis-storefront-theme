-- Hosted projects may still carry broad default Data API grants. Replace them
-- with the Studio's explicit least-privilege contract.

revoke all privileges on table
  public.studio_profiles,
  public.studio_submissions,
  public.studio_sources,
  public.studio_disclosures,
  public.editorial_reviews,
  public.editorial_decisions,
  public.studio_audit_events
from anon, authenticated;

revoke all privileges on sequence public.studio_audit_events_id_seq
from anon, authenticated;

revoke execute on function public.create_studio_submission(jsonb)
from anon, authenticated;
revoke execute on function public.update_studio_submission(uuid, jsonb)
from anon, authenticated;

grant select on public.studio_profiles to authenticated;
grant update (display_name) on public.studio_profiles to authenticated;

grant select, insert, update on public.studio_submissions to authenticated;
grant select, insert, update, delete on public.studio_sources to authenticated;
grant select, insert, update on public.studio_disclosures to authenticated;
grant select, insert, update on public.editorial_reviews to authenticated;

grant select (
  id, submission_id, decision, public_reason, next_steps, created_at
) on public.editorial_decisions to authenticated;
grant insert on public.editorial_decisions to authenticated;

grant select (
  id, submission_id, event_type, from_status, to_status, detail, created_at
) on public.studio_audit_events to authenticated;
grant usage, select on sequence public.studio_audit_events_id_seq to authenticated;

grant execute on function public.create_studio_submission(jsonb) to authenticated;
grant execute on function public.update_studio_submission(uuid, jsonb) to authenticated;
