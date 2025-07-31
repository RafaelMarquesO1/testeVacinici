const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'VaciniciBD',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASS || '@ITB123456',
  options: {
    encrypt: false, // Para desenvolvimento local
    trustServerCertificate: true, // Para desenvolvimento local
    enableArithAbort: true,
    trustedConnection: false // Desabilitar para usar SQL Server auth
  }
};

// Função para executar queries
const executeQuery = async (query, params = []) => {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    
    // Adicionar parâmetros se fornecidos
    params.forEach((param, index) => {
      request.input(`param${index + 1}`, param);
    });
    
    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('Erro na consulta:', err);
    throw err;
  }
};

module.exports = { executeQuery };