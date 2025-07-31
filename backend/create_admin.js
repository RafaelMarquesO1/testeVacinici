const sql = require('mssql');
require('dotenv').config();

const config = {
  server: 'localhost',
  database: 'VaciniciBD',
  user: 'sa',
  password: '@ITB123456',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    trustedConnection: false
  }
};

async function createAdminUser() {
  try {
    console.log('🔌 Conectando ao banco de dados...');
    const pool = await sql.connect(config);
    console.log('✅ Conectado com sucesso!');
    
    // Verificar se o usuário já existe
    console.log('🔍 Verificando se o usuário administrador já existe...');
    const checkUser = await pool.request()
      .query("SELECT * FROM usuarios WHERE email = 'admin@vacinici.com'");
    
    if (checkUser.recordset.length > 0) {
      console.log('ℹ️ Usuário administrador já existe!');
      return;
    }
    
    console.log('➕ Inserindo usuário administrador...');
    // Inserir usuário administrador
    const insertUser = await pool.request()
      .query(`
        INSERT INTO usuarios (nome_completo, email, telefone, cpf, data_nascimento, tipo_usuario, cargo) 
        VALUES ('Administrador Sistema', 'admin@vacinici.com', '11999999999', '999.999.999-99', '1990-01-01', 'Funcionario', 'Administrador');
        SELECT SCOPE_IDENTITY() as id;
      `);
    
    const userId = insertUser.recordset[0].id;
    console.log(`✅ Usuário criado com ID: ${userId}`);
    
    // Inserir credenciais
    console.log('🔐 Inserindo credenciais...');
    await pool.request()
      .query(`INSERT INTO credenciais (usuario_id, senha_hash) VALUES (${userId}, 'admin123')`);
    
    console.log('✅ Usuário administrador criado com sucesso!');
    console.log('📧 Email: admin@vacinici.com');
    console.log('🔑 Senha: admin123');
    
    // Verificar se foi criado
    console.log('🔍 Verificando criação...');
    const verifyUser = await pool.request()
      .query(`
        SELECT u.id, u.nome_completo, u.email, u.cargo, c.senha_hash 
        FROM usuarios u 
        JOIN credenciais c ON u.id = c.usuario_id 
        WHERE u.email = 'admin@vacinici.com'
      `);
    
    console.log('✅ Verificação:', verifyUser.recordset[0]);
    
  } catch (err) {
    console.error('❌ Erro ao criar usuário administrador:', err.message);
    console.error('Detalhes:', err);
  } finally {
    await sql.close();
  }
}

createAdminUser(); 