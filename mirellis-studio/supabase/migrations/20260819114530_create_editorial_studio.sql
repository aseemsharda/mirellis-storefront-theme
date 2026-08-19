-- Mirellis Studio — invited contributor and editor workflow.
-- No table in this migration is readable by anon, and acceptance does not publish.

create schema if not exists private;

create type public.studio_role as enum ('contributor', 'editor', 'admin');
create type public.submission_format as enum ('evidence_note', 'expert_commentary');
create type public.studio_territory as enum ('sleep', 'focus', 'restoration', 'human_state_transition');
create type public.submission_status as enum (
  'draft',
  'submitted',
  'in_review',
  'revision_requested',
  'hold',
  'accepted',
  'declined',
  'withdrawn'
);
create type public.editorial_decision_kind as enum ('revision_requested', 'hold', 'accepted', 'declined');

create table public.studio_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 120),
  role public.studio_role not null default 'contributor',
  invited_by uuid references auth.users(id),
  invited_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.studio_submissions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.studio_profiles(user_id),
  format public.submission_format not null,
  territory public.studio_territory not null,
  title text not null check (char_length(title) between 8 and 180),
  bounded_statement text not null check (char_length(bounded_statement) between 40 and 1200),
  contribution_text text not null check (char_length(contribution_text) between 120 and 20000),
  evidence_basis text not null check (char_length(evidence_basis) between 40 and 4000),
  limitations text not null check (char_length(limitations) between 40 and 3000),
  contributor_credit text not null check (char_length(contributor_credit) between 2 and 180),
  contribution_roles text[] not null default '{}',
  status public.submission_status not null default 'draft',
  revision integer not null default 1 check (revision > 0),
  submitted_at timestamptz,
  decided_at timestamptz,
  withdrawn_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.studio_sources (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.studio_submissions(id) on delete cascade,
  citation text not null check (char_length(citation) between 8 and 1200),
  url text not null check (url ~ '^https://'),
  supports text not null check (char_length(supports) between 20 and 1200),
  does_not_support text not null check (char_length(does_not_support) between 20 and 1200),
  position integer not null default 1 check (position between 1 and 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (submission_id, position)
);

create table public.studio_disclosures (
  submission_id uuid primary key references public.studio_submissions(id) on delete cascade,
  funding text not null check (char_length(funding) between 2 and 2000),
  interests text not null check (char_length(interests) between 2 and 2000),
  ai_assistance text not null check (char_length(ai_assistance) between 2 and 2000),
  confidential_ai_permission boolean not null default false,
  human_accountability_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.editorial_reviews (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.studio_submissions(id) on delete cascade,
  reviewer_id uuid not null references public.studio_profiles(user_id),
  checklist jsonb not null default '{}',
  private_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (submission_id, reviewer_id)
);

create table public.editorial_decisions (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.studio_submissions(id) on delete cascade,
  editor_id uuid not null references public.studio_profiles(user_id),
  decision public.editorial_decision_kind not null,
  public_reason text not null check (char_length(public_reason) between 20 and 3000),
  next_steps text not null check (char_length(next_steps) between 10 and 3000),
  created_at timestamptz not null default now()
);

create table public.studio_audit_events (
  id bigint generated always as identity primary key,
  submission_id uuid not null references public.studio_submissions(id) on delete cascade,
  actor_id uuid references auth.users(id),
  event_type text not null,
  from_status public.submission_status,
  to_status public.submission_status,
  detail jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index studio_submissions_owner_updated_idx
  on public.studio_submissions (owner_id, updated_at desc);
create index studio_submissions_review_queue_idx
  on public.studio_submissions (status, submitted_at asc)
  where status in ('submitted', 'in_review', 'revision_requested', 'hold');
create index studio_sources_submission_idx on public.studio_sources (submission_id, position);
create index editorial_reviews_submission_idx on public.editorial_reviews (submission_id);
create index editorial_decisions_submission_idx on public.editorial_decisions (submission_id, created_at desc);
create index studio_audit_submission_idx on public.studio_audit_events (submission_id, created_at desc);

create or replace function private.current_studio_role()
returns public.studio_role
language sql
stable
security definer
set search_path = ''
as $$
  select role
  from public.studio_profiles
  where user_id = (select auth.uid())
$$;

create or replace function private.is_studio_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(private.current_studio_role() in ('editor', 'admin'), false)
$$;

create or replace function private.contributor_can_edit(target_submission_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.studio_submissions
    where id = target_submission_id
      and owner_id = (select auth.uid())
      and status in ('draft', 'revision_requested')
  )
$$;

revoke all on function private.current_studio_role() from public;
revoke all on function private.is_studio_editor() from public;
revoke all on function private.contributor_can_edit(uuid) from public;
grant usage on schema private to authenticated;
grant execute on function private.current_studio_role() to authenticated;
grant execute on function private.is_studio_editor() to authenticated;
grant execute on function private.contributor_can_edit(uuid) to authenticated;

create or replace function private.guard_studio_profile_update()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.user_id <> old.user_id or new.role <> old.role or new.invited_by is distinct from old.invited_by then
    raise exception 'Studio identity and role cannot be changed through this action';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger guard_studio_profile_update
before update on public.studio_profiles
for each row execute function private.guard_studio_profile_update();

revoke all on function private.guard_studio_profile_update() from public;

create or replace function private.guard_submission_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_role public.studio_role;
  old_content jsonb;
  new_content jsonb;
begin
  actor_role := private.current_studio_role();
  if actor_role is null then
    raise exception 'Studio access is not provisioned';
  end if;
  if new.owner_id <> old.owner_id then
    raise exception 'Submission ownership cannot be changed';
  end if;

  old_content := to_jsonb(old) - array['status', 'submitted_at', 'decided_at', 'withdrawn_at', 'updated_at'];
  new_content := to_jsonb(new) - array['status', 'submitted_at', 'decided_at', 'withdrawn_at', 'updated_at'];

  if actor_role = 'contributor' then
    if old.owner_id <> (select auth.uid()) then
      raise exception 'Contributors can update only their own submission';
    end if;
    if old.status not in ('draft', 'revision_requested') and old_content is distinct from new_content then
      raise exception 'Submitted content cannot be edited until revision is requested';
    end if;
    if old.status <> new.status and not (
      (old.status in ('draft', 'revision_requested') and new.status = 'submitted') or
      (old.status in ('draft', 'submitted', 'revision_requested') and new.status = 'withdrawn')
    ) then
      raise exception 'Contributor status transition is not allowed';
    end if;
  else
    if old_content is distinct from new_content then
      raise exception 'Editors decide status; they do not overwrite contributor text';
    end if;
    if old.status <> new.status and not (
      (old.status = 'submitted' and new.status = 'in_review') or
      (old.status in ('submitted', 'in_review', 'hold') and new.status in ('revision_requested', 'hold', 'accepted', 'declined'))
    ) then
      raise exception 'Editorial status transition is not allowed';
    end if;
  end if;

  if old.status in ('revision_requested') and new.status = 'submitted' then
    new.revision := old.revision + 1;
  end if;
  if new.status = 'submitted' and old.status <> new.status then new.submitted_at := now(); end if;
  if new.status in ('accepted', 'declined') and old.status <> new.status then new.decided_at := now(); end if;
  if new.status = 'withdrawn' and old.status <> new.status then new.withdrawn_at := now(); end if;
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function private.guard_submission_update() from public;

create trigger guard_submission_update
before update on public.studio_submissions
for each row execute function private.guard_submission_update();

create or replace function private.audit_submission_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.studio_audit_events (
    submission_id, actor_id, event_type, from_status, to_status, detail
  ) values (
    new.id,
    (select auth.uid()),
    case when tg_op = 'INSERT' then 'submission_created' else 'status_changed' end,
    case when tg_op = 'UPDATE' then old.status else null end,
    new.status,
    jsonb_build_object('revision', new.revision)
  );
  return new;
end;
$$;

revoke all on function private.audit_submission_change() from public;

create trigger audit_submission_insert
after insert on public.studio_submissions
for each row execute function private.audit_submission_change();

create trigger audit_submission_status
after update of status on public.studio_submissions
for each row when (old.status is distinct from new.status)
execute function private.audit_submission_change();

alter table public.studio_profiles enable row level security;
alter table public.studio_submissions enable row level security;
alter table public.studio_sources enable row level security;
alter table public.studio_disclosures enable row level security;
alter table public.editorial_reviews enable row level security;
alter table public.editorial_decisions enable row level security;
alter table public.studio_audit_events enable row level security;

create policy "profiles read own or editorial"
on public.studio_profiles for select to authenticated
using ((select auth.uid()) = user_id or private.is_studio_editor());

create policy "profiles update own display name"
on public.studio_profiles for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "submissions read own or editorial"
on public.studio_submissions for select to authenticated
using ((select auth.uid()) = owner_id or private.is_studio_editor());

create policy "contributors create own submissions"
on public.studio_submissions for insert to authenticated
with check (
  (select auth.uid()) = owner_id
  and private.current_studio_role() = 'contributor'
  and status = 'draft'
);

create policy "contributors update own working submissions"
on public.studio_submissions for update to authenticated
using (
  (select auth.uid()) = owner_id
  and private.current_studio_role() = 'contributor'
  and status in ('draft', 'submitted', 'revision_requested')
)
with check ((select auth.uid()) = owner_id);

create policy "editors update submission status"
on public.studio_submissions for update to authenticated
using (private.is_studio_editor())
with check (private.is_studio_editor());

create policy "sources read with submission"
on public.studio_sources for select to authenticated
using (
  exists (
    select 1 from public.studio_submissions s
    where s.id = submission_id
      and (s.owner_id = (select auth.uid()) or private.is_studio_editor())
  )
);

create policy "contributors create sources while editable"
on public.studio_sources for insert to authenticated
with check (private.contributor_can_edit(submission_id));

create policy "contributors update sources while editable"
on public.studio_sources for update to authenticated
using (private.contributor_can_edit(submission_id))
with check (private.contributor_can_edit(submission_id));

create policy "contributors delete sources while editable"
on public.studio_sources for delete to authenticated
using (private.contributor_can_edit(submission_id));

create policy "disclosures read with submission"
on public.studio_disclosures for select to authenticated
using (
  exists (
    select 1 from public.studio_submissions s
    where s.id = submission_id
      and (s.owner_id = (select auth.uid()) or private.is_studio_editor())
  )
);

create policy "contributors create disclosures while editable"
on public.studio_disclosures for insert to authenticated
with check (private.contributor_can_edit(submission_id));

create policy "contributors update disclosures while editable"
on public.studio_disclosures for update to authenticated
using (private.contributor_can_edit(submission_id))
with check (private.contributor_can_edit(submission_id));

create policy "private reviews are editorial only"
on public.editorial_reviews for select to authenticated
using (private.is_studio_editor());

create policy "editors create private reviews"
on public.editorial_reviews for insert to authenticated
with check (private.is_studio_editor() and reviewer_id = (select auth.uid()));

create policy "editors update own private reviews"
on public.editorial_reviews for update to authenticated
using (private.is_studio_editor() and reviewer_id = (select auth.uid()))
with check (private.is_studio_editor() and reviewer_id = (select auth.uid()));

create policy "decisions read by owner or editorial"
on public.editorial_decisions for select to authenticated
using (
  private.is_studio_editor()
  or exists (
    select 1 from public.studio_submissions s
    where s.id = submission_id and s.owner_id = (select auth.uid())
  )
);

create policy "editors create decisions"
on public.editorial_decisions for insert to authenticated
with check (private.is_studio_editor() and editor_id = (select auth.uid()));

create or replace function private.apply_editorial_decision()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_studio_editor() or new.editor_id <> (select auth.uid()) then
    raise exception 'Only a provisioned editor can record a decision';
  end if;

  update public.studio_submissions
  set status = new.decision::text::public.submission_status
  where id = new.submission_id;

  if not found then
    raise exception 'Submission not found';
  end if;
  return new;
end;
$$;

revoke all on function private.apply_editorial_decision() from public;

create trigger apply_editorial_decision
after insert on public.editorial_decisions
for each row execute function private.apply_editorial_decision();

create policy "audit read by owner or editorial"
on public.studio_audit_events for select to authenticated
using (
  private.is_studio_editor()
  or exists (
    select 1 from public.studio_submissions s
    where s.id = submission_id and s.owner_id = (select auth.uid())
  )
);

grant select on public.studio_profiles to authenticated;
grant update (display_name) on public.studio_profiles to authenticated;
grant select, insert, update on public.studio_submissions to authenticated;
grant select, insert, update, delete on public.studio_sources to authenticated;
grant select, insert, update on public.studio_disclosures to authenticated;
grant select, insert, update on public.editorial_reviews to authenticated;
grant select (id, submission_id, decision, public_reason, next_steps, created_at), insert on public.editorial_decisions to authenticated;
grant select (id, submission_id, event_type, from_status, to_status, detail, created_at) on public.studio_audit_events to authenticated;
grant usage, select on sequence public.studio_audit_events_id_seq to authenticated;

create or replace function public.create_studio_submission(payload jsonb)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  new_id uuid;
  source_item jsonb;
begin
  if private.current_studio_role() <> 'contributor' then
    raise exception 'Only a provisioned contributor can create a submission';
  end if;

  insert into public.studio_submissions (
    owner_id, format, territory, title, bounded_statement, contribution_text,
    evidence_basis, limitations, contributor_credit, contribution_roles
  ) values (
    (select auth.uid()),
    (payload->'submission'->>'format')::public.submission_format,
    (payload->'submission'->>'territory')::public.studio_territory,
    payload->'submission'->>'title',
    payload->'submission'->>'bounded_statement',
    payload->'submission'->>'contribution_text',
    payload->'submission'->>'evidence_basis',
    payload->'submission'->>'limitations',
    payload->'submission'->>'contributor_credit',
    array(select jsonb_array_elements_text(payload->'submission'->'contribution_roles'))
  ) returning id into new_id;

  insert into public.studio_disclosures (
    submission_id, funding, interests, ai_assistance,
    confidential_ai_permission, human_accountability_confirmed
  ) values (
    new_id,
    payload->'disclosure'->>'funding',
    payload->'disclosure'->>'interests',
    payload->'disclosure'->>'ai_assistance',
    coalesce((payload->'disclosure'->>'confidential_ai_permission')::boolean, false),
    coalesce((payload->'disclosure'->>'human_accountability_confirmed')::boolean, false)
  );

  for source_item in select value from jsonb_array_elements(payload->'sources')
  loop
    insert into public.studio_sources (
      submission_id, citation, url, supports, does_not_support, position
    ) values (
      new_id,
      source_item->>'citation',
      source_item->>'url',
      source_item->>'supports',
      source_item->>'does_not_support',
      (source_item->>'position')::integer
    );
  end loop;

  return new_id;
end;
$$;

create or replace function public.update_studio_submission(target_submission_id uuid, payload jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  source_item jsonb;
begin
  if not private.contributor_can_edit(target_submission_id) then
    raise exception 'This submission is not editable';
  end if;

  update public.studio_submissions
  set
    format = (payload->'submission'->>'format')::public.submission_format,
    territory = (payload->'submission'->>'territory')::public.studio_territory,
    title = payload->'submission'->>'title',
    bounded_statement = payload->'submission'->>'bounded_statement',
    contribution_text = payload->'submission'->>'contribution_text',
    evidence_basis = payload->'submission'->>'evidence_basis',
    limitations = payload->'submission'->>'limitations',
    contributor_credit = payload->'submission'->>'contributor_credit',
    contribution_roles = array(select jsonb_array_elements_text(payload->'submission'->'contribution_roles'))
  where id = target_submission_id;

  insert into public.studio_disclosures (
    submission_id, funding, interests, ai_assistance,
    confidential_ai_permission, human_accountability_confirmed
  ) values (
    target_submission_id,
    payload->'disclosure'->>'funding',
    payload->'disclosure'->>'interests',
    payload->'disclosure'->>'ai_assistance',
    coalesce((payload->'disclosure'->>'confidential_ai_permission')::boolean, false),
    coalesce((payload->'disclosure'->>'human_accountability_confirmed')::boolean, false)
  )
  on conflict (submission_id) do update set
    funding = excluded.funding,
    interests = excluded.interests,
    ai_assistance = excluded.ai_assistance,
    confidential_ai_permission = excluded.confidential_ai_permission,
    human_accountability_confirmed = excluded.human_accountability_confirmed,
    updated_at = now();

  delete from public.studio_sources where submission_id = target_submission_id;
  for source_item in select value from jsonb_array_elements(payload->'sources')
  loop
    insert into public.studio_sources (
      submission_id, citation, url, supports, does_not_support, position
    ) values (
      target_submission_id,
      source_item->>'citation',
      source_item->>'url',
      source_item->>'supports',
      source_item->>'does_not_support',
      (source_item->>'position')::integer
    );
  end loop;
end;
$$;

revoke all on function public.create_studio_submission(jsonb) from public;
revoke all on function public.update_studio_submission(uuid, jsonb) from public;
grant execute on function public.create_studio_submission(jsonb) to authenticated;
grant execute on function public.update_studio_submission(uuid, jsonb) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'studio-submissions',
  'studio-submissions',
  false,
  10485760,
  array['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do nothing;

create policy "contributors upload to own studio prefix"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'studio-submissions'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (storage.foldername(name))[2] ~ '^[0-9a-f-]{36}$'
  and private.contributor_can_edit(((storage.foldername(name))[2])::uuid)
  and private.current_studio_role() = 'contributor'
);

create policy "studio files read by owner or editorial"
on storage.objects for select to authenticated
using (
  bucket_id = 'studio-submissions'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or private.is_studio_editor()
  )
);

create policy "contributors replace own studio files"
on storage.objects for update to authenticated
using (
  bucket_id = 'studio-submissions'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (storage.foldername(name))[2] ~ '^[0-9a-f-]{36}$'
  and private.contributor_can_edit(((storage.foldername(name))[2])::uuid)
  and private.current_studio_role() = 'contributor'
)
with check (
  bucket_id = 'studio-submissions'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (storage.foldername(name))[2] ~ '^[0-9a-f-]{36}$'
  and private.contributor_can_edit(((storage.foldername(name))[2])::uuid)
  and private.current_studio_role() = 'contributor'
);

create policy "contributors remove own studio files"
on storage.objects for delete to authenticated
using (
  bucket_id = 'studio-submissions'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (storage.foldername(name))[2] ~ '^[0-9a-f-]{36}$'
  and private.contributor_can_edit(((storage.foldername(name))[2])::uuid)
  and private.current_studio_role() = 'contributor'
);
