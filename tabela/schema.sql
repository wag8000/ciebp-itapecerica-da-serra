create table if not exists futebol_robos (
  id bigint generated always as identity primary key,
  escola text not null,
  time text not null
);

create table if not exists matches (
  id bigint generated always as identity primary key,
  round_number int,
  match_number int,
  team_a text,
  team_b text,
  winner text,
  parent_match_id bigint,
  slot_in_parent text
);

-- RLS
alter table futebol_robos enable row level security;
alter table matches enable row level security;

-- 🔥 policies completas
create policy "full access futebol_robos"
on futebol_robos
for all
using (true)
with check (true);

create policy "full access matches"
on matches
for all
using (true)
with check (true);