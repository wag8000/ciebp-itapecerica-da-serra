create table matches (

  id bigint generated always as identity primary key,

  team_a bigint references teams(id),

  team_b bigint references teams(id),

  gols_a integer default 0,

  gols_b integer default 0,

  rodada integer,

  fase text,

  encerrada boolean default false,

  created_at timestamp default now()
);