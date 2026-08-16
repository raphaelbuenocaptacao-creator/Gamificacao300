create extension if not exists pgcrypto;

create table if not exists public.xp_attendance (
  id uuid primary key default gen_random_uuid(),
  person_id text not null,
  person_name text not null,
  role text not null,
  event_date date not null,
  present boolean not null default false,
  punctual boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(person_id, event_date)
);

create table if not exists public.xp_bonuses (
  id uuid primary key default gen_random_uuid(),
  person_id text not null,
  person_name text not null,
  event_date date not null,
  xp integer not null check (xp >= 0),
  reason text not null,
  created_at timestamptz not null default now()
);

alter table public.xp_attendance enable row level security;
alter table public.xp_bonuses enable row level security;

-- Para o primeiro funcionamento interno, estas políticas permitem leitura/escrita
-- com a chave anon. Depois podemos restringir o Admin por autenticação.
drop policy if exists xp_attendance_read on public.xp_attendance;
drop policy if exists xp_attendance_write on public.xp_attendance;
drop policy if exists xp_bonuses_read on public.xp_bonuses;
drop policy if exists xp_bonuses_write on public.xp_bonuses;

create policy xp_attendance_read on public.xp_attendance for select using (true);
create policy xp_attendance_write on public.xp_attendance for all using (true) with check (true);
create policy xp_bonuses_read on public.xp_bonuses for select using (true);
create policy xp_bonuses_write on public.xp_bonuses for all using (true) with check (true);
