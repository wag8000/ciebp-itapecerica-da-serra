create table teams (

  id bigint generated always as identity primary key,

  nome text not null,

  grupo text,

  logo text,

  created_at timestamp default now()
);