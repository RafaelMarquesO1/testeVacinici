-- Banco de Dados VaciniciBD (MySQL/MariaDB)
DROP DATABASE IF EXISTS VaciniciBD;
CREATE DATABASE VaciniciBD;
USE VaciniciBD;

-- Tabela de Usuários
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_completo VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  telefone VARCHAR(20),
  cpf VARCHAR(20) UNIQUE NOT NULL,
  data_nascimento DATE,
  genero VARCHAR(20),
  tipo_usuario VARCHAR(20) NOT NULL, -- 'Paciente' ou 'Funcionario'
  cargo VARCHAR(50), -- Para funcionários
  foto_perfil VARCHAR(255),
  data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Vacinas
CREATE TABLE vacinas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  fabricante VARCHAR(100),
  descricao TEXT,
  doses_recomendadas INT,
  intervalo_doses INT, -- em dias
  idade_minima INT, -- em meses
  idade_maxima INT, -- em meses
  categoria VARCHAR(50), -- obrigatória, opcional, sazonal
  imagem_url VARCHAR(255)
);

-- Tabela de Locais de Vacinação
CREATE TABLE locais_vacinacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  endereco VARCHAR(255) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  cep VARCHAR(10),
  telefone VARCHAR(20),
  horario_funcionamento VARCHAR(100),
  latitude FLOAT,
  longitude FLOAT,
  tipo VARCHAR(50) -- posto de saúde, hospital, clínica
);

-- Tabela de Histórico de Vacinação
CREATE TABLE historico_vacinacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL,
  funcionario_id INT NOT NULL,
  vacina_id INT NOT NULL,
  dose VARCHAR(50) NOT NULL,
  data_aplicacao DATE NOT NULL,
  lote VARCHAR(50) NOT NULL,
  validade DATE,
  local_id INT,
  comprovante_url VARCHAR(255),
  observacoes TEXT,
  FOREIGN KEY (paciente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (funcionario_id) REFERENCES usuarios(id),
  FOREIGN KEY (vacina_id) REFERENCES vacinas(id),
  FOREIGN KEY (local_id) REFERENCES locais_vacinacao(id)
);

-- Tabela de Logs de Acesso/Ações
CREATE TABLE logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  acao VARCHAR(255) NOT NULL,
  data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
  detalhes TEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Dados de teste
INSERT INTO usuarios (nome_completo, email, telefone, cpf, data_nascimento, tipo_usuario, cargo) VALUES
('James Moraes', 'jamesmoraes@gmail.com', '11987654321', '111.222.333-44', '1992-08-25', 'Paciente', NULL),
('Maria Silva', 'maria.silva@ubs.gov.br', '11987654322', '101.101.101-01', '1980-05-10', 'Funcionario', 'Enfermeira'),
('Stephanie Santos', 'stephanie.santos@ubs.gov.br', '11987654323', '102.102.102-02', '1985-09-15', 'Funcionario', 'Enfermeira');

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

INSERT INTO historico_vacinacao (paciente_id, funcionario_id, vacina_id, dose, data_aplicacao, lote, local_id) VALUES
(1, 2, 5, 'Dose Única', '1992-08-25', 'BCG92A', 1),
(1, 2, 3, 'Dose Única', '2010-03-15', 'FA10B', 2),
(1, 3, 2, 'Dose Anual', '2024-04-22', 'FLU24C', 2),
(1, 2, 1, '1ª Dose', '2022-01-18', 'COV22D', 1),
(1, 2, 1, '2ª Dose', '2022-04-18', 'COV22E', 1),
(1, 3, 6, 'Dose Única', '1993-11-05', 'HEPA93F', 3);

INSERT INTO logs (usuario_id, acao, detalhes) VALUES
(1, 'Login', 'Usuário realizou login no sistema');


// Só pra anotar!
// cd backend
// node index.js