SET XACT_ABORT ON;
GO


BEGIN TRANSACTION;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'VaciniciDB')
BEGIN
    CREATE DATABASE VaciniciDB;
END
GO

USE VaciniciDB;
GO


-- TABELA DE FUNCIONÁRIOS (USUÁRIOS DO SISTEMA)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Funcionarios]') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.Funcionarios (
        FuncionarioID INT IDENTITY(1,1) NOT NULL, -- Chave primária com auto-incremento
        NomeCompleto NVARCHAR(150) NOT NULL,      -- Nome completo do funcionário
        Email NVARCHAR(100) NOT NULL,              
        SenhaHash NVARCHAR(256) NOT NULL,          
        Cargo NVARCHAR(50) NOT NULL,               -- Ex: 'Administrador', 'Enfermeira'
        Ativo BIT NOT NULL CONSTRAINT DF_Funcionarios_Ativo DEFAULT 1, -- Flag para ativar/desativar acesso (1 = Ativo, 0 = Inativo)
        DataCadastro DATETIME2 NOT NULL CONSTRAINT DF_Funcionarios_DataCadastro DEFAULT GETDATE(), -- Data de criação do registro

        CONSTRAINT PK_Funcionarios PRIMARY KEY CLUSTERED (FuncionarioID ASC),
        CONSTRAINT UQ_Funcionarios_Email UNIQUE (Email)
    );
    PRINT 'Tabela [Funcionarios] criada com sucesso.';
END
GO


-- TABELA DE PACIENTES
-- Armazena as informações básicas dos pacientes.
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Pacientes]') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.Pacientes (
        PacienteID INT IDENTITY(1,1) NOT NULL,
        NomeCompleto NVARCHAR(150) NOT NULL,
        DataNascimento DATE NOT NULL,
        CPF VARCHAR(14) NOT NULL, -- Formato 'XXX.XXX.XXX-XX'
        Contato NVARCHAR(100) NULL, -- Telefone ou email de contato (opcional)
        DataCadastro DATETIME2 NOT NULL CONSTRAINT DF_Pacientes_DataCadastro DEFAULT GETDATE(),

        CONSTRAINT PK_Pacientes PRIMARY KEY CLUSTERED (PacienteID ASC),
        CONSTRAINT UQ_Pacientes_CPF UNIQUE (CPF)
    );
    PRINT 'Tabela [Pacientes] criada com sucesso.';
END
GO


-- TABELA DE VACINAS (CATÁLOGO)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Vacinas]') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.Vacinas (
        VacinaID INT IDENTITY(1,1) NOT NULL,
        NomeVacina NVARCHAR(100) NOT NULL, -- Ex: 'COVID-19 Pfizer', 'Febre Amarela'
        Descricao NVARCHAR(500) NULL,      -- Informações adicionais sobre a vacina
        
        CONSTRAINT PK_Vacinas PRIMARY KEY CLUSTERED (VacinaID ASC),
        CONSTRAINT UQ_Vacinas_NomeVacina UNIQUE (NomeVacina)
    );
    PRINT 'Tabela [Vacinas] criada com sucesso.';
END
GO


-- TABELA DE HISTÓRICO DE VACINAS
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[HistoricoVacinas]') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.HistoricoVacinas (
        HistoricoID BIGINT IDENTITY(1,1) NOT NULL,
        PacienteID INT NOT NULL,
        VacinaID INT NOT NULL,
        FuncionarioID INT NOT NULL, -- ID do funcionário que aplicou a vacina
        DataAplicacao DATETIME2 NOT NULL,
        Dose NVARCHAR(50) NOT NULL, -- Ex: '1ª Dose', 'Dose Única', 'Reforço'
        Lote NVARCHAR(50) NOT NULL, -- Lote da vacina para rastreabilidade

        CONSTRAINT PK_HistoricoVacinas PRIMARY KEY CLUSTERED (HistoricoID ASC),
        
        -- Chave estrangeira para Pacientes
        CONSTRAINT FK_HistoricoVacinas_Pacientes FOREIGN KEY (PacienteID)
        REFERENCES dbo.Pacientes (PacienteID)
        ON DELETE CASCADE, -- Se um paciente for excluído, seu histórico também será.

        -- Chave estrangeira para Vacinas
        CONSTRAINT FK_HistoricoVacinas_Vacinas FOREIGN KEY (VacinaID)
        REFERENCES dbo.Vacinas (VacinaID),

        -- Chave estrangeira para Funcionarios
        CONSTRAINT FK_HistoricoVacinas_Funcionarios FOREIGN KEY (FuncionarioID)
        REFERENCES dbo.Funcionarios (FuncionarioID)
    );
    PRINT 'Tabela [HistoricoVacinas] criada com sucesso.';
END
GO



-- INSERÇÃO DE DADOS DE TESTE

-- Inserir Funcionários de exemplo
IF (SELECT COUNT(*) FROM dbo.Funcionarios) = 0
BEGIN
    PRINT 'Inserindo dados de exemplo em [Funcionarios]...';
    INSERT INTO dbo.Funcionarios (NomeCompleto, Email, SenhaHash, Cargo, Ativo) VALUES
    (N'Dr. Ricardo Borges', N'ricardo.b@email.com', N'SegrobOdracir@123', N'Administrador', 1),
    (N'Enf.ª Mariana Lima', N'mariana.l@email.com', N'MarianaLima20202#', N'Enfermeira', 1);
END
GO

-- Inserir catálogo de Vacinas
IF (SELECT COUNT(*) FROM dbo.Vacinas) = 0
BEGIN
    PRINT 'Inserindo dados de exemplo em [Vacinas]...';
    INSERT INTO dbo.Vacinas (NomeVacina, Descricao) VALUES
    (N'COVID-19 Pfizer', N'Vacina de mRNA contra o SARS-CoV-2.'),
    (N'Gripe (Influenza)', N'Vacina tetravalente contra o vírus da gripe.'),
    (N'Febre Amarela', N'Vacina de vírus vivo atenuado.'),
    (N'BCG', N'Vacina contra a tuberculose.');
END
GO

COMMIT TRANSACTION;
GO

PRINT 'Script executado com sucesso. Banco de dados VaciniciDB está pronto.';
GO
