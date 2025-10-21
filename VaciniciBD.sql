USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = 'VaciniciBD')
    DROP DATABASE VaciniciBD;
GO

CREATE DATABASE VaciniciBD;
GO

USE VaciniciBD;
GO

-- Tabela de Usuários
CREATE TABLE usuarios (
  id BIGINT IDENTITY(1,1) PRIMARY KEY,
  nome_completo NVARCHAR(100) NOT NULL,
  email NVARCHAR(100) UNIQUE,
  telefone NVARCHAR(20),
  cpf NVARCHAR(20) UNIQUE NOT NULL,
  data_nascimento DATE,
  genero NVARCHAR(20),
  tipo_usuario NVARCHAR(20) NOT NULL, -- 'Paciente', 'Funcionario', 'Administrador'
  cargo NVARCHAR(50), -- Para funcionários: 'Enfermeiro', 'Médico', 'Técnico em Enfermagem', 'Administrador'
  nivel_permissao INT DEFAULT 1, -- 1=Paciente, 2=Técnico, 3=Enfermeiro, 4=Médico, 5=Administrador
  foto_perfil NVARCHAR(255),
  data_cadastro DATETIME2 DEFAULT GETDATE(),
  senha NVARCHAR(255) NOT NULL
);

-- Tabela de Vacinas
CREATE TABLE vacinas (
  id BIGINT IDENTITY(1,1) PRIMARY KEY,
  nome NVARCHAR(100) NOT NULL,
  fabricante NVARCHAR(100),
  descricao NTEXT,
  doses_recomendadas INT,
  intervalo_doses INT, -- em dias
  idade_minima INT, -- em meses
  idade_maxima INT, -- em meses
  categoria NVARCHAR(50), -- obrigatória, opcional, sazonal
  imagem_url NVARCHAR(255)
);

-- Tabela de Locais de Vacinação
CREATE TABLE locais_vacinacao (
  id BIGINT IDENTITY(1,1) PRIMARY KEY,
  nome NVARCHAR(100) NOT NULL,
  endereco NVARCHAR(255) NOT NULL,
  cidade NVARCHAR(100) NOT NULL,
  estado NVARCHAR(2) NOT NULL,
  cep NVARCHAR(10),
  telefone NVARCHAR(20),
  horario_funcionamento NVARCHAR(100),
  latitude FLOAT,
  longitude FLOAT,
  tipo NVARCHAR(50) -- posto de saúde, hospital, clínica
);

-- Tabela de Agendamentos
CREATE TABLE agendamentos (
  id BIGINT IDENTITY(1,1) PRIMARY KEY,
  paciente_id BIGINT NOT NULL,
  vacina_id BIGINT NOT NULL,
  local_id BIGINT NOT NULL,
  data_agendamento DATETIME2 NOT NULL,
  status NVARCHAR(20) DEFAULT 'Agendado', -- 'Agendado', 'Confirmado', 'Cancelado', 'Faltou'
  data_criacao DATETIME2 DEFAULT GETDATE(),
  motivo_cancelamento NVARCHAR(255),
  FOREIGN KEY (paciente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (vacina_id) REFERENCES vacinas(id),
  FOREIGN KEY (local_id) REFERENCES locais_vacinacao(id)
);

-- Tabela de Histórico de Vacinação
CREATE TABLE historico_vacinacao (
  id BIGINT IDENTITY(1,1) PRIMARY KEY,
  paciente_id BIGINT NOT NULL,
  funcionario_id BIGINT NOT NULL,
  vacina_id BIGINT NOT NULL,
  dose NVARCHAR(50) NOT NULL,
  data_aplicacao DATE NOT NULL,
  lote NVARCHAR(50) NOT NULL,
  validade DATE,
  local_id BIGINT,
  comprovante_url NVARCHAR(255),
  observacoes NTEXT,
  FOREIGN KEY (paciente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (funcionario_id) REFERENCES usuarios(id),
  FOREIGN KEY (vacina_id) REFERENCES vacinas(id),
  FOREIGN KEY (local_id) REFERENCES locais_vacinacao(id)
);

-- Tabela de Logs de Acesso/Ações
CREATE TABLE logs (
  id BIGINT IDENTITY(1,1) PRIMARY KEY,
  usuario_id BIGINT,
  acao NVARCHAR(255) NOT NULL,
  data_hora DATETIME2 DEFAULT GETDATE(),
  detalhes NTEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Dados de teste
INSERT INTO usuarios (nome_completo, email, telefone, cpf, data_nascimento, tipo_usuario, cargo, nivel_permissao, senha) VALUES
('James Moraes', 'jamesmoraes@gmail.com', '11987654321', '111.222.333-44', '1992-08-25', 'Paciente', NULL, 1, 'james123456'),
('Maria Silva', 'maria.silva@ubs.gov.br', '11987654322', '101.101.101-01', '1980-05-10', 'Funcionario', 'Enfermeiro', 3, 'admin123456'),
('Stephanie Santos', 'stephanie.santos@ubs.gov.br', '11987654323', '102.102.102-02', '1985-09-15', 'Funcionario', 'Enfermeiro', 3, 'Santos44444'),
('Dr. Carlos Mendes', 'carlos.mendes@ubs.gov.br', '11987654324', '103.103.103-03', '1975-03-20', 'Funcionario', 'Médico', 4, 'medico123'),
('Admin Sistema', 'admin@vacinici.com', '11987654325', '104.104.104-04', '1970-01-01', 'Administrador', 'Administrador', 5, 'admin123');

INSERT INTO vacinas (nome, fabricante, descricao, doses_recomendadas, categoria) VALUES
('COVID-19', 'Pfizer', 'Vacina contra o coronavírus', 2, 'obrigatória'),
('Influenza', 'Butantan', 'Vacina contra Influenza', 1, 'sazonal'),
('Febre Amarela', 'Bio-Manguinhos', 'Vacina contra Febre Amarela', 1, 'obrigatória'),
('Tríplice Viral', 'GSK', 'Vacina contra Sarampo, Caxumba e Rubéola', 2, 'obrigatória'),
('BCG', 'Fundação Ataulpho de Paiva', 'Previne formas graves de Tuberculose', 1, 'obrigatória'),
('Hepatite A', 'GSK', 'Vacina contra Hepatite A', 1, 'obrigatória');

INSERT INTO locais_vacinacao (nome, endereco, cidade, estado, tipo, telefone) VALUES
('UBS Central', 'Av. Principal, 123', 'São Paulo', 'SP', 'posto de saúde', '1134567890'),
('Hospital Municipal', 'Rua da Saúde, 456', 'Rio de Janeiro', 'RJ', 'hospital', '2123456789'),
('Clínica Vacina Fácil', 'Rua Comercial, 789', 'Belo Horizonte', 'MG', 'clínica', '3134567890');

-- Dados de agendamentos de teste
INSERT INTO agendamentos (paciente_id, vacina_id, local_id, data_agendamento, status) VALUES
(1, 1, 1, '2024-12-20 09:00:00', 'Agendado'),
(1, 2, 2, '2024-12-22 14:30:00', 'Confirmado');

INSERT INTO historico_vacinacao (paciente_id, funcionario_id, vacina_id, dose, data_aplicacao, lote, local_id) VALUES
(1, 2, 5, 'Dose Única', '1992-08-25', 'BCG92A', 1),
(1, 2, 3, 'Dose Única', '2010-03-15', 'FA10B', 2),
(1, 3, 2, 'Dose Anual', '2024-04-22', 'FLU24C', 2),
(1, 2, 1, '1ª Dose', '2022-01-18', 'COV22D', 1),
(1, 2, 1, '2ª Dose', '2022-04-18', 'COV22E', 1),
(1, 3, 6, 'Dose Única', '1993-11-05', 'HEPA93F', 3);

INSERT INTO logs (usuario_id, acao, detalhes) VALUES
(1, 'Login', 'Usuário realizou login no sistema');

GO