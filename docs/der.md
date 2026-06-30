# DER - KINETIX

## Objetivo

Este DER representa a base relacional do KINETIX para suportar autenticacao, perfis, pacientes, fisioterapeutas, clinicas, exercicios, planos de reabilitacao, diario de dor, agendamentos, avaliacoes, consentimento LGPD, auditoria e assinaturas.

## Diagrama Mermaid

```mermaid
erDiagram
    USUARIO {
        bigint id PK
        varchar nome
        varchar email UK
        varchar senha_hash
        bit ativo
        bit premium
        datetime2 data_criacao
    }

    PERFIL {
        bigint id PK
        varchar nome UK
    }

    USUARIO_PERFIL {
        bigint usuario_id FK
        bigint perfil_id FK
    }

    PACIENTE {
        bigint id PK
        bigint usuario_id FK
        varchar telefone
        date data_nascimento
    }

    FISIOTERAPEUTA {
        bigint id PK
        bigint usuario_id FK
        varchar crefito UK
    }

    CLINICA {
        bigint id PK
        varchar nome
        varchar endereco
        decimal latitude
        decimal longitude
    }

    CATEGORIA_EXERCICIO {
        bigint id PK
        varchar nome UK
    }

    EXERCICIO {
        bigint id PK
        varchar nome
        varchar descricao
        varchar video_url
        bigint categoria_id FK
    }

    PLANO_REABILITACAO {
        bigint id PK
        bigint paciente_id FK
        bigint fisioterapeuta_id FK
        varchar status
        datetime2 data_criacao
    }

    PLANO_EXERCICIO {
        bigint id PK
        bigint plano_id FK
        bigint exercicio_id FK
        int series
        int repeticoes
        int tempo_execucao
    }

    DIARIO_DOR {
        bigint id PK
        bigint paciente_id FK
        int nivel_dor
        varchar tipo_dor
        varchar observacoes
        datetime2 data_registro
    }

    AGENDAMENTO {
        bigint id PK
        bigint paciente_id FK
        bigint clinica_id FK
        bigint fisioterapeuta_id FK
        datetime2 data_hora
    }

    AVALIACAO_CLINICA {
        bigint id PK
        bigint clinica_id FK
        bigint paciente_id FK
        int nota
        varchar comentario
    }

    TERMO_CONSENTIMENTO {
        bigint id PK
        bigint usuario_id FK
        bit aceito
        datetime2 data_aceite
    }

    LOG_AUDITORIA {
        bigint id PK
        varchar usuario
        varchar acao
        datetime2 data_hora
    }

    ASSINATURA {
        bigint id PK
        bigint usuario_id FK
        varchar plano
        varchar status
    }

    USUARIO ||--o{ USUARIO_PERFIL : possui
    PERFIL ||--o{ USUARIO_PERFIL : atribuido
    USUARIO ||--o| PACIENTE : representa
    USUARIO ||--o| FISIOTERAPEUTA : representa
    CATEGORIA_EXERCICIO ||--o{ EXERCICIO : classifica
    PACIENTE ||--o{ PLANO_REABILITACAO : recebe
    FISIOTERAPEUTA ||--o{ PLANO_REABILITACAO : cria
    PLANO_REABILITACAO ||--o{ PLANO_EXERCICIO : contem
    EXERCICIO ||--o{ PLANO_EXERCICIO : prescrito
    PACIENTE ||--o{ DIARIO_DOR : registra
    PACIENTE ||--o{ AGENDAMENTO : agenda
    CLINICA ||--o{ AGENDAMENTO : atende
    FISIOTERAPEUTA ||--o{ AGENDAMENTO : realiza
    CLINICA ||--o{ AVALIACAO_CLINICA : recebe
    PACIENTE ||--o{ AVALIACAO_CLINICA : avalia
    USUARIO ||--o{ TERMO_CONSENTIMENTO : aceita
    USUARIO ||--o{ ASSINATURA : possui
```

## Observacoes

- A tabela `usuario_perfil` permite que um usuario tenha mais de um perfil no futuro.
- `termo_consentimento` registra aceite explicito para LGPD.
- `log_auditoria` foi mantido simples para Sprint 1 e pode evoluir com IP, user agent e entidade afetada.
- `plano_reabilitacao.status` controla estados como ATIVO, BLOQUEADO e FINALIZADO.
