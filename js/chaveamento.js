const supabase = window.supabaseClient;

let jogos = [];

async function carregarChaveamento() {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      team_a:team_a_id (nome_equipe),
      team_b:team_b_id (nome_equipe)
    `)
    .order('round');

  if (error) return console.error(error);

  jogos = data;
  renderizar();
}

function renderizar() {
  const container = document.getElementById('bracket-ui');
  container.innerHTML = '';

  jogos.forEach(j => {
    container.innerHTML += `
      <div class="match">
        <h3>Rodada ${j.round}</h3>

        <button onclick="avancar(${j.id}, ${j.team_a_id})">
          ${j.team_a?.nome_equipe || 'A definir'}
        </button>

        <button onclick="avancar(${j.id}, ${j.team_b_id})">
          ${j.team_b?.nome_equipe || 'A definir'}
        </button>
      </div>
    `;
  });
}

window.avancar = async (jogoId, equipeId) => {
  if (!equipeId) return;

  const jogo = jogos.find(j => j.id === jogoId);

  await supabase
    .from('matches')
    .update({ winner_id: equipeId, status: 'ended' })
    .eq('id', jogoId);

  if (jogo.next_match_id) {
    const { data: next } = await supabase
      .from('matches')
      .select('*')
      .eq('id', jogo.next_match_id)
      .single();

    const campo = next.team_a_id === null ? 'team_a_id' : 'team_b_id';

    await supabase
      .from('matches')
      .update({ [campo]: equipeId })
      .eq('id', jogo.next_match_id);
  }

  carregarChaveamento();
};

carregarChaveamento();