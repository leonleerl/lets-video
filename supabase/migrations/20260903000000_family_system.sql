-- Phase 2: profiles, families, memberships, invitations, RLS helpers
-- Idempotent: safe to re-run if some objects already exist.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Legacy cleanup
-- Old FastAPI / early tables may use varchar ids. Rename them so the new
-- UUID schema can be created cleanly. Data is preserved under *_legacy_*.
-- ---------------------------------------------------------------------------

do $$
declare
  col_type text;
begin
  -- profiles.id must be uuid referencing auth.users
  if to_regclass('public.profiles') is not null then
    select data_type into col_type
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'id';

    if col_type is distinct from 'uuid' then
      execute 'alter table public.profiles rename to profiles_legacy_varchar';
    end if;
  end if;

  -- families.id must be uuid
  if to_regclass('public.families') is not null then
    select data_type into col_type
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'families'
      and column_name = 'id';

    if col_type is distinct from 'uuid' then
      execute 'alter table public.families rename to families_legacy_varchar';
    end if;
  end if;

  -- family_members.family_id must be uuid
  if to_regclass('public.family_members') is not null then
    select data_type into col_type
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'family_members'
      and column_name = 'family_id';

    if col_type is distinct from 'uuid' then
      execute 'alter table public.family_members rename to family_members_legacy_varchar';
    end if;
  end if;

  -- family_invitations.family_id must be uuid
  if to_regclass('public.family_invitations') is not null then
    select data_type into col_type
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'family_invitations'
      and column_name = 'family_id';

    if col_type is distinct from 'uuid' then
      execute 'alter table public.family_invitations rename to family_invitations_legacy_varchar';
    end if;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists display_name text,
  add column if not exists email text,
  add column if not exists avatar_url text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists profiles_email_lower_idx
  on public.profiles (lower(email))
  where email is not null;

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member', 'viewer')),
  created_at timestamptz not null default now(),
  unique (family_id, user_id)
);

create table if not exists public.family_invitations (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin', 'member', 'viewer')),
  invited_by uuid not null references public.profiles (id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(32), 'hex'),
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'expired', 'cancelled')),
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists family_invitations_pending_unique
  on public.family_invitations (family_id, lower(email))
  where status = 'pending';

create index if not exists family_members_user_id_idx on public.family_members (user_id);
create index if not exists family_members_family_id_idx on public.family_members (family_id);
create index if not exists family_invitations_token_idx on public.family_invitations (token);
create index if not exists families_owner_id_idx on public.families (owner_id);

-- ---------------------------------------------------------------------------
-- Profile bootstrap
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      split_part(new.email, '@', 1)
    ),
    new.email
  )
  on conflict (id) do update
  set
    email = excluded.email,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.profiles (id, display_name, email)
select
  id,
  coalesce(raw_user_meta_data ->> 'display_name', split_part(email, '@', 1)),
  email
from auth.users
on conflict (id) do update
set
  email = excluded.email,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Authorization helpers (security definer to avoid RLS recursion)
-- ---------------------------------------------------------------------------

create or replace function public.is_family_member(target_family_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.family_members
    where family_id = target_family_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.family_member_role(target_family_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.family_members
  where family_id = target_family_id
    and user_id = auth.uid()
  limit 1;
$$;

create or replace function public.can_manage_family(target_family_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.family_members
    where family_id = target_family_id
      and user_id = auth.uid()
      and role in ('owner', 'admin')
  );
$$;

revoke all on function public.is_family_member(uuid) from public;
revoke all on function public.family_member_role(uuid) from public;
revoke all on function public.can_manage_family(uuid) from public;
grant execute on function public.is_family_member(uuid) to authenticated;
grant execute on function public.family_member_role(uuid) to authenticated;
grant execute on function public.can_manage_family(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Business functions
-- ---------------------------------------------------------------------------

create or replace function public.create_family(family_name text)
returns public.families
language plpgsql
security definer
set search_path = public
as $$
declare
  new_family public.families;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if family_name is null or length(trim(family_name)) = 0 then
    raise exception 'Family name is required';
  end if;

  insert into public.families (name, owner_id)
  values (trim(family_name), auth.uid())
  returning * into new_family;

  insert into public.family_members (family_id, user_id, role)
  values (new_family.id, auth.uid(), 'owner');

  return new_family;
end;
$$;

create or replace function public.accept_family_invitation(invite_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  inv public.family_invitations;
  uid uuid := auth.uid();
  user_email text;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  select email into user_email from auth.users where id = uid;

  select *
  into inv
  from public.family_invitations
  where token = invite_token
  for update;

  if not found then
    raise exception 'Invitation not found';
  end if;

  if inv.status = 'cancelled' then
    raise exception 'Invitation was cancelled';
  end if;

  if inv.status = 'accepted' then
    return inv.family_id;
  end if;

  if inv.status <> 'pending' then
    raise exception 'Invitation is no longer valid';
  end if;

  if inv.expires_at < now() then
    update public.family_invitations
    set status = 'expired', updated_at = now()
    where id = inv.id;
    raise exception 'Invitation expired';
  end if;

  if lower(inv.email) <> lower(user_email) then
    raise exception 'This invitation was sent to a different email address';
  end if;

  insert into public.family_members (family_id, user_id, role)
  values (inv.family_id, uid, inv.role)
  on conflict (family_id, user_id) do nothing;

  update public.family_invitations
  set status = 'accepted', updated_at = now()
  where id = inv.id;

  return inv.family_id;
end;
$$;

revoke all on function public.create_family(text) from public;
revoke all on function public.accept_family_invitation(text) from public;
grant execute on function public.create_family(text) to authenticated;
grant execute on function public.accept_family_invitation(text) to authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.family_invitations enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Members can read profiles in shared families" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Members can read their families" on public.families;
drop policy if exists "Owners and admins can update family" on public.families;
drop policy if exists "Members can read family membership" on public.family_members;
drop policy if exists "Owners and admins can remove non-owner members" on public.family_members;
drop policy if exists "Members can read family invitations" on public.family_invitations;
drop policy if exists "Owners and admins can create invitations" on public.family_invitations;
drop policy if exists "Owners and admins can update invitations" on public.family_invitations;

create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "Members can read profiles in shared families"
  on public.profiles for select
  to authenticated
  using (
    exists (
      select 1
      from public.family_members self_membership
      join public.family_members other_membership
        on self_membership.family_id = other_membership.family_id
      where self_membership.user_id = auth.uid()
        and other_membership.user_id = profiles.id
    )
  );

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Members can read their families"
  on public.families for select
  to authenticated
  using (public.is_family_member(id));

create policy "Owners and admins can update family"
  on public.families for update
  to authenticated
  using (public.can_manage_family(id))
  with check (public.can_manage_family(id));

create policy "Members can read family membership"
  on public.family_members for select
  to authenticated
  using (public.is_family_member(family_id));

create policy "Owners and admins can remove non-owner members"
  on public.family_members for delete
  to authenticated
  using (
    public.can_manage_family(family_id)
    and role <> 'owner'
    and user_id <> auth.uid()
  );

create policy "Members can read family invitations"
  on public.family_invitations for select
  to authenticated
  using (
    public.is_family_member(family_id)
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

create policy "Owners and admins can create invitations"
  on public.family_invitations for insert
  to authenticated
  with check (
    public.can_manage_family(family_id)
    and invited_by = auth.uid()
  );

create policy "Owners and admins can update invitations"
  on public.family_invitations for update
  to authenticated
  using (public.can_manage_family(family_id))
  with check (public.can_manage_family(family_id));
