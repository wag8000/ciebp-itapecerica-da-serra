create or replace function gerar_chaveamento()
returns void
language plpgsql
as $$
declare
    team_ids bigint[];
    total int;
    size int := 1;
    round_num int := 1;

    current_matches bigint[] := '{}';
    next_matches bigint[];

    i int;
    new_match_id bigint;
begin
    -- pegar times
    select array_agg(id order by id) into team_ids from teams;

    if team_ids is null then
        raise exception 'Nenhum time cadastrado';
    end if;

    total := array_length(team_ids, 1);

    -- calcular potência de 2
    while size < total loop
        size := size * 2;
    end loop;

    -- limpar partidas
    delete from matches;

    -- completar com BYE
    while array_length(team_ids, 1) < size loop
        team_ids := array_append(team_ids, null);
    end loop;

    -- PRIMEIRA RODADA
    for i in 1..size by 2 loop
        insert into matches (
            round,
            match_number,
            team_a_id,
            team_b_id,
            winner_id
        )
        values (
            1,
            (i+1)/2,
            team_ids[i],
            team_ids[i+1],
            case
                when team_ids[i] is not null and team_ids[i+1] is null then team_ids[i]
                when team_ids[i] is null and team_ids[i+1] is not null then team_ids[i+1]
                else null
            end
        )
        returning id into new_match_id;

        current_matches := array_append(current_matches, new_match_id);
    end loop;

    -- PRÓXIMAS RODADAS
    while size > 1 loop
        size := size / 2;
        round_num := round_num + 1;
        next_matches := '{}';

        for i in 1..size loop
            insert into matches (round, match_number)
            values (round_num, i)
            returning id into new_match_id;

            next_matches := array_append(next_matches, new_match_id);
        end loop;

        for i in 1..array_length(current_matches, 1) loop
            update matches
            set next_match_id = next_matches[ceil(i/2.0)]
            where id = current_matches[i];
        end loop;

        current_matches := next_matches;
    end loop;

end;
$$;

grant execute on function gerar_chaveamento() to authenticated;