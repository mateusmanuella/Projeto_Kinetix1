# KINETIX

Plataforma phygital para reabilitacao fisioterapeutica assistida por tecnologia.

Slogan: Movimento inteligente para uma recuperacao eficiente.

## Visao Geral

O KINETIX esta organizado em tres frentes principais:

- `backend/`: API REST em Spring Boot.
- `web/`: painel web em React + Vite.
- `mobile/`: app mobile em React Native + Expo.

Documentacao complementar:

- `docs/`: visao geral, DER, dicionario de dados e wireframes.
- `database/sqlserver/`: scripts SQL Server.
- `sprints/`: planejamento por sprint.

## Stack

- Backend: Java 21, Spring Boot 3, Spring Security, JWT, Spring Data JPA, Validation, Lombok, SQL Server e SpringDoc OpenAPI.
- Web: React, Vite, TailwindCSS, Axios e React Router.
- Mobile: React Native, Expo, Expo Router e Axios.
- Infraestrutura: Docker e Docker Compose.

## Estrutura Atual

- `backend/src/main/java/br/com/kinetix/api/`
- `backend/src/main/resources/`
- `web/src/`
- `mobile/app/`

Os arquivos Java e JSX que estavam na raiz foram tratados como versoes antigas/soltas e nao fazem parte da estrutura principal do projeto.

## Como Executar

Backend e banco:

```bash
docker compose up --build
```

Web:

```bash
cd web
npm install
npm run dev
```

Mobile:

```bash
cd mobile
npm install
npm start
```
