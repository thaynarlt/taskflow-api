# TaskFlow

Sistema web para gerenciamento de tarefas de uma equipe, desenvolvido como projeto da disciplina de DevOps.

## Descricao do projeto

O TaskFlow permite que equipes organizem suas tarefas de forma simples, oferecendo as operacoes de cadastrar, listar, editar, excluir e acompanhar o status das atividades. O objetivo e resolver a falta de organizacao e controle das tarefas de um grupo em projetos ou trabalhos academicos.

## Objetivo da aplicacao

Centralizar e organizar o controle das tarefas de uma equipe em um unico lugar, oferecendo um CRUD completo de tarefas com filtragem por status (pendente, em andamento, concluida).

## Tecnologias utilizadas

- **Frontend:** HTML, CSS e JavaScript (servido por Nginx)
- **Backend:** Node.js com Express
- **Banco de dados:** PostgreSQL 16
- **Conteinerizacao:** Docker
- **Orquestracao local:** Docker Compose
- **Versionamento:** Git e GitHub
- **Fluxo de trabalho:** GitFlow

## Estrutura do projeto

```
taskflow/
|-- backend/                # API Node.js + Express
|   |-- src/
|   |   |-- routes/
|   |   |   `-- tasks.js    # Rotas do CRUD de tarefas
|   |   |-- db.js           # Conexao com o PostgreSQL
|   |   `-- server.js       # Inicializacao do servidor
|   |-- Dockerfile
|   `-- package.json
|-- frontend/               # Interface estatica servida por Nginx
|   |-- css/style.css
|   |-- js/app.js
|   |-- index.html
|   |-- nginx.conf
|   `-- Dockerfile
|-- database/
|   `-- init.sql            # Script de criacao da tabela tasks
|-- docker-compose.yml      # Orquestracao dos servicos
|-- .gitignore
`-- README.md
```

## Pre-requisitos

- [Docker](https://www.docker.com/) 20+
- [Docker Compose](https://docs.docker.com/compose/) v2+
- Git

## Instrucoes para execucao

1. Clonar o repositorio:
   ```bash
   git clone <url-do-repositorio>
   cd taskflow
   ```

2. Subir os servicos:
   ```bash
   docker compose up -d --build
   ```

3. Acessar a aplicacao:
   - Frontend: http://localhost:8080
   - API (health-check): http://localhost:3000/health
   - API tarefas: http://localhost:3000/api/tasks
   - Banco PostgreSQL: localhost:5432 (user/pass: `taskflow` / `taskflow`)

4. Encerrar os servicos:
   ```bash
   docker compose down
   ```

## Comandos principais

| Acao | Comando |
|------|---------|
| Subir todos os containers | `docker compose up -d --build` |
| Parar todos os containers | `docker compose down` |
| Parar e remover volumes (apaga o banco) | `docker compose down -v` |
| Ver logs em tempo real | `docker compose logs -f` |
| Logs de um servico | `docker compose logs -f backend` |
| Reiniciar um servico | `docker compose restart backend` |
| Acessar o banco via psql | `docker compose exec db psql -U taskflow -d taskflow` |

## Endpoints da API

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/tasks` | Lista todas as tarefas (suporta `?status=`) |
| GET | `/api/tasks/:id` | Detalhe de uma tarefa |
| POST | `/api/tasks` | Cria uma tarefa |
| PUT | `/api/tasks/:id` | Atualiza uma tarefa |
| DELETE | `/api/tasks/:id` | Remove uma tarefa |
| GET | `/health` | Health-check do backend |

## Fluxo de trabalho (GitFlow)

- `main`: branch estavel, recebe as releases.
- `develop`: integracao das funcionalidades em desenvolvimento.
- `feature/*`: branches de funcionalidades, abertas a partir de `develop`.

## Integrantes da equipe

- Eduardo Bellini
- Thayná Tolentino

## Status do projeto

Etapa 1 (Estruturacao do ambiente e conteinerizacao) - concluida.
