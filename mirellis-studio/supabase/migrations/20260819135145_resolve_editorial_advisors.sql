-- Resolve Phase 5 performance-advisor findings without weakening authorization.

create index editorial_decisions_editor_idx
  on public.editorial_decisions (editor_id);
create index editorial_reviews_reviewer_idx
  on public.editorial_reviews (reviewer_id);
create index studio_audit_actor_idx
  on public.studio_audit_events (actor_id);
create index studio_profiles_invited_by_idx
  on public.studio_profiles (invited_by);

drop policy "contributors update own working submissions"
  on public.studio_submissions;
drop policy "editors update submission status"
  on public.studio_submissions;

create policy "authorized studio submission updates"
on public.studio_submissions for update to authenticated
using (
  private.is_studio_editor()
  or (
    (select auth.uid()) = owner_id
    and private.current_studio_role() = 'contributor'
    and status in ('draft', 'submitted', 'revision_requested')
  )
)
with check (
  private.is_studio_editor()
  or (
    (select auth.uid()) = owner_id
    and private.current_studio_role() = 'contributor'
  )
);
