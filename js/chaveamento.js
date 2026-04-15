document.addEventListener('DOMContentLoaded', () => {
    // 1. Criação das 19 Equipes
    const equipes = [];
    for(let i = 1; i <= 19; i++) {
        equipes.push({ id: i, nome: `Equipe ${i}` });
    }

    // 2. Mapeamento Fiel (18 Jogos)
    let jogosTorneio = [
        { id: 1, rodada: 'Preliminar', tA: equipes[1], tB: equipes[2], vencedor_id: null, nextId: 9, nextSlot: 'tB' },
        { id: 2, rodada: 'Preliminar', tA: equipes[10], tB: equipes[11], vencedor_id: null, nextId: 10, nextSlot: 'tB' },
        { id: 3, rodada: 'Preliminar', tA: equipes[16], tB: equipes[17], vencedor_id: null, nextId: 11, nextSlot: 'tA' },

        { id: 9, rodada: 'Oitavas', tA: equipes[0], tB: null, vencedor_id: null, nextId: 12, nextSlot: 'tA' }, 
        { id: 4, rodada: 'Oitavas', tA: equipes[3], tB: equipes[4], vencedor_id: null, nextId: 12, nextSlot: 'tB' },
        { id: 5, rodada: 'Oitavas', tA: equipes[5], tB: equipes[6], vencedor_id: null, nextId: 13, nextSlot: 'tA' },
        { id: 6, rodada: 'Oitavas', tA: equipes[7], tB: equipes[8], vencedor_id: null, nextId: 13, nextSlot: 'tB' },
        { id: 10, rodada: 'Oitavas', tA: equipes[9], tB: null, vencedor_id: null, nextId: 14, nextSlot: 'tA' }, 
        { id: 7, rodada: 'Oitavas', tA: equipes[12], tB: equipes[13], vencedor_id: null, nextId: 14, nextSlot: 'tB' },
        { id: 8, rodada: 'Oitavas', tA: equipes[14], tB: equipes[15], vencedor_id: null, nextId: 15, nextSlot: 'tA' },
        { id: 11, rodada: 'Oitavas', tA: null, tB: equipes[18], vencedor_id: null, nextId: 15, nextSlot: 'tB' }, 

        { id: 12, rodada: 'Quartas', tA: null, tB: null, vencedor_id: null, nextId: 16, nextSlot: 'tA' },
        { id: 13, rodada: 'Quartas', tA: null, tB: null, vencedor_id: null, nextId: 16, nextSlot: 'tB' },
        { id: 14, rodada: 'Quartas', tA: null, tB: null, vencedor_id: null, nextId: 17, nextSlot: 'tA' },
        { id: 15, rodada: 'Quartas', tA: null, tB: null, vencedor_id: null, nextId: 17, nextSlot: 'tB' },

        { id: 16, rodada: 'Semifinal', tA: null, tB: null, vencedor_id: null, nextId: 18, nextSlot: 'tA' },
        { id: 17, rodada: 'Semifinal', tA: null, tB: null, vencedor_id: null, nextId: 18, nextSlot: 'tB' },

        { id: 18, rodada: 'Final', tA: null, tB: null, vencedor_id: null, nextId: null, nextSlot: null }
    ];

    const colunas = [
        { nome: 'Preliminar', jogos: [1, 'spacer', 'spacer', 2, 'spacer', 'spacer', 3] },
        { nome: 'Oitavas', jogos: [9, 4, 5, 6, 10, 7, 8, 11] },
        { nome: 'Quartas', jogos: [12, 13, 14, 15] },
        { nome: 'Semifinal', jogos: [16, 17] },
        { nome: 'Final', jogos: [18] }
    ];

    function renderizarBracket() {
        const container = document.getElementById('bracket-ui');
        if (!container) return;
        container.innerHTML = '';

        // 1. Injeta o SVG no fundo para desenhar as linhas conectivas
        const svgHTML = `<svg id="bracket-lines" class="absolute top-0 left-0 w-full h-full pointer-events-none z-0"></svg>`;
        
        // 2. Cria o grid flexível onde as caixas vão ficar
        let colunasHTML = `<div class="flex justify-between w-full h-full relative z-10 gap-12">`;
        
        colunas.forEach(coluna => {
            colunasHTML += `<div class="bracket-column">`;
            coluna.jogos.forEach(item => {
                if (item === 'spacer') {
                    colunasHTML += `<div class="match-box spacer"></div>`;
                } else {
                    const jogo = jogosTorneio.find(j => j.id === item);
                    if (jogo) colunasHTML += criarCardJogo(jogo);
                }
            });
            colunasHTML += `</div>`;
        });
        
        colunasHTML += `</div>`;
        container.innerHTML = svgHTML + colunasHTML;

        // 3. Pede ao navegador para desenhar as linhas no frame seguinte (após as caixas existirem)
        requestAnimationFrame(() => {
            drawLines();
        });
    }

    function criarCardJogo(jogo) {
        // Se for o Jogo Final (18), adicionamos a TAÇA animada acima da caixa!
        let tacaHTML = '';
        if (jogo.id === 18) {
            tacaHTML = `
                <div class="absolute -top-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                    <span class="text-5xl drop-shadow-lg filter pb-2">🏆</span>
                    <span class="font-black text-xs text-[#FF1D6E] uppercase tracking-widest bg-white px-2 rounded-md shadow-sm">Campeão</span>
                </div>
            `;
        }

        const renderTime = (equipeObj) => {
            if (!equipeObj) return `<div class="team-slot tbd">A definir</div>`;
            const isWinner = jogo.vencedor_id === equipeObj.id;
            const classes = isWinner ? 'team-slot winner' : 'team-slot';
            return `<div class="${classes}" onclick="window.avancarEquipe(${jogo.id}, ${equipeObj.id}, '${equipeObj.nome}')">
                        <span>${equipeObj.nome}</span>
                        ${isWinner ? '<span class="text-white text-xs bg-[#193375] px-1 rounded">V</span>' : ''}
                    </div>`;
        };

        return `
            <div class="match-box" id="match-${jogo.id}">
                ${tacaHTML}
                <div class="match-header">JOGO ${jogo.id}</div>
                ${renderTime(jogo.tA)}
                ${renderTime(jogo.tB)}
            </div>
        `;
    }

    // Função matemática que cria as linhas curvas cruzadas (Bezier Curves em SVG)
    function drawLines() {
        const svg = document.getElementById('bracket-lines');
        if (!svg) return;
        svg.innerHTML = ''; // Limpa linhas anteriores

        jogosTorneio.forEach(jogo => {
            if (jogo.nextId) {
                const elAtual = document.getElementById(`match-${jogo.id}`);
                const elProx = document.getElementById(`match-${jogo.nextId}`);

                if (elAtual && elProx) {
                    // Pega as posições relativas das caixas para ligar direita -> esquerda
                    const startX = elAtual.offsetLeft + elAtual.offsetWidth;
                    const startY = elAtual.offsetTop + (elAtual.offsetHeight / 2);
                    const endX = elProx.offsetLeft;
                    const endY = elProx.offsetTop + (elProx.offsetHeight / 2);

                    // A mágica da Curva de Bezier (C). Cria a sinuosidade suave ("S")
                    const offset = 40; 
                    const pathData = `M ${startX} ${startY} C ${startX + offset} ${startY}, ${endX - offset} ${endY}, ${endX} ${endY}`;

                    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("d", pathData);
                    path.setAttribute("fill", "none");
                    path.setAttribute("stroke", "#9898B8"); // Cor da linha (cinza azulado CIEBP)
                    path.setAttribute("stroke-width", "2");

                    svg.appendChild(path);
                }
            }
        });
    }

    window.avancarEquipe = function(jogoId, equipeId, equipeNome) {
        const jogoAtual = jogosTorneio.find(j => j.id === jogoId);
        if (jogoAtual.vencedor_id === equipeId) return;

        if (confirm(`Avançar ${equipeNome} como vencedor do Jogo ${jogoId}?`)) {
            jogoAtual.vencedor_id = equipeId;
            if (jogoAtual.nextId) {
                const proxJogo = jogosTorneio.find(j => j.id === jogoAtual.nextId);
                proxJogo[jogoAtual.nextSlot] = { id: equipeId, nome: equipeNome };
            }
            renderizarBracket();
        }
    };

    // Redesenha as linhas se o usuário redimensionar a tela
    window.addEventListener('resize', drawLines);

    renderizarBracket();
});