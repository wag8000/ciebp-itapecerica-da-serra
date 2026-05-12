import { buscarClassificacao } from '../services/tabelaService.js'

document.addEventListener('DOMContentLoaded', carregarTabela)

async function carregarTabela() {

  const tabela = document.getElementById('tabela')

  tabela.innerHTML = `
    <tr>
      <td colspan="8">
        Carregando...
      </td>
    </tr>
  `

  try {

    const dados = await buscarClassificacao()

    tabela.innerHTML = ''

    dados.forEach((time, index) => {

      tabela.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${time.nome}</td>
          <td>${time.pontos}</td>
          <td>${time.jogos}</td>
          <td>${time.vitorias}</td>
          <td>${time.empates}</td>
          <td>${time.derrotas}</td>
          <td>${time.saldo}</td>
        </tr>
      `
    })

  } catch (error) {

    tabela.innerHTML = `
      <tr>
        <td colspan="8">
          Erro ao carregar tabela
        </td>
      </tr>
    `

    console.error(error)
  }
}