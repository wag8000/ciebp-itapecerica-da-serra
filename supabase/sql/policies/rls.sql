alter table teams
enable row level security;

alter table matches
enable row level security;

create policy "liberar leitura teams"

on teams

for select

using (true);

create policy "liberar leitura matches"

on matches

for select

using (true);