# Sprint 2 - Autenticacao e Usuarios

## Objetivo

Implementar cadastro, login, JWT, BCrypt, roles e persistencia de sessao nas aplicacoes Web e Mobile.

## Backend

Endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`

O cadastro cria:

- `usuario`
- vinculo em `usuario_perfil`
- registro especifico quando aplicavel:
  - `paciente` para perfil PACIENTE
  - `fisioterapeuta` para perfil FISIOTERAPEUTA
  - `clinica` para perfil CLINICA
- registro de aceite em `termo_consentimento`

O login retorna:

```json
{
  "token": "jwt",
  "userId": 1,
  "role": "PACIENTE",
  "name": "Usuario"
}
```

## Web

Implementado em `web/`:

- Login.
- Cadastro por perfil.
- Persistencia de sessao em `localStorage`.
- Rota protegida para dashboard.

## Mobile

Implementado em `mobile/`:

- Login.
- Cadastro por perfil.
- Persistencia de token via `expo-secure-store`.
- Tela inicial protegida `Minha Reabilitacao`.

## Decisoes Arquiteturais

- JWT stateless para reduzir dependencia de sessao no servidor.
- BCrypt para evitar armazenamento de senha em texto puro.
- DTOs separados para entrada e saida da API.
- `AuthService` centraliza regras de cadastro e login.
- `JwtAuthenticationFilter` valida tokens em requisicoes autenticadas.
- `SecureStore` no mobile por ser mais adequado para token do que armazenamento comum.

## Riscos Tecnicos

- O segredo JWT atual e apenas valor de desenvolvimento e deve ser trocado em producao.
- A modelagem original nao vincula `clinica` diretamente a `usuario`; para uso real, recomenda-se adicionar `usuario_id` em `clinica` ou criar uma tabela de membros da clinica.
- Recuperacao de senha ainda nao foi implementada.
- Confirmacao de email ainda nao foi implementada.

## Melhorias Futuras

- Criar refresh token.
- Adicionar verificacao de email.
- Implementar bloqueio temporario por tentativas de login.
- Criar testes unitarios para `AuthService`.
- Criar testes de integracao para endpoints de autenticacao.
