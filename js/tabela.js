const supabase = window.supabaseClient;

async function carregarTabela() {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      id,
      round,
      match_number,
      status,
      team_a:team_a_id (nome_equipe),
      team_b:team_b_id (nome_equipe)
    `)
    .order('round');

  if (error) {
    console.error("Erro:", error);
    return;
  }

  const tabela = document.getElementById('tabela');

  tabela.innerHTML = data.map(match => `
    <div class="match">
      <h3>Rodada ${match.round} - Jogo ${match.match_number}</h3>

      <p>
        ${match.team_a?.nome_equipe || 'BYE'} 
        vs 
        ${match.team_b?.nome_equipe || 'BYE'}
      </p>

      <p>Status: ${match.status}</p>

      ${
        match.status !== 'ended'
          ? `
        <button onclick="definirVencedor(${match.id}, 'A')">Time A venceu</button>
        <button onclick="definirVencedor(${match.id}, 'B')">Time B venceu</button>
      `
          : `<strong>Finalizado</strong>`
      }
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', carregarTabela);