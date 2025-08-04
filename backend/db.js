const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'VaciniciBD',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASS || '@ITB123456',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

const executeQuery = async (query, params = []) => {
  try {
    console.log('Executando query:', query);
    console.log('Parâmetros:', params);
    
    const pool = await sql.connect(config);
    const request = pool.request();
    
    params.forEach((param, index) => {
      request.input(`param${index + 1}`, param);
    });
    
    const result = await request.query(query);
    console.log('Resultado da query:', result);
    return result.recordset || result;
  } catch (err) {
    console.error('Erro na consulta:', err);
    throw err;
  }
};

module.exports = { executeQuery };