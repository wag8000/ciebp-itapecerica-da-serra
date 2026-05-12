create or replace function gerar_chaveamento()

returns void

language plpgsql

as $$

declare

  time1 bigint;
  time2 bigint;
  time3 bigint;
  time4 bigint;

begin

  select id into time1
  from classificacao_view
  limit 1;

  select id into time2
  from classificacao_view
  offset 1 limit 1;

  select id into time3
  from classificacao_view
  offset 2 limit 1;

  select id into time4
  from classificacao_view
  offset 3 limit 1;

  insert into matches (
    team_a,
    team_b,
    fase
  )

  values
    (time1, time4, 'SEMIFINAL'),
    (time2, time3, 'SEMIFINAL');

end;

$$;