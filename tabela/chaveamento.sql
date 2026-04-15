-- Criação da tabela de Equipes
CREATE TABLE IF NOT EXISTS equipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    turma VARCHAR(50)
);

-- Criação da tabela de Partidas do Chaveamento
CREATE TABLE IF NOT EXISTS partidas_chaveamento (
    id INT PRIMARY KEY, -- ID exato da imagem (1 a 18)
    rodada VARCHAR(50) NOT NULL,
    equipe_a_id INT NULL, -- Pode ser NULL até que o vencedor do jogo anterior seja definido
    equipe_b_id INT NULL,
    vencedor_id INT NULL,
    proximo_jogo_id INT NULL, -- Para onde o vencedor vai?
    
    FOREIGN KEY (equipe_a_id) REFERENCES equipes(id),
    FOREIGN KEY (equipe_b_id) REFERENCES equipes(id),
    FOREIGN KEY (vencedor_id) REFERENCES equipes(id)
);

-- Inserindo os 18 Jogos conforme a sua imagem
-- Nota: Os IDs das equipes (1 a 19) devem ser cadastrados previamente na tabela 'equipes'
INSERT IGNORE INTO partidas_chaveamento (id, rodada, equipe_a_id, equipe_b_id, proximo_jogo_id) VALUES
-- Rodada Preliminar
(1, 'Preliminar', 2, 3, 9),
(2, 'Preliminar', 11, 12, 10),
(3, 'Preliminar', 17, 18, 11),

-- Oitavas de Final
(9, 'Oitavas', 1, NULL, 12), -- Aguarda vencedor do Jogo 1
(4, 'Oitavas', 4, 5, 12),
(5, 'Oitavas', 6, 7, 13),
(6, 'Oitavas', 8, 9, 13),
(10, 'Oitavas', 10, NULL, 14), -- Aguarda vencedor do Jogo 2
(7, 'Oitavas', 13, 14, 14),
(8, 'Oitavas', 15, 16, 15),
(11, 'Oitavas', NULL, 19, 15), -- Aguarda vencedor do Jogo 3

-- Quartas de Final
(12, 'Quartas', NULL, NULL, 16), -- Aguarda vencedores 9 e 4
(13, 'Quartas', NULL, NULL, 16), -- Aguarda vencedores 5 e 6
(14, 'Quartas', NULL, NULL, 17), -- Aguarda vencedores 10 e 7
(15, 'Quartas', NULL, NULL, 17), -- Aguarda vencedores 8 e 11

-- Semifinal
(16, 'Semifinal', NULL, NULL, 18), -- Aguarda 12 e 13
(17, 'Semifinal', NULL, NULL, 18), -- Aguarda 14 e 15

-- Final
(18, 'Final', NULL, NULL, NULL); -- Aguarda 16 e 17