# TaskFlow

[![CI](https://github.com/thaynarlt/taskflow-api/actions/workflows/sonar.yml/badge.svg)](https://github.com/thaynarlt/taskflow-api/actions/workflows/sonar.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=thaynarlt_taskflow-api&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=thaynarlt_taskflow-api)

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
- **CI/CD:** GitHub Actions
- **Qualidade de codigo:** SonarCloud

## Estrutura do projeto

```
taskflow/
|-- .github/
|   `-- workflows/
|       `-- sonar.yml          # Pipeline do GitHub Actions (build, testes, Sonar)
|-- backend/                   # API Node.js + Express
|   |-- src/
|   |   |-- routes/
|   |   |   `-- tasks.js       # Rotas do CRUD de tarefas
|   |   |-- __tests__/
|   |   |   |-- health.test.js # Teste do endpoint /health
|   |   |   `-- tasks.test.js  # Testes do CRUD de tarefas
|   |   |-- app.js             # Aplicacao Express (exportavel para testes)
|   |   |-- db.js              # Conexao com o PostgreSQL
|   |   `-- server.js          # Inicializacao do servidor
|   |-- Dockerfile
|   |-- jest.config.js         # Configuracao do Jest
|   `-- package.json
|-- frontend/                  # Interface estatica servida por Nginx
|   |-- css/style.css
|   |-- js/app.js
|   |-- index.html
|   |-- nginx.conf
|   `-- Dockerfile
|-- database/
|   `-- init.sql               # Script de criacao da tabela tasks
|-- docker-compose.yml         # Orquestracao dos servicos
|-- sonar-project.properties   # Configuracao do SonarCloud
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

## CI/CD

O projeto usa **GitHub Actions** para integracao continua. O workflow esta em [.github/workflows/sonar.yml](.github/workflows/sonar.yml) e e disparado em:

- `push` para `main` e `develop`
- `pull_request` para `main` e `develop`

O pipeline executa as seguintes etapas:

1. Checkout do repositorio (com `fetch-depth: 0` para o Sonar analisar o historico completo).
2. Configuracao do Node.js 20 com cache do `package-lock.json`.
3. Instalacao das dependencias do backend (`npm ci`).
4. Execucao dos testes automatizados com cobertura (`npm test`).
5. Validacao do build dos 3 containers (`docker compose build`).
6. Analise estatica no SonarCloud usando o secret `SONAR_TOKEN`.

## Testes

O backend possui testes automatizados com **Jest** e **supertest**, organizados em `backend/src/__tests__/`.

Para rodar localmente:

```bash
cd backend
npm install
npm test
```

O comando `npm test` executa a suite com `--coverage`, gerando o relatorio em `backend/coverage/lcov.info`, que e consumido pelo SonarCloud no pipeline.

Cenarios cobertos:

- `GET /health` retorna 200 com o payload de status.
- `GET /api/tasks` retorna a lista de tarefas.
- `POST /api/tasks` sem `titulo` retorna 400.
- `GET /api/tasks/:id` inexistente retorna 404.

## Qualidade de codigo

A analise estatica e feita pelo **SonarCloud**, integrado ao pipeline do GitHub Actions. O dashboard publico esta em:

https://sonarcloud.io/project/overview?id=thaynarlt_taskflow-api

O Quality Gate cobre bugs, vulnerabilidades, code smells, hotspots de seguranca e duplicacao de codigo.

## Fluxo de trabalho (GitFlow)

- `main`: branch estavel, recebe as releases.
- `develop`: integracao das funcionalidades em desenvolvimento.
- `feature/*`: branches de funcionalidades, abertas a partir de `develop`.

## Integrantes da equipe

- Eduardo Bellini
- Thayná Tolentino

## Status do projeto

- Etapa 1 (Estruturacao do ambiente e conteinerizacao) - concluida.
- Entrega final (CI com GitHub Actions + analise SonarCloud) - concluida.
