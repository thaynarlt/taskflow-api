CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT,
  responsavel VARCHAR(100),
  prazo DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente',
  criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO tasks (titulo, descricao, responsavel, prazo, status) VALUES
  ('Configurar ambiente Docker', 'Subir os containers da Etapa 1', 'Equipe', CURRENT_DATE + INTERVAL '3 days', 'em andamento'),
  ('Escrever README', 'Documentar instrucoes de execucao', 'Equipe', CURRENT_DATE + INTERVAL '5 days', 'pendente');
