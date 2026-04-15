document.addEventListener('DOMContentLoaded', () => {
    // Simulação inicial dos dados que viriam do Banco de Dados
    let jogosTorneio = [
        { id: 1, rodada: 'Quartas', equipeA: { id: 101, nome: 'Strikers' }, equipeB: { id: 102, nome: 'Aliens' }, vencedor_id: null, proximoJogoId: 5 },
        { id: 1, rodada: 'Quartas', equipeA: { id: 101, nome: 'Strikers' }, equipeB: { id: 102, nome: 'Aliens' }, vencedor_id: null, proximoJogoId: 5 },
        { id: 1, rodada: 'Quartas', equipeA: { id: 101, nome: 'Strikers' }, equipeB: { id: 102, nome: 'Aliens' }, vencedor_id: null, proximoJogoId: 5 },
        { id: 1, rodada: 'Quartas', equipeA: { id: 101, nome: 'Strikers' }, equipeB: { id: 102, nome: 'Aliens' }, vencedor_id: null, proximoJogoId: 5 },

        { id: 2, rodada: 'Quartas', equipeA: { id: 103, nome: 'Titans' }, equipeB: { id: 104, nome: 'Cyborgs' }, vencedor_id: null, proximoJogoId: 5 },
        { id: 3, rodada: 'Quartas', equipeA: { id: 105, nome: 'Nexus' }, equipeB: { id: 106, nome: 'Vortex' }, vencedor_id: null, proximoJogoId: 6 },
        { id: 4, rodada: 'Quartas', equipeA: { id: 107, nome: 'Alpha' }, equipeB: { id: 108, nome: 'Omega' }, vencedor_id: null, proximoJogoId: 6 },
        { id: 5, rodada: 'Semifinal', equipeA: null, equipeB: null, vencedor_id: null, proximoJogoId: 7 },
        { id: 6, rodada: 'Semifinal', equipeA: null, equipeB: null, vencedor_id: null, proximoJogoId: 7 },
        { id: 7, rodada: 'Final', equipeA: null, equipeB: null, vencedor_id: null, proximoJogoId: null }
    ];

    const colunas = [
        { nome: 'Primeira Fase', jogos: [1, 2, 3] },
        { nome: 'Segunda Fase', jogos: [1, 2, 3, 4, 5, 6, 7, 8] },
        { nome: 'Quartas de Final', jogos: [1, 2, 3, 4] },
        { nome: 'Semifinal', jogos: [5, 6] },
        { nome: 'Grande Final', jogos: [7] }
    ];