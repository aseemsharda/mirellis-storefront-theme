create table public.mirellis_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mirellis_active_routes (
  user_id uuid primary key references auth.users (id) on delete cascade,
  concern_key text not null check (concern_key in ('waking', 'focus', 'stress', 'restoration', 'sleep')),
  concern_family text not null check (concern_family in ('Waking', 'Focus', 'Stress', 'Restoration', 'Sleep')),
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mirellis_journey_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  event_type text not null check (event_type in ('concern_selected', 'protocol_started', 'protocol_result_recorded', 'tradeoff_selected')),
  event_data jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create table public.mirellis_commitments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  commitment_type text not null check (commitment_type in ('focus_start', 'work_close', 'interruption_boundary', 'recovery_block')),
  planned_for timestamptz not null,
  status text not null default 'planned' check (status in ('planned', 'completed', 'moved', 'missed')),
  completed_at timestamptz,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index mirellis_journey_events_user_occurred_at_idx on public.mirellis_journey_events (user_id, occurred_at desc);
create index mirellis_commitments_user_planned_for_idx on public.mirellis_commitments (user_id, planned_for desc);

create function public.mirellis_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger mirellis_profiles_set_updated_at before update on public.mirellis_profiles for each row execute function public.mirellis_set_updated_at();
create trigger mirellis_active_routes_set_updated_at before update on public.mirellis_active_routes for each row execute function public.mirellis_set_updated_at();
create trigger mirellis_commitments_set_updated_at before update on public.mirellis_commitments for each row execute function public.mirellis_set_updated_at();

alter table public.mirellis_profiles enable row level security;
alter table public.mirellis_active_routes enable row level security;
alter table public.mirellis_journey_events enable row level security;
alter table public.mirellis_commitments enable row level security;

create policy "users read their Mirellis profile" on public.mirellis_profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy "users create their Mirellis profile" on public.mirellis_profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update their Mirellis profile" on public.mirellis_profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "users read their active route" on public.mirellis_active_routes for select to authenticated using ((select auth.uid()) = user_id);
create policy "users create their active route" on public.mirellis_active_routes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update their active route" on public.mirellis_active_routes for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "users read their Mirellis events" on public.mirellis_journey_events for select to authenticated using ((select auth.uid()) = user_id);
create policy "users create their Mirellis events" on public.mirellis_journey_events for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "users read their Mirellis commitments" on public.mirellis_commitments for select to authenticated using ((select auth.uid()) = user_id);
create policy "users create their Mirellis commitments" on public.mirellis_commitments for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update their Mirellis commitments" on public.mirellis_commitments for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete their Mirellis commitments" on public.mirellis_commitments for delete to authenticated using ((select auth.uid()) = user_id);

grant usage on schema public to authenticated;
grant select, insert, update on public.mirellis_profiles to authenticated;
grant select, insert, update on public.mirellis_active_routes to authenticated;
grant select, insert on public.mirellis_journey_events to authenticated;
grant select, insert, update, delete on public.mirellis_commitments to authenticated;

revoke execute on function public.mirellis_set_updated_at() from public;
