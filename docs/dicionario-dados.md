# Dicionario de Dados - KINETIX

## usuario

| Campo | Tipo | Obrigatorio | Restricoes | Descricao |
|---|---:|---:|---|---|
| id | BIGINT | Sim | PK, identity | Identificador do usuario. |
| nome | VARCHAR(120) | Sim |  | Nome completo. |
| email | VARCHAR(160) | Sim | Unique | Email usado no login. |
| senha_hash | VARCHAR(255) | Sim |  | Senha criptografada com BCrypt. |
| ativo | BIT | Sim | Default 1 | Indica se a conta esta ativa. |
| premium | BIT | Sim | Default 0 | Indica acesso a recursos premium. |
| data_criacao | DATETIME2 | Sim | Default SYSUTCDATETIME | Data de criacao do cadastro. |

## perfil

| Campo | Tipo | Obrigatorio | Restricoes | Descricao |
|---|---:|---:|---|---|
| id | BIGINT | Sim | PK, identity | Identificador do perfil. |
| nome | VARCHAR(40) | Sim | Unique | ADMIN, CLINICA, FISIOTERAPEUTA ou PACIENTE. |

## usuario_perfil

| Campo | Tipo | Obrigatorio | Restricoes | Descricao |
|---|---:|---:|---|---|
| usuario_id | BIGINT | Sim | FK usuario | Usuario vinculado. |
| perfil_id | BIGINT | Sim | FK perfil | Perfil atribuido. |

## paciente

| Campo | Tipo | Obrigatorio | Restricoes | Descricao |
|---|---:|---:|---|---|
| id | BIGINT | Sim | PK, identity | Identificador do paciente. |
| usuario_id | BIGINT | Sim | FK usuario, unique | Usuario associado. |
| telefone | VARCHAR(20) | Nao |  | Telefone de contato. |
| data_nascimento | DATE | Nao |  | Data de nascimento. |

## fisioterapeuta

| Campo | Tipo | Obrigatorio | Restricoes | Descricao |
|---|---:|---:|---|---|
| id | BIGINT | Sim | PK, identity | Identificador do fisioterapeuta. |
| usuario_id | BIGINT | Sim | FK usuario, unique | Usuario associado. |
| crefito | VARCHAR(30) | Sim | Unique | Registro profissional. |

## clinica

| Campo | Tipo | Obrigatorio | Restricoes | Descricao |
|---|---:|---:|---|---|
| id | BIGINT | Sim | PK, identity | Identificador da clinica. |
| nome | VARCHAR(120) | Sim |  | Nome da clinica. |
| endereco | VARCHAR(255) | Sim |  | Endereco completo. |
| latitude | DECIMAL(9,6) | Nao |  | Latitude para geolocalizacao. |
| longitude | DECIMAL(9,6) | Nao |  | Longitude para geolocalizacao. |

## categoria_exercicio

| Campo | Tipo | Obrigatorio | Restricoes | Descricao |
|---|---:|---:|---|---|
| id | BIGINT | Sim | PK, identity | Identificador da categoria. |
| nome | VARCHAR(80) | Sim | Unique | Nome da categoria. |

## exercicio

| Campo | Tipo | Obrigatorio | Restricoes | Descricao |
|---|---:|---:|---|---|
| id | BIGINT | Sim | PK, identity | Identificador do exercicio. |
| nome | VARCHAR(120) | Sim |  | Nome do exercicio. |
| descricao | VARCHAR(1000) | Sim |  | Instrucoes do exercicio. |
| video_url | VARCHAR(500) | Nao |  | Link de video explicativo. |
| categoria_id | BIGINT | Sim | FK categoria_exercicio | Categoria do exercicio. |

## plano_reabilitacao

| Campo | Tipo | Obrigatorio | Restricoes | Descricao |
|---|---:|---:|---|---|
| id | BIGINT | Sim | PK, identity | Identificador do plano. |
| paciente_id | BIGINT | Sim | FK paciente | Paciente atendido. |
| fisioterapeuta_id | BIGINT | Sim | FK fisioterapeuta | Profissional responsavel. |
| status | VARCHAR(30) | Sim | Check | ATIVO, BLOQUEADO ou FINALIZADO. |
| data_criacao | DATETIME2 | Sim | Default SYSUTCDATETIME | Data de criacao. |

## plano_exercicio

| Campo | Tipo | Obrigatorio | Restricoes | Descricao |
|---|---:|---:|---|---|
| id | BIGINT | Sim | PK, identity | Identificador do item do plano. |
| plano_id | BIGINT | Sim | FK plano_reabilitacao | Plano vinculado. |
| exercicio_id | BIGINT | Sim | FK exercicio | Exercicio prescrito. |
| series | INT | Nao | Check >= 0 | Quantidade de series. |
| repeticoes | INT | Nao | Check >= 0 | Quantidade de repeticoes. |
| tempo_execucao | INT | Nao | Check >= 0 | Tempo em segundos. |

## diario_dor

| Campo | Tipo | Obrigatorio | Restricoes | Descricao |
|---|---:|---:|---|---|
| id | BIGINT | Sim | PK, identity | Identificador do registro. |
| paciente_id | BIGINT | Sim | FK paciente | Paciente que registrou dor. |
| nivel_dor | INT | Sim | Check 0 a 10 | Escala subjetiva de dor. |
| tipo_dor | VARCHAR(30) | Sim | Check | LEVE, MODERADA, AGUDA ou CRONICA. |
| observacoes | VARCHAR(1000) | Nao |  | Comentarios do paciente. |
| data_registro | DATETIME2 | Sim | Default SYSUTCDATETIME | Data do registro. |

## agendamento

| Campo | Tipo | Obrigatorio | Restricoes | Descricao |
|---|---:|---:|---|---|
| id | BIGINT | Sim | PK, identity | Identificador do agendamento. |
| paciente_id | BIGINT | Sim | FK paciente | Paciente agendado. |
| clinica_id | BIGINT | Sim | FK clinica | Clinica escolhida. |
| fisioterapeuta_id | BIGINT | Sim | FK fisioterapeuta | Profissional responsavel. |
| data_hora | DATETIME2 | Sim | Unique por clinica/fisioterapeuta | Data e horario da consulta. |

## avaliacao_clinica

| Campo | Tipo | Obrigatorio | Restricoes | Descricao |
|---|---:|---:|---|---|
| id | BIGINT | Sim | PK, identity | Identificador da avaliacao. |
| clinica_id | BIGINT | Sim | FK clinica | Clinica avaliada. |
| paciente_id | BIGINT | Sim | FK paciente | Paciente avaliador. |
| nota | INT | Sim | Check 1 a 5 | Nota atribuida. |
| comentario | VARCHAR(1000) | Nao |  | Comentario da avaliacao. |

## termo_consentimento

| Campo | Tipo | Obrigatorio | Restricoes | Descricao |
|---|---:|---:|---|---|
| id | BIGINT | Sim | PK, identity | Identificador do aceite. |
| usuario_id | BIGINT | Sim | FK usuario | Usuario que aceitou. |
| aceito | BIT | Sim |  | Indicador de aceite. |
| data_aceite | DATETIME2 | Sim | Default SYSUTCDATETIME | Data do aceite. |

## log_auditoria

| Campo | Tipo | Obrigatorio | Restricoes | Descricao |
|---|---:|---:|---|---|
| id | BIGINT | Sim | PK, identity | Identificador do log. |
| usuario | VARCHAR(160) | Sim |  | Usuario ou email envolvido. |
| acao | VARCHAR(255) | Sim |  | Acao registrada. |
| data_hora | DATETIME2 | Sim | Default SYSUTCDATETIME | Data do evento. |

## assinatura

| Campo | Tipo | Obrigatorio | Restricoes | Descricao |
|---|---:|---:|---|---|
| id | BIGINT | Sim | PK, identity | Identificador da assinatura. |
| usuario_id | BIGINT | Sim | FK usuario | Usuario assinante. |
| plano | VARCHAR(40) | Sim | Check | GRATUITO, MENSAL ou ANUAL. |
| status | VARCHAR(40) | Sim | Check | ATIVA, CANCELADA, EXPIRADA ou PENDENTE. |
