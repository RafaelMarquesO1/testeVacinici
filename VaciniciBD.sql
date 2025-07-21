IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'VaciniciBD')
BEGIN
    CREATE DATABASE VaciniciBD;
    PRINT 'Banco de dados VaciniciBD criado.';
END
ELSE
BEGIN
    PRINT 'Banco de dados VaciniciBD já existe.';
END
GO

USE VaciniciBD;
GO

-- Tabela de Usuários
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'usuarios')
BEGIN
    CREATE TABLE usuarios (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nome_completo NVARCHAR(100) NOT NULL,
        email NVARCHAR(100) UNIQUE,
        telefone NVARCHAR(20),
        cpf NVARCHAR(20) UNIQUE NOT NULL,
        data_nascimento DATE,
        genero NVARCHAR(20),
        tipo_usuario NVARCHAR(20) NOT NULL, -- 'Paciente' ou 'Funcionario'
        cargo NVARCHAR(50), -- Para funcionários (ex: 'Enfermeira', 'Médico')
        foto_perfil NVARCHAR(255),
        data_cadastro DATETIME DEFAULT GETDATE()
    );
    PRINT 'Tabela usuarios criada.';
END
GO

-- Tabela de Credenciais
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'credenciais')
BEGIN
    CREATE TABLE credenciais (
        id INT IDENTITY(1,1) PRIMARY KEY,
        usuario_id INT NOT NULL,
        senha_hash NVARCHAR(255) NOT NULL,
        token_acesso NVARCHAR(255),
        data_expiracao DATETIME,
        CONSTRAINT FK_credenciais_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );
    PRINT 'Tabela credenciais criada.';
END
GO

-- Tabela de Vacinas
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'vacinas')
BEGIN
    CREATE TABLE vacinas (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nome NVARCHAR(100) NOT NULL,
        fabricante NVARCHAR(100),
        descricao NVARCHAR(MAX),
        doses_recomendadas INT,
        intervalo_doses INT, -- em dias
        idade_minima INT, -- em meses
        idade_maxima INT, -- em meses, NULL se não houver limite
        categoria NVARCHAR(50), -- ex: obrigatória, opcional, sazonal
        imagem_url NVARCHAR(255)
    );
    PRINT 'Tabela vacinas criada.';
END
GO

-- Tabela de Locais de Vacinação
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'locais_vacinacao')
BEGIN
    CREATE TABLE locais_vacinacao (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nome NVARCHAR(100) NOT NULL,
        endereco NVARCHAR(255) NOT NULL,
        cidade NVARCHAR(100) NOT NULL,
        estado NVARCHAR(2) NOT NULL,
        cep NVARCHAR(10),
        telefone NVARCHAR(20),
        horario_funcionamento NVARCHAR(100),
        latitude FLOAT,
        longitude FLOAT,
        tipo NVARCHAR(50) -- ex: posto de saúde, hospital, clínica
    );
    PRINT 'Tabela locais_vacinacao criada.';
END
GO

-- Tabela de Histórico de Vacinação
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'historico_vacinacao')
BEGIN
    CREATE TABLE historico_vacinacao (
        id INT IDENTITY(1,1) PRIMARY KEY,
        paciente_id INT NOT NULL,
        funcionario_id INT NOT NULL,
        vacina_id INT NOT NULL,
        dose NVARCHAR(50) NOT NULL, -- ex: '1ª Dose', '2ª Dose', 'Dose Única', 'Dose Anual'
        data_aplicacao DATE NOT NULL,
        lote NVARCHAR(50) NOT NULL,
        validade DATE,
        local_id INT,
        comprovante_url NVARCHAR(255),
        observacoes NVARCHAR(MAX),
        CONSTRAINT FK_historico_paciente FOREIGN KEY (paciente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        CONSTRAINT FK_historico_funcionario FOREIGN KEY (funcionario_id) REFERENCES usuarios(id),
        CONSTRAINT FK_historico_vacina FOREIGN KEY (vacina_id) REFERENCES vacinas(id),
        CONSTRAINT FK_historico_local FOREIGN KEY (local_id) REFERENCES locais_vacinacao(id)
    );
    PRINT 'Tabela historico_vacinacao criada.';
END
GO

-- Tabela de Agendamentos
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'agendamentos')
BEGIN
    CREATE TABLE agendamentos (
        id INT IDENTITY(1,1) PRIMARY KEY,
        paciente_id INT NOT NULL,
        vacina_id INT NOT NULL,
        dose NVARCHAR(50) NOT NULL,
        data_hora DATETIME NOT NULL,
        local_id INT NOT NULL,
        status NVARCHAR(50) NOT NULL, -- ex: agendado, concluído, cancelado
        notificacao_enviada BIT DEFAULT 0,
        CONSTRAINT FK_agendamentos_paciente FOREIGN KEY (paciente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        CONSTRAINT FK_agendamentos_vacina FOREIGN KEY (vacina_id) REFERENCES vacinas(id),
        CONSTRAINT FK_agendamentos_local FOREIGN KEY (local_id) REFERENCES locais_vacinacao(id)
    );
    PRINT 'Tabela agendamentos criada.';
END
GO

-- Tabela de Dependentes
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'dependentes')
BEGIN
    CREATE TABLE dependentes (
        id INT IDENTITY(1,1) PRIMARY KEY,
        responsavel_id INT NOT NULL,
        nome_completo NVARCHAR(100) NOT NULL,
        data_nascimento DATE NOT NULL,
        genero NVARCHAR(20),
        cpf NVARCHAR(20) UNIQUE,
        foto_perfil NVARCHAR(255),
        CONSTRAINT FK_dependentes_responsavel FOREIGN KEY (responsavel_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );
    PRINT 'Tabela dependentes criada.';
END
GO

-- Tabela de Histórico de Vacinação dos Dependentes
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'historico_vacinacao_dependentes')
BEGIN
    CREATE TABLE historico_vacinacao_dependentes (
        id INT IDENTITY(1,1) PRIMARY KEY,
        dependente_id INT NOT NULL,
        funcionario_id INT NOT NULL,
        vacina_id INT NOT NULL,
        dose NVARCHAR(50) NOT NULL,
        data_aplicacao DATE NOT NULL,
        lote NVARCHAR(50) NOT NULL,
        validade DATE,
        local_id INT,
        comprovante_url NVARCHAR(255),
        observacoes NVARCHAR(MAX),
        CONSTRAINT FK_historico_dep_dependente FOREIGN KEY (dependente_id) REFERENCES dependentes(id) ON DELETE CASCADE,
        CONSTRAINT FK_historico_dep_funcionario FOREIGN KEY (funcionario_id) REFERENCES usuarios(id),
        CONSTRAINT FK_historico_dep_vacina FOREIGN KEY (vacina_id) REFERENCES vacinas(id),
        CONSTRAINT FK_historico_dep_local FOREIGN KEY (local_id) REFERENCES locais_vacinacao(id)
    );
    PRINT 'Tabela historico_vacinacao_dependentes criada.';
END
GO

-- Tabela de Configurações do Usuário
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'configuracoes_usuario')
BEGIN
    CREATE TABLE configuracoes_usuario (
        usuario_id INT PRIMARY KEY,
        tema_escuro BIT DEFAULT 0,
        notificacoes_ativas BIT DEFAULT 1,
        lembrete_dias_antes INT DEFAULT 3,
        idioma NVARCHAR(10) DEFAULT 'pt-BR',
        CONSTRAINT FK_configuracoes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );
    PRINT 'Tabela configuracoes_usuario criada.';
END
GO

-- Tabela de Estatísticas de Vacinação
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'estatisticas_vacinacao')
BEGIN
    CREATE TABLE estatisticas_vacinacao (
        id INT IDENTITY(1,1) PRIMARY KEY,
        vacina_id INT NOT NULL,
        regiao NVARCHAR(50),
        faixa_etaria NVARCHAR(50),
        total_doses INT,
        cobertura_percentual FLOAT,
        periodo_inicio DATE,
        periodo_fim DATE,
        CONSTRAINT FK_estatisticas_vacina FOREIGN KEY (vacina_id) REFERENCES vacinas(id)
    );
    PRINT 'Tabela estatisticas_vacinacao criada.';
END
GO

-- Índices para otimização de consultas
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_historico_paciente')
BEGIN
    CREATE INDEX idx_historico_paciente ON historico_vacinacao(paciente_id);
    PRINT 'Índice idx_historico_paciente criado.';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_historico_vacina')
BEGIN
    CREATE INDEX idx_historico_vacina ON historico_vacinacao(vacina_id);
    PRINT 'Índice idx_historico_vacina criado.';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_agendamentos_paciente')
BEGIN
    CREATE INDEX idx_agendamentos_paciente ON agendamentos(paciente_id);
    PRINT 'Índice idx_agendamentos_paciente criado.';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_agendamentos_data')
BEGIN
    CREATE INDEX idx_agendamentos_data ON agendamentos(data_hora);
    PRINT 'Índice idx_agendamentos_data criado.';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_dependentes_responsavel')
BEGIN
    CREATE INDEX idx_dependentes_responsavel ON dependentes(responsavel_id);
    PRINT 'Índice idx_dependentes_responsavel criado.';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_historico_dependente')
BEGIN
    CREATE INDEX idx_historico_dependente ON historico_vacinacao_dependentes(dependente_id);
    PRINT 'Índice idx_historico_dependente criado.';
END
GO

-- Inserção de dados iniciais para testes
-- Limpar dados existentes antes de inserir novos
BEGIN TRY
    DELETE FROM estatisticas_vacinacao;
    DELETE FROM configuracoes_usuario;
    DELETE FROM historico_vacinacao;
    DELETE FROM credenciais;
    DELETE FROM usuarios WHERE id > 100; -- Preservar funcionários
    DELETE FROM usuarios WHERE id <= 100; -- Remover pacientes
    DELETE FROM vacinas;
    DELETE FROM locais_vacinacao;
    PRINT 'Dados existentes removidos.';
END TRY
BEGIN CATCH
    PRINT 'Erro ao limpar dados existentes. Continuando com a inserção...';
END CATCH
GO

-- Inserção de vacinas
SET IDENTITY_INSERT vacinas ON;
INSERT INTO vacinas (id, nome, fabricante, descricao, doses_recomendadas, categoria)
VALUES 
(1, 'COVID-19', 'Pfizer', 'Vacina contra o coronavírus', 2, 'obrigatória'),
(2, 'Influenza', 'Butantan', 'Vacina contra Influenza', 1, 'sazonal'),
(3, 'Febre Amarela', 'Bio-Manguinhos', 'Vacina contra Febre Amarela', 1, 'obrigatória'),
(4, 'Tríplice Viral', 'GSK', 'Vacina contra Sarampo, Caxumba e Rubéola', 2, 'obrigatória'),
(5, 'BCG', 'Fundação Ataulpho de Paiva', 'A vacina BCG (Bacilo de Calmette e Guérin) é indicada para prevenir as formas graves de Tuberculose', 1, 'obrigatória'),
(6, 'Hepatite A', 'GSK', 'Vacina contra Hepatite A', 1, 'obrigatória');
SET IDENTITY_INSERT vacinas OFF;
PRINT 'Dados de vacinas inseridos.';
GO

-- Inserção de locais de vacinação
SET IDENTITY_INSERT locais_vacinacao ON;
INSERT INTO locais_vacinacao (id, nome, endereco, cidade, estado, tipo, telefone)
VALUES 
(1, 'UBS Central', 'Av. Principal, 123', 'São Paulo', 'SP', 'posto de saúde', '(11) 3456-7890'),
(2, 'Hospital Municipal', 'Rua da Saúde, 456', 'Rio de Janeiro', 'RJ', 'hospital', '(21) 2345-6789'),
(3, 'Clínica Vacina Fácil', 'Rua Comercial, 789', 'Belo Horizonte', 'MG', 'clínica', '(31) 3456-7890');
SET IDENTITY_INSERT locais_vacinacao OFF;
PRINT 'Dados de locais de vacinação inseridos.';
GO

-- Inserção de usuários
SET IDENTITY_INSERT usuarios ON;
-- Inserção de usuário paciente
INSERT INTO usuarios (id, nome_completo, email, telefone, cpf, data_nascimento, tipo_usuario)
VALUES
(1, 'James Moraes', 'jamesmoraes@gmail.com', '11987654321', '111.222.333-44', '1992-08-25', 'Paciente');

-- Inserção de funcionários (enfermeiros)
INSERT INTO usuarios (id, nome_completo, email, telefone, cpf, tipo_usuario, cargo)
VALUES
(101, 'Maria Silva', 'maria.silva@ubs.gov.br', '(11) 98765-4321', '101.101.101-01', 'Funcionario', 'Enfermeira'),
(102, 'Stephanie Santos', 'stephanie.santos@ubs.gov.br', '(11) 91234-5678', '102.102.102-02', 'Funcionario', 'Enfermeira');
SET IDENTITY_INSERT usuarios OFF;
PRINT 'Dados de usuários inseridos.';
GO

-- Inserção de credenciais
INSERT INTO credenciais (usuario_id, senha_hash)
VALUES
(1, 'hash_senha_segura_1'),
(101, 'hash_senha_segura_101'),
(102, 'hash_senha_segura_102');
PRINT 'Dados de credenciais inseridos.';
GO

-- Inserção de histórico de vacinação
SET IDENTITY_INSERT historico_vacinacao ON;
INSERT INTO historico_vacinacao (id, paciente_id, funcionario_id, vacina_id, dose, data_aplicacao, lote)
VALUES
(1, 1, 102, 5, 'Dose Única', '1992-08-25', 'BCG92A'),
(2, 1, 101, 3, 'Dose Única', '2010-03-15', 'FA10B'),
(3, 1, 101, 2, 'Dose Anual', '2024-04-22', 'FLU24C'),
(4, 1, 102, 1, '1ª Dose', '2022-01-18', 'COV22D'),
(5, 1, 102, 1, '2ª Dose', '2022-04-18', 'COV22E'),
(6, 1, 101, 6, 'Dose Única', '1993-11-05', 'HEPA93F');
SET IDENTITY_INSERT historico_vacinacao OFF;
PRINT 'Dados de histórico de vacinação inseridos.';
GO

-- Inserção de configurações de usuário
INSERT INTO configuracoes_usuario (usuario_id, tema_escuro, notificacoes_ativas)
VALUES
(1, 1, 1);
PRINT 'Dados de configurações de usuário inseridos.';
GO

-- Inserção de estatísticas de vacinação
SET IDENTITY_INSERT estatisticas_vacinacao ON;
INSERT INTO estatisticas_vacinacao (id, vacina_id, regiao, faixa_etaria, total_doses, cobertura_percentual, periodo_inicio, periodo_fim)
VALUES
(1, 1, 'Sudeste', '18-59 anos', 15000000, 78.5, '2023-01-01', '2023-05-31'),
(2, 1, 'Nordeste', '18-59 anos', 8500000, 65.3, '2023-01-01', '2023-05-31'),
(3, 2, 'Nacional', 'Todas as idades', 12000000, 62.8, '2023-04-01', '2023-05-31'),
(4, 3, 'Nacional', 'Todas as idades', 35000000, 72.6, '2022-01-01', '2023-05-31'),
(5, 5, 'Nacional', '0-1 anos', 2800000, 95.2, '2022-01-01', '2023-05-31');
SET IDENTITY_INSERT estatisticas_vacinacao OFF;
PRINT 'Dados de estatísticas de vacinação inseridos.';
GO

PRINT 'Todos os scripts de criação foram executados com sucesso.';
GO