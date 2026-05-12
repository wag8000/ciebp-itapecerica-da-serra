create or replace function gerar_chaveamento()
returns void as $$
declare
    teams text[];
    total int;
    size int := 1;
    round_num int := 1;
    match_id int := 1;
    i int;
begin
    select array_agg(time) into teams from futebol_robos;

    -- 🔥 CORREÇÃO CRÍTICA
    if teams is null then
        raise notice 'Sem times cadastrados';
        return;
    end if;

    total := array_length(teams, 1);

    while size < total loop
        size := size * 2;
    end loop;

    delete from matches;

    while array_length(teams, 1) < size loop
        teams := array_append(teams, 'BYE');
    end loop;

    -- primeira rodada
    for i in 1..size by 2 loop
        insert into matches (round_number, match_number, team_a, team_b)
        values (1, match_id, teams[i], teams[i+1]);

        match_id := match_id + 1;
    end loop;

    -- próximas rodadas
    while size > 1 loop
        size := size / 2;
        round_num := round_num + 1;

        for i in 1..size loop
            insert into matches (round_number, match_number)
            values (round_num, i);
        end loop;
    end loop;

end;
$$ language plpgsql;