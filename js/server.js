// Rota para buscar o chaveamento com os nomes das equipes
app.get('/api/chaveamento', async (req, res) => {
    try {
        const sql = `
            SELECT p.*, 
                   ea.nome AS equipe_a_nome, 
                   eb.nome AS equipe_b_nome,
                   ev.nome AS vencedor_nome
            FROM partidas_chaveamento p
            LEFT JOIN equipes ea ON p.equipe_a_id = ea.id
            LEFT JOIN equipes eb ON p.equipe_b_id = eb.id
            LEFT JOIN equipes ev ON p.vencedor_id = ev.id
            ORDER BY p.id ASC
        `;
        const [rows] = await pool.query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para definir o vencedor e avançá-lo na chave
app.put('/api/chaveamento/avancar', async (req, res) => {
    const { jogo_id, vencedor_id } = req.body;
    try {
        // 1. Atualiza o jogo atual com o vencedor
        await pool.query('UPDATE partidas_chaveamento SET vencedor_id = ? WHERE id = ?', [vencedor_id, jogo_id]);
        
        // 2. Descobre qual é o próximo jogo
        const [jogoInfo] = await pool.query('SELECT proximo_jogo_id FROM partidas_chaveamento WHERE id = ?', [jogo_id]);
        const proximo_jogo = jogoInfo[0].proximo_jogo_id;

        if (proximo_jogo) {
            // 3. Verifica se o próximo jogo já tem a Equipe A preenchida. Se sim, preenche a B. Se não, preenche a A.
            const [prox] = await pool.query('SELECT equipe_a_id FROM partidas_chaveamento WHERE id = ?', [proximo_jogo]);
            if (prox[0].equipe_a_id === null) {
                await pool.query('UPDATE partidas_chaveamento SET equipe_a_id = ? WHERE id = ?', [vencedor_id, proximo_jogo]);
            } else {
                await pool.query('UPDATE partidas_chaveamento SET equipe_b_id = ? WHERE id = ?', [vencedor_id, proximo_jogo]);
            }
        }
        res.json({ message: "Equipe avançou com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});