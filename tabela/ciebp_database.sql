-- ============================================================
--  CIEBP – Centro de Inovação da Educação Básica Paulista
--  Banco de Dados: Tabela Dinâmica de Iniciativas / Projetos
-- ============================================================

CREATE DATABASE IF NOT EXISTS ciebp_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ciebp_db;

-- ------------------------------------------------------------
-- Tabela de Categorias
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(100)  NOT NULL,
  cor_hex    VARCHAR(7)    NOT NULL DEFAULT '#1B1464',
  criado_em  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO categorias (nome, cor_hex) VALUES
  ('Inovação Pedagógica', '#E91E8C'),
  ('Formação de Professores', '#1B1464'),
  ('Tecnologia Educacional', '#E91E8C'),
  ('Gestão Escolar', '#1B1464'),
  ('Avaliação e Dados', '#E91E8C');

-- ------------------------------------------------------------
-- Tabela Principal: Iniciativas / Projetos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS iniciativas (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo          VARCHAR(200)  NOT NULL,
  descricao       TEXT,
  categoria_id    INT UNSIGNED  NOT NULL,
  responsavel     VARCHAR(150),
  status          ENUM('Ativo','Em Pausa','Concluído','Planejado') NOT NULL DEFAULT 'Planejado',
  prioridade      ENUM('Alta','Média','Baixa')                     NOT NULL DEFAULT 'Média',
  data_inicio     DATE,
  data_fim        DATE,
  progresso       TINYINT UNSIGNED NOT NULL DEFAULT 0
                    CHECK (progresso BETWEEN 0 AND 100),
  criado_em       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,

  INDEX idx_status       (status),
  INDEX idx_categoria    (categoria_id),
  INDEX idx_prioridade   (prioridade)
) ENGINE=InnoDB;

-- Dados de exemplo
INSERT INTO iniciativas
  (titulo, descricao, categoria_id, responsavel, status, prioridade, data_inicio, data_fim, progresso)
VALUES
  ('Laboratório Maker nas Escolas',
   'Implantação de espaços makers em 50 escolas da rede pública paulista.',
   3, 'Ana Paula Souza', 'Ativo', 'Alta', '2024-02-01', '2024-12-31', 65),

  ('Formação Continuada em STEAM',
   'Capacitação de 2 000 professores em metodologias STEAM.',
   2, 'Carlos Mendes', 'Ativo', 'Alta', '2024-03-15', '2025-03-14', 40),

  ('Plataforma de Dados Educacionais',
   'Dashboard integrado com indicadores de desempenho das escolas.',
   5, 'Fernanda Lima', 'Em Pausa', 'Média', '2024-01-10', '2024-11-30', 20),

  ('Metodologias Ativas no Ensino Médio',
   'Piloto de aprendizagem baseada em projetos em 10 unidades escolares.',
   1, 'Ricardo Torres', 'Concluído', 'Média', '2023-08-01', '2024-01-31', 100),

  ('App de Gestão Pedagógica',
   'Aplicativo mobile para acompanhamento de metas pedagógicas pelos gestores.',
   4, 'Julia Rocha', 'Planejado', 'Baixa', '2024-09-01', '2025-06-30', 0),

  ('Robótica Educacional – Ciclo 1',
   'Introdução à robótica para alunos do 1.º ao 5.º ano.',
   3, 'Marcos Oliveira', 'Ativo', 'Alta', '2024-04-01', '2024-11-30', 55),

  ('Jornada de Inovação Docente',
   'Série de workshops presenciais e online para educadores inovadores.',
   2, 'Beatriz Costa', 'Ativo', 'Média', '2024-05-01', '2024-10-31', 75);

-- ------------------------------------------------------------
-- View útil para o front-end (JOIN automático)
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW vw_iniciativas AS
SELECT
  i.id,
  i.titulo,
  i.descricao,
  c.nome        AS categoria,
  c.cor_hex     AS categoria_cor,
  i.responsavel,
  i.status,
  i.prioridade,
  i.data_inicio,
  i.data_fim,
  i.progresso,
  i.criado_em,
  i.atualizado_em
FROM iniciativas i
JOIN categorias  c ON c.id = i.categoria_id
ORDER BY
  FIELD(i.status, 'Ativo','Em Pausa','Planejado','Concluído'),
  FIELD(i.prioridade, 'Alta','Média','Baixa');

-- ============================================================
-- Consultas de manutenção rápida
-- ============================================================

-- Atualizar progresso de uma iniciativa
-- UPDATE iniciativas SET progresso = 80 WHERE id = 1;

-- Alterar status
-- UPDATE iniciativas SET status = 'Concluído' WHERE id = 2;

-- Buscar todas as iniciativas ativas com alta prioridade
-- SELECT * FROM vw_iniciativas WHERE status = 'Ativo' AND prioridade = 'Alta';

-- Adicionar nova iniciativa
-- INSERT INTO iniciativas (titulo, descricao, categoria_id, responsavel, status, prioridade, data_inicio, data_fim, progresso)
-- VALUES ('Novo Projeto', 'Descrição aqui.', 1, 'Nome Responsável', 'Planejado', 'Média', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 6 MONTH), 0);
