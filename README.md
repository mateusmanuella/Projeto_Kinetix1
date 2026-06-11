# KINETIX

<<<<<<< HEAD
Plataforma phygital para reabilitacao fisioterapeutica assistida por tecnologia.

Slogan: Movimento inteligente para uma recuperacao eficiente.

## Visao Geral

O KINETIX conecta pacientes, fisioterapeutas e clinicas por meio de uma aplicacao web, uma aplicacao mobile, uma API REST e um banco de dados SQL Server.

## Stack

- Backend: Java 21, Spring Boot 3, Spring Security, JWT, Spring Data JPA, Validation, Lombok, SQL Server e SpringDoc OpenAPI.
- Web: React, Vite, TailwindCSS, Axios e React Router.
- Mobile: React Native, Expo, Expo Router e Axios.
- Infraestrutura: Docker, Docker Compose, GitHub Actions, Render/Railway e Vercel/Netlify.

## Sprint Atual

Sprint 1 - Arquitetura e Planejamento.

Entregaveis:

- DER completo em `docs/der.md`.
- Dicionario de dados em `docs/dicionario-dados.md`.
- Script SQL Server em `database/sqlserver/001_create_schema.sql`.
- Docker Compose em `docker-compose.yml`.
- Dockerfile do backend em `backend/Dockerfile`.
- Estrutura inicial Spring Boot em `backend/`.
- Wireframes textuais em `docs/wireframes.md`.

## Decisoes Arquiteturais

- Arquitetura em camadas para separar Controller, Service, Repository, DTOs e entidades.
- SQL Server como banco relacional principal, adequado para integridade referencial e auditoria.
- JWT para autenticacao stateless.
- BCrypt para armazenamento seguro de senhas.
- Registro de consentimento e auditoria desde a Sprint 1 para atender LGPD.

## Riscos Tecnicos

- Dados de saude exigem cuidado adicional com privacidade, controle de acesso e logs.
- Geolocalizacao exige validacao de permissao, precisao e tratamento de indisponibilidade.
- Agendamentos precisam de transacao e controle de concorrencia para evitar horarios duplicados.

## Sprint 2 - Autenticacao e Usuarios

Endpoints implementados:

- `POST /api/auth/register`
- `POST /api/auth/login`

Exemplo de cadastro de paciente:

```json
{
  "nome": "Usuario Paciente",
  "email": "paciente@kinetix.com",
  "senha": "Senha@123",
  "role": "PACIENTE",
  "telefone": "11999999999",
  "dataNascimento": "2000-01-15",
  "aceiteTermos": true
}
```

Exemplo de login:

```json
{
  "email": "paciente@kinetix.com",
  "senha": "Senha@123"
}
```

Login inicial criado automaticamente:

```json
{
  "email": "admin@kinetix.com",
  "senha": "Admin@123"
}
```

Retorno do login:

```json
{
  "token": "jwt",
  "userId": 1,
  "role": "PACIENTE",
  "name": "Usuario Paciente"
}
```

Documentacao Swagger:

- `http://localhost:8080/swagger-ui.html`

## Como Executar

Backend e SQL Server:

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

Observacao: no mobile, ajuste `extra.apiUrl` em `mobile/app.json` para o IP da sua maquina quando testar em celular fisico.
=======
Projeto HealthTech para apoio a fisioterapeutas e pacientes, alinhado à ODS 3.

## Estrutura inicial

- `docs/` documentação do projeto
- `sprints/` planejamento detalhado por sprint
- `backend/` futura API Spring Boot
- `frontend/` futuro painel web
- `mobile/` futuro app React Native

## Sprint atual

Veja o planejamento em `sprints/`.

>>>>>>> d0316cb1ebb3874698ebce1879bbfa6a937f9bbd
