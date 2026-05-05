-- =====================================
-- RLS
-- =====================================
alter table teams enable row level security;
alter table matches enable row level security;

-- LEITURA PÚBLICA
create policy "teams_select"
on teams for select
using (true);

create policy "matches_select"
on matches for select
using (true);

-- EDIÇÃO (usuário autenticado)
create policy "teams_all"
on teams for all
to authenticated
using (true)
with check (true);

create policy "matches_all"
on matches for all
to authenticated
using (true)
with check (true);