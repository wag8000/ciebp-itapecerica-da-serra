-- =====================================
-- RESET CONTROLADO
-- =====================================
drop table if exists matches cascade;
drop table if exists teams cascade;

-- =====================================
-- TABELA: TEAMS
-- =====================================
create table teams (
  id bigint generated always as identity primary key,
  escola text not null,
  nome_equipe text not null,
  created_at timestamptz default now(),

  constraint unique_team unique (escola, nome_equipe)
);

-- =====================================
-- ENUM STATUS
-- =====================================
create type match_status as enum ('upcoming','live','ended');

-- =====================================
-- TABELA: MATCHES
-- =====================================
create table matches (
  id bigint generated always as identity primary key,

  round int not null,
  match_number int not null,

  team_a_id bigint,
  team_b_id bigint,

  score_a int default 0,
  score_b int default 0,

  status match_status default 'upcoming',

  winner_id bigint,
  next_match_id bigint,

  created_at timestamptz default now(),

  constraint fk_team_a foreign key (team_a_id)
    references teams(id) on delete set null,

  constraint fk_team_b foreign key (team_b_id)
    references teams(id) on delete set null,

  constraint fk_winner foreign key (winner_id)
    references teams(id) on delete set null,

  constraint fk_next_match foreign key (next_match_id)
    references matches(id) on delete set null
);

-- INDEXES
create index idx_matches_round on matches(round);
create index idx_matches_status on matches(status);