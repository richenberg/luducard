-- 1. Create the community saves table
create table if not exists public.public_saves (
  id uuid default gen_random_uuid() primary key,
  game_name text not null,                   -- Name of the game (e.g. Elden Ring)
  title text not null,                       -- Checkpoint title (e.g. "Before Malenia")
  file_name text not null,                   -- Original filename (e.g. elden-ring.ludocard)
  r2_path text not null,                     -- Path to R2 bucket file (e.g. saves/game_id/uuid.ludocard)
  file_size bigint not null default 0,       -- File size in bytes for global quota check
  description text,                          -- Detailed notes
  author_name text default 'Anônimo',        -- Author display name
  user_uuid uuid not null,                   -- Anonymous UUID for user quota check (max 5)
  downloads_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_downloaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Indexes for high performance searches
create index if not exists idx_public_saves_game_name on public.public_saves(game_name);
create index if not exists idx_public_saves_user_uuid on public.public_saves(user_uuid);

-- 3. Row Level Security (RLS) - Optional but recommended. 
-- For a public-sharing repository we can enable read for everyone, and insert for authenticated/anon.
alter table public.public_saves enable row level security;

create policy "Permitir leitura pública de checkpoints"
  on public.public_saves for select
  using (true);

create policy "Permitir inserção anônima de checkpoints"
  on public.public_saves for insert
  with check (true);

create policy "Permitir deleção apenas do próprio autor"
  on public.public_saves for delete
  using (user_uuid = auth.uid() or user_uuid::text = coalesce(headers()->>'x-client-uuid', ''));

-- 4. RPC to securely increment download count
create or replace function public.increment_downloads(save_id uuid)
returns void as $$
begin
  update public.public_saves
  set downloads_count = downloads_count + 1,
      last_downloaded_at = timezone('utc'::text, now())
  where id = save_id;
end;
$$ language plpgsql security definer;

-- 5. Trigger to enforce user quota (Max 5 saves per user)
create or replace function public.check_user_save_quota()
returns trigger as $$
declare
  user_saves_count integer;
begin
  select count(*) into user_saves_count 
  from public.public_saves 
  where user_uuid = new.user_uuid;

  if user_saves_count >= 5 then
    raise exception 'Você atingiu o limite máximo de 5 checkpoints ativos na nuvem. Delete algum checkpoint antigo para subir um novo.';
  end if;

  return new;
end;
$$ language plpgsql;

create trigger enforce_user_save_quota_trigger
  before insert on public.public_saves
  for each row
  execute function public.check_user_save_quota();

-- 6. Trigger to enforce global storage limit (9.5 GB max limit to prevent R2 abuse)
create or replace function public.check_global_storage_quota()
returns trigger as $$
declare
  total_storage_bytes bigint;
begin
  select coalesce(sum(file_size), 0) into total_storage_bytes 
  from public.public_saves;

  -- 9.5 GB = 10,200,547,328 bytes (R2 Free is 10 GB)
  if total_storage_bytes + new.file_size > 10200547328 then
    raise exception 'O repositório comunitário temporário atingiu seu limite total de armazenamento (10GB R2). Tente novamente mais tarde ou contate o suporte.';
  end if;

  return new;
end;
$$ language plpgsql;

create trigger enforce_global_storage_quota_trigger
  before insert on public.public_saves
  for each row
  execute function public.check_global_storage_quota();
