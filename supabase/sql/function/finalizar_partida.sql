create or replace function finalizar_partida(

  partida_id bigint,

  gols_time_a integer,

  gols_time_b integer

)

returns void

language plpgsql

as $$

begin

  update matches

  set
    gols_a = gols_time_a,
    gols_b = gols_time_b,
    encerrada = true

  where id = partida_id;

end;

$$;