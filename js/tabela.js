// tabela.js

async function carregarTabela() {
  const { data, error } = await supabaseClient
    .from('matches')
    .select(`
      id,
      round,
      match_number,
      status,
      team_a:team_a_id (nome),
      team_b:team_b_id (nome)
    `)
    .order('round', { ascending: true });

  if (error) {
    console.error("❌ Erro ao carregar:", error.message);
    return;
  }

  const tabela = document.getElementById('tabela');

  tabela.innerHTML = data.map(match => `
    <div class="match">
      <h3>Rodada ${match.round} - Jogo ${match.match_number}</h3>

      <p>
        ${match.team_a?.nome || 'BYE'} 
        vs 
        ${match.team_b?.nome || 'BYE'}
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