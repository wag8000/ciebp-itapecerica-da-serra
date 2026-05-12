create or replace view classificacao_view as

with dados as (

  select

    t.id,

    t.nome,

    count(m.id) as jogos,

    sum(
      case
        when (
          (m.team_a = t.id and m.gols_a > m.gols_b)
          or
          (m.team_b = t.id and m.gols_b > m.gols_a)
        )
        then 1
        else 0
      end
    ) as vitorias,

    sum(
      case
        when m.gols_a = m.gols_b
        then 1
        else 0
      end
    ) as empates,

    sum(
      case
        when (
          (m.team_a = t.id and m.gols_a < m.gols_b)
          or
          (m.team_b = t.id and m.gols_b < m.gols_a)
        )
        then 1
        else 0
      end
    ) as derrotas,

    sum(
      case
        when m.team_a = t.id then m.gols_a
        when m.team_b = t.id then m.gols_b
        else 0
      end
    ) as gols_pro,

    sum(
      case
        when m.team_a = t.id then m.gols_b
        when m.team_b = t.id then m.gols_a
        else 0
      end
    ) as gols_contra

  from teams t

  left join matches m
    on (
      m.team_a = t.id
      or
      m.team_b = t.id
    )

  where m.encerrada = true

  group by t.id, t.nome
)

select *,

  (vitorias * 3 + empates) as pontos,

  (gols_pro - gols_contra) as saldo

from dados

order by pontos desc, saldo desc;