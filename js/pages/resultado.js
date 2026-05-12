import { buscarPartidas } from '../services/partidasService.js'

document.addEventListener(
  'DOMContentLoaded',
  carregarResultados
)

async function carregarResultados() {

  const container =
    document.getElementById('resultados')

  try {

    const partidas =
      await buscarPartidas()

    container.innerHTML = ''

    partidas.forEach(partida => {

      container.innerHTML += `
        <div class="card-resultado">

          <h3>${partida.fase}</h3>

          <div>
            ${partida.teamA.nome}
            ${partida.gols_a}
            x
            ${partida.gols_b}
            ${partida.teamB.nome}
          </div>

        </div>
      `
    })

  } catch (error) {

    console.error(error)

    container.innerHTML =
      'Erro ao carregar resultados'
  }
}