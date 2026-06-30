IF DB_ID('kinetix') IS NULL
BEGIN
    CREATE DATABASE kinetix;
END
GO

USE kinetix;
GO

IF OBJECT_ID('perfil', 'U') IS NOT NULL
BEGIN
    PRINT 'Schema KINETIX ja existe. Nenhuma alteracao aplicada.';
    RETURN;
END
GO

CREATE TABLE perfil (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_perfil PRIMARY KEY,
    nome VARCHAR(40) NOT NULL CONSTRAINT uq_perfil_nome UNIQUE
);

CREATE TABLE usuario (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_usuario PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    ativo BIT NOT NULL CONSTRAINT df_usuario_ativo DEFAULT 1,
    premium BIT NOT NULL CONSTRAINT df_usuario_premium DEFAULT 0,
    data_criacao DATETIME2 NOT NULL CONSTRAINT df_usuario_data_criacao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT uq_usuario_email UNIQUE (email)
);

CREATE TABLE usuario_perfil (
    usuario_id BIGINT NOT NULL,
    perfil_id BIGINT NOT NULL,
    CONSTRAINT pk_usuario_perfil PRIMARY KEY (usuario_id, perfil_id),
    CONSTRAINT fk_usuario_perfil_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    CONSTRAINT fk_usuario_perfil_perfil FOREIGN KEY (perfil_id) REFERENCES perfil(id)
);

CREATE TABLE paciente (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_paciente PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    telefone VARCHAR(20) NULL,
    data_nascimento DATE NULL,
    CONSTRAINT uq_paciente_usuario UNIQUE (usuario_id),
    CONSTRAINT fk_paciente_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE fisioterapeuta (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_fisioterapeuta PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    crefito VARCHAR(30) NOT NULL,
    CONSTRAINT uq_fisioterapeuta_usuario UNIQUE (usuario_id),
    CONSTRAINT uq_fisioterapeuta_crefito UNIQUE (crefito),
    CONSTRAINT fk_fisioterapeuta_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE clinica (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_clinica PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    latitude DECIMAL(9,6) NULL,
    longitude DECIMAL(9,6) NULL
);

CREATE TABLE categoria_exercicio (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_categoria_exercicio PRIMARY KEY,
    nome VARCHAR(80) NOT NULL CONSTRAINT uq_categoria_exercicio_nome UNIQUE
);

CREATE TABLE exercicio (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_exercicio PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    descricao VARCHAR(1000) NOT NULL,
    video_url VARCHAR(500) NULL,
    categoria_id BIGINT NOT NULL,
    CONSTRAINT fk_exercicio_categoria FOREIGN KEY (categoria_id) REFERENCES categoria_exercicio(id)
);

CREATE TABLE plano_reabilitacao (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_plano_reabilitacao PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    fisioterapeuta_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL CONSTRAINT df_plano_reabilitacao_status DEFAULT 'ATIVO',
    data_criacao DATETIME2 NOT NULL CONSTRAINT df_plano_reabilitacao_data_criacao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT fk_plano_reabilitacao_paciente FOREIGN KEY (paciente_id) REFERENCES paciente(id),
    CONSTRAINT fk_plano_reabilitacao_fisioterapeuta FOREIGN KEY (fisioterapeuta_id) REFERENCES fisioterapeuta(id),
    CONSTRAINT ck_plano_reabilitacao_status CHECK (status IN ('ATIVO', 'BLOQUEADO', 'FINALIZADO'))
);

CREATE TABLE plano_exercicio (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_plano_exercicio PRIMARY KEY,
    plano_id BIGINT NOT NULL,
    exercicio_id BIGINT NOT NULL,
    series INT NULL,
    repeticoes INT NULL,
    tempo_execucao INT NULL,
    CONSTRAINT fk_plano_exercicio_plano FOREIGN KEY (plano_id) REFERENCES plano_reabilitacao(id),
    CONSTRAINT fk_plano_exercicio_exercicio FOREIGN KEY (exercicio_id) REFERENCES exercicio(id),
    CONSTRAINT ck_plano_exercicio_series CHECK (series IS NULL OR series >= 0),
    CONSTRAINT ck_plano_exercicio_repeticoes CHECK (repeticoes IS NULL OR repeticoes >= 0),
    CONSTRAINT ck_plano_exercicio_tempo_execucao CHECK (tempo_execucao IS NULL OR tempo_execucao >= 0)
);

CREATE TABLE diario_dor (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_diario_dor PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    nivel_dor INT NOT NULL,
    tipo_dor VARCHAR(30) NOT NULL,
    observacoes VARCHAR(1000) NULL,
    data_registro DATETIME2 NOT NULL CONSTRAINT df_diario_dor_data_registro DEFAULT SYSUTCDATETIME(),
    CONSTRAINT fk_diario_dor_paciente FOREIGN KEY (paciente_id) REFERENCES paciente(id),
    CONSTRAINT ck_diario_dor_nivel CHECK (nivel_dor BETWEEN 0 AND 10),
    CONSTRAINT ck_diario_dor_tipo CHECK (tipo_dor IN ('LEVE', 'MODERADA', 'AGUDA', 'CRONICA'))
);

CREATE TABLE agendamento (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_agendamento PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    clinica_id BIGINT NOT NULL,
    fisioterapeuta_id BIGINT NOT NULL,
    data_hora DATETIME2 NOT NULL,
    CONSTRAINT fk_agendamento_paciente FOREIGN KEY (paciente_id) REFERENCES paciente(id),
    CONSTRAINT fk_agendamento_clinica FOREIGN KEY (clinica_id) REFERENCES clinica(id),
    CONSTRAINT fk_agendamento_fisioterapeuta FOREIGN KEY (fisioterapeuta_id) REFERENCES fisioterapeuta(id),
    CONSTRAINT uq_agendamento_profissional_horario UNIQUE (fisioterapeuta_id, data_hora),
    CONSTRAINT uq_agendamento_clinica_horario UNIQUE (clinica_id, data_hora)
);

CREATE TABLE avaliacao_clinica (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_avaliacao_clinica PRIMARY KEY,
    clinica_id BIGINT NOT NULL,
    paciente_id BIGINT NOT NULL,
    nota INT NOT NULL,
    comentario VARCHAR(1000) NULL,
    CONSTRAINT fk_avaliacao_clinica_clinica FOREIGN KEY (clinica_id) REFERENCES clinica(id),
    CONSTRAINT fk_avaliacao_clinica_paciente FOREIGN KEY (paciente_id) REFERENCES paciente(id),
    CONSTRAINT ck_avaliacao_clinica_nota CHECK (nota BETWEEN 1 AND 5)
);

CREATE TABLE termo_consentimento (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_termo_consentimento PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    aceito BIT NOT NULL,
    data_aceite DATETIME2 NOT NULL CONSTRAINT df_termo_consentimento_data_aceite DEFAULT SYSUTCDATETIME(),
    CONSTRAINT fk_termo_consentimento_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE log_auditoria (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_log_auditoria PRIMARY KEY,
    usuario VARCHAR(160) NOT NULL,
    acao VARCHAR(255) NOT NULL,
    data_hora DATETIME2 NOT NULL CONSTRAINT df_log_auditoria_data_hora DEFAULT SYSUTCDATETIME()
);

CREATE TABLE assinatura (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_assinatura PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    plano VARCHAR(40) NOT NULL,
    status VARCHAR(40) NOT NULL,
    CONSTRAINT fk_assinatura_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    CONSTRAINT ck_assinatura_plano CHECK (plano IN ('GRATUITO', 'MENSAL', 'ANUAL')),
    CONSTRAINT ck_assinatura_status CHECK (status IN ('ATIVA', 'CANCELADA', 'EXPIRADA', 'PENDENTE'))
);

CREATE INDEX ix_usuario_email ON usuario(email);
CREATE INDEX ix_clinica_geolocalizacao ON clinica(latitude, longitude);
CREATE INDEX ix_diario_dor_paciente_data ON diario_dor(paciente_id, data_registro DESC);
CREATE INDEX ix_agendamento_data_hora ON agendamento(data_hora);

INSERT INTO perfil (nome)
VALUES ('ADMIN'), ('CLINICA'), ('FISIOTERAPEUTA'), ('PACIENTE');
