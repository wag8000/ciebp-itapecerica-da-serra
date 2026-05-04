const supabase = window.supabaseClient;

let jogos = []

async function carregarChaveamento() {
    const { data, error } = await supabase
        .from('partidas_chaveamento')
        .select(`
            *,
            equipe_a:equipes!equipe_a_id(nome),
            equipe_b:equipes!equipe_b_id(nome)
        `)
        .order('id')

    if (error) return console.error(error)

    jogos = data
    renderizar()
}

function renderizar() {
    const container = document.getElementById('bracket-ui')
    container.innerHTML = ''

    jogos.forEach(j => {
        container.innerHTML += `
            <div>
                <h3>Jogo ${j.id}</h3>
                <button onclick="avancar(${j.id}, ${j.equipe_a_id})">
                    ${j.equipe_a?.nome || 'A definir'}
                </button>
                <button onclick="avancar(${j.id}, ${j.equipe_b_id})">
                    ${j.equipe_b?.nome || 'A definir'}
                </button>
            </div>
        `
    })
}

window.avancar = async (jogoId, equipeId) => {
    if (!equipeId) return

    const jogo = jogos.find(j => j.id === jogoId)

    await supabase
        .from('partidas_chaveamento')
        .update({ vencedor_id: equipeId })
        .eq('id', jogoId)

    if (jogo.proximo_jogo_id) {
        const campo = jogo.proximo_slot === 'tA' ? 'equipe_a_id' : 'equipe_b_id'

        await supabase
            .from('partidas_chaveamento')
            .update({ [campo]: equipeId })
            .eq('id', jogo.proximo_jogo_id)
    }

    carregarChaveamento()
}

carregarChaveamento()