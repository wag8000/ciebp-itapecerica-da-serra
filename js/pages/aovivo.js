import {
  buscarPartidas
} from '../services/partidaService.js'

document.addEventListener(
  'DOMContentLoaded',
  carregarAoVivo
)

async function carregarAoVivo() {

  const container =
    document.getElementById('aovivo')

  try {

    const partidas =
      await buscarPartidas()

    const aoVivo = partidas.filter(
      partida => !partida.encerrada
    )

    container.innerHTML = ''

    aoVivo.forEach(partida => {

      container.innerHTML += `
        <div class="card-aovivo">

          <h3>AO VIVO</h3>

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
  }
}