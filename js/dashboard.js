const supabase = window.supabaseClient;

async function loadDashboard() {

  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      team_a:team_a_id(nome_equipe),
      team_b:team_b_id(nome_equipe),
      winner:winner_id(nome_equipe)
    `);

  const stats = {};

  matches.forEach(m => {
    const a = m.team_a?.nome_equipe;
    const b = m.team_b?.nome_equipe;
    const w = m.winner?.nome_equipe;

    if (!a || !b) return;

    [a, b].forEach(t => {
      if (!stats[t]) stats[t] = { wins: 0, games: 0 };
      stats[t].games++;
    });

    if (w) stats[w].wins++;
  });

  const ranking = Object.entries(stats)
    .map(([team, s]) => ({
      team,
      ...s
    }))
    .sort((a, b) => b.wins - a.wins);

  const list = document.getElementById("ranking-list");

  list.innerHTML = ranking.map((t, i) => `
    <li>${i+1}º ${t.team} - ${t.wins} vitórias</li>
  `).join('');
}

loadDashboard();