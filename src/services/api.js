// Serviço de API para interagir com o backend
// Este arquivo simula chamadas de API para o banco de dados VaciniciBD

// Simulação de dados baseados na estrutura do banco de dados
const mockData = {
  usuarios: [
    { 
      id: 1, 
      nome_completo: 'Ana Carolina Silva', 
      email: 'ana.silva@email.com', 
      telefone: '(11) 98765-4321', 
      cpf: '111.222.333-44', 
      data_nascimento: '1990-05-15', 
      genero: 'Feminino', 
      tipo_usuario: 'Paciente',
      foto_perfil: 'https://placehold.co/40x40/E0F2F1/2A9D8F?text=A',
      data_cadastro: '2023-01-15'
    },
    { 
      id: 2, 
      nome_completo: 'Bruno Costa Lima', 
      email: 'bruno.lima@email.com', 
      telefone: '(11) 91234-5678', 
      cpf: '222.333.444-55', 
      data_nascimento: '1985-11-20', 
      genero: 'Masculino', 
      tipo_usuario: 'Paciente',
      foto_perfil: 'https://placehold.co/40x40/E0F2F1/2A9D8F?text=B',
      data_cadastro: '2023-02-10'
    },
    { 
      id: 3, 
      nome_completo: 'Carla Dias Souza', 
      email: 'carla.souza@email.com', 
      telefone: '(11) 92345-6789', 
      cpf: '333.444.555-66', 
      data_nascimento: '2001-02-10', 
      genero: 'Feminino', 
      tipo_usuario: 'Paciente',
      foto_perfil: 'https://placehold.co/40x40/E0F2F1/2A9D8F?text=C',
      data_cadastro: '2023-03-05'
    },
    { 
      id: 4, 
      nome_completo: 'Daniel Farias', 
      email: 'daniel.farias@email.com', 
      telefone: '(11) 93456-7890', 
      cpf: '444.555.666-77', 
      data_nascimento: '1978-07-30', 
      genero: 'Masculino', 
      tipo_usuario: 'Paciente',
      foto_perfil: 'https://placehold.co/40x40/E0F2F1/2A9D8F?text=D',
      data_cadastro: '2023-04-20'
    },
    { 
      id: 101, 
      nome_completo: 'Dr. Ricardo Borges', 
      email: 'ricardo.b@email.com', 
      telefone: '(11) 94567-8901', 
      cpf: '555.666.777-88', 
      data_nascimento: '1975-03-25', 
      genero: 'Masculino', 
      tipo_usuario: 'Funcionario',
      cargo: 'Administrador',
      foto_perfil: 'https://placehold.co/40x40/D1FAE5/264653?text=R',
      data_cadastro: '2022-12-01'
    },
    { 
      id: 102, 
      nome_completo: 'Enf.ª Mariana Lima', 
      email: 'mariana.l@email.com', 
      telefone: '(11) 95678-9012', 
      cpf: '666.777.888-99', 
      data_nascimento: '1988-09-12', 
      genero: 'Feminino', 
      tipo_usuario: 'Funcionario',
      cargo: 'Enfermeira',
      foto_perfil: 'https://placehold.co/40x40/D1FAE5/264653?text=M',
      data_cadastro: '2023-01-10'
    }
  ],
  
  vacinas: [
    {
      id: 1,
      nome: 'COVID-19',
      fabricante: 'Pfizer',
      descricao: 'Vacina contra o coronavírus SARS-CoV-2',
      doses_recomendadas: 2,
      intervalo_doses: 21,
      idade_minima: 60, // 5 anos em meses
      idade_maxima: null,
      categoria: 'obrigatória',
      imagem_url: 'https://placehold.co/100x100/E0F2F1/2A9D8F?text=COVID'
    },
    {
      id: 2,
      nome: 'Gripe',
      fabricante: 'Butantan',
      descricao: 'Vacina contra o vírus Influenza',
      doses_recomendadas: 1,
      intervalo_doses: null,
      idade_minima: 6,
      idade_maxima: null,
      categoria: 'sazonal',
      imagem_url: 'https://placehold.co/100x100/E0F2F1/2A9D8F?text=GRIPE'
    },
    {
      id: 3,
      nome: 'Febre Amarela',
      fabricante: 'Bio-Manguinhos',
      descricao: 'Vacina contra o vírus da febre amarela',
      doses_recomendadas: 1,
      intervalo_doses: null,
      idade_minima: 9,
      idade_maxima: null,
      categoria: 'obrigatória',
      imagem_url: 'https://placehold.co/100x100/E0F2F1/2A9D8F?text=FA'
    },
    {
      id: 4,
      nome: 'BCG',
      fabricante: 'Fundação Ataulpho de Paiva',
      descricao: 'Vacina contra formas graves de tuberculose',
      doses_recomendadas: 1,
      intervalo_doses: null,
      idade_minima: 0,
      idade_maxima: 5,
      categoria: 'obrigatória',
      imagem_url: 'https://placehold.co/100x100/E0F2F1/2A9D8F?text=BCG'
    }
  ],
  
  locais_vacinacao: [
    {
      id: 1,
      nome: 'UBS Central',
      endereco: 'Rua Principal, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01001-000',
      telefone: '(11) 3333-4444',
      horario_funcionamento: 'Segunda a Sexta, 8h às 17h',
      latitude: -23.550520,
      longitude: -46.633308,
      tipo: 'posto de saúde'
    },
    {
      id: 2,
      nome: 'Hospital Municipal',
      endereco: 'Av. da Saúde, 500',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01002-000',
      telefone: '(11) 3333-5555',
      horario_funcionamento: 'Todos os dias, 24h',
      latitude: -23.557920,
      longitude: -46.639818,
      tipo: 'hospital'
    }
  ],
  
  historico_vacinacao: [
    {
      id: 1,
      paciente_id: 1,
      funcionario_id: 102,
      vacina_id: 1,
      dose: '2ª Dose',
      data_aplicacao: '2023-12-10',
      lote: 'PF123456',
      validade: '2024-06-30',
      local_id: 1,
      comprovante_url: 'https://example.com/comprovante1.pdf',
      observacoes: 'Sem reações adversas'
    },
    {
      id: 2,
      paciente_id: 1,
      funcionario_id: 102,
      vacina_id: 2,
      dose: 'Dose Única',
      data_aplicacao: '2024-04-22',
      lote: 'BT789012',
      validade: '2024-12-31',
      local_id: 1,
      comprovante_url: 'https://example.com/comprovante2.pdf',
      observacoes: 'Paciente relatou leve dor no local da aplicação'
    },
    {
      id: 3,
      paciente_id: 2,
      funcionario_id: 102,
      vacina_id: 3,
      dose: 'Dose Única',
      data_aplicacao: '2024-03-15',
      lote: 'BM456789',
      validade: '2025-03-15',
      local_id: 2,
      comprovante_url: 'https://example.com/comprovante3.pdf',
      observacoes: ''
    }
  ],
  
  agendamentos: [
    {
      id: 1,
      paciente_id: 3,
      vacina_id: 1,
      dose: '1ª Dose',
      data_hora: '2024-05-20T10:00:00',
      local_id: 1,
      status: 'agendado',
      notificacao_enviada: true
    },
    {
      id: 2,
      paciente_id: 4,
      vacina_id: 2,
      dose: 'Dose Única',
      data_hora: '2024-05-22T14:30:00',
      local_id: 1,
      status: 'agendado',
      notificacao_enviada: true
    }
  ],
  
  dependentes: [
    {
      id: 1,
      responsavel_id: 1,
      nome_completo: 'Pedro Silva',
      data_nascimento: '2020-03-10',
      genero: 'Masculino',
      cpf: '111.222.333-45',
      foto_perfil: 'https://placehold.co/40x40/E0F2F1/2A9D8F?text=P'
    },
    {
      id: 2,
      responsavel_id: 2,
      nome_completo: 'Laura Lima',
      data_nascimento: '2021-07-15',
      genero: 'Feminino',
      cpf: '222.333.444-56',
      foto_perfil: 'https://placehold.co/40x40/E0F2F1/2A9D8F?text=L'
    }
  ],
  
  historico_vacinacao_dependentes: [
    {
      id: 1,
      dependente_id: 1,
      funcionario_id: 102,
      vacina_id: 4,
      dose: 'Dose Única',
      data_aplicacao: '2020-03-15',
      lote: 'FAP123456',
      validade: '2021-03-15',
      local_id: 2,
      comprovante_url: 'https://example.com/comprovante_dep1.pdf',
      observacoes: 'Aplicação realizada 5 dias após o nascimento'
    }
  ],
  
  estatisticas_vacinacao: [
    {
      id: 1,
      vacina_id: 4,
      regiao: 'Sudeste',
      faixa_etaria: '0-1 ano',
      total_doses: 12500,
      cobertura_percentual: 92.5,
      periodo_inicio: '2023-01-01',
      periodo_fim: '2023-12-31'
    },
    {
      id: 2,
      vacina_id: 1,
      regiao: 'Sudeste',
      faixa_etaria: 'Todas',
      total_doses: 45000,
      cobertura_percentual: 87.3,
      periodo_inicio: '2023-01-01',
      periodo_fim: '2023-12-31'
    }
  ]
};

// Funções de API simuladas
export const api = {
  // Usuários
  getUsuarios: () => {
    return Promise.resolve(mockData.usuarios);
  },
  
  getUsuarioById: (id) => {
    const usuario = mockData.usuarios.find(u => u.id === parseInt(id));
    return Promise.resolve(usuario || null);
  },
  
  getPacientes: () => {
    return Promise.resolve(mockData.usuarios.filter(u => u.tipo_usuario === 'Paciente'));
  },
  
  getFuncionarios: () => {
    return Promise.resolve(mockData.usuarios.filter(u => u.tipo_usuario === 'Funcionario'));
  },
  
  createUsuario: (usuario) => {
    const newId = Math.max(...mockData.usuarios.map(u => u.id)) + 1;
    const newUsuario = { ...usuario, id: newId, data_cadastro: new Date().toISOString().split('T')[0] };
    mockData.usuarios.push(newUsuario);
    return Promise.resolve(newUsuario);
  },
  
  updateUsuario: (id, usuario) => {
    const index = mockData.usuarios.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
      mockData.usuarios[index] = { ...mockData.usuarios[index], ...usuario };
      return Promise.resolve(mockData.usuarios[index]);
    }
    return Promise.reject(new Error('Usuário não encontrado'));
  },
  
  deleteUsuario: (id) => {
    const index = mockData.usuarios.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
      mockData.usuarios.splice(index, 1);
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error('Usuário não encontrado'));
  },
  
  // Vacinas
  getVacinas: () => {
    return Promise.resolve(mockData.vacinas);
  },
  
  getVacinaById: (id) => {
    const vacina = mockData.vacinas.find(v => v.id === parseInt(id));
    return Promise.resolve(vacina || null);
  },
  
  // Locais de Vacinação
  getLocaisVacinacao: () => {
    return Promise.resolve(mockData.locais_vacinacao);
  },
  
  // Histórico de Vacinação
  getHistoricoVacinacao: (pacienteId) => {
    if (pacienteId) {
      return Promise.resolve(mockData.historico_vacinacao.filter(h => h.paciente_id === parseInt(pacienteId)));
    }
    return Promise.resolve(mockData.historico_vacinacao);
  },
  
  addVacinacao: (vacinacao) => {
    const newId = Math.max(...mockData.historico_vacinacao.map(h => h.id)) + 1;
    const newVacinacao = { ...vacinacao, id: newId };
    mockData.historico_vacinacao.push(newVacinacao);
    return Promise.resolve(newVacinacao);
  },
  
  // Agendamentos
  getAgendamentos: (pacienteId) => {
    if (pacienteId) {
      return Promise.resolve(mockData.agendamentos.filter(a => a.paciente_id === parseInt(pacienteId)));
    }
    return Promise.resolve(mockData.agendamentos);
  },
  
  createAgendamento: (agendamento) => {
    const newId = Math.max(...mockData.agendamentos.map(a => a.id)) + 1;
    const newAgendamento = { ...agendamento, id: newId, notificacao_enviada: false };
    mockData.agendamentos.push(newAgendamento);
    return Promise.resolve(newAgendamento);
  },
  
  updateAgendamento: (id, agendamento) => {
    const index = mockData.agendamentos.findIndex(a => a.id === parseInt(id));
    if (index !== -1) {
      mockData.agendamentos[index] = { ...mockData.agendamentos[index], ...agendamento };
      return Promise.resolve(mockData.agendamentos[index]);
    }
    return Promise.reject(new Error('Agendamento não encontrado'));
  },
  
  // Dependentes
  getDependentes: (responsavelId) => {
    if (responsavelId) {
      return Promise.resolve(mockData.dependentes.filter(d => d.responsavel_id === parseInt(responsavelId)));
    }
    return Promise.resolve(mockData.dependentes);
  },
  
  // Histórico de Vacinação de Dependentes
  getHistoricoVacinacaoDependente: (dependenteId) => {
    if (dependenteId) {
      return Promise.resolve(mockData.historico_vacinacao_dependentes.filter(h => h.dependente_id === parseInt(dependenteId)));
    }
    return Promise.resolve(mockData.historico_vacinacao_dependentes);
  },
  
  // Estatísticas
  getEstatisticas: () => {
    return Promise.resolve(mockData.estatisticas_vacinacao);
  },
  
  // Autenticação simulada
  login: (email, senha) => {
    const usuario = mockData.usuarios.find(u => u.email === email);
    if (usuario) {
      // Simulando verificação de senha (em um sistema real, seria feito com hash)
      return Promise.resolve({
        success: true,
        user: {
          id: usuario.id,
          nome: usuario.nome_completo,
          email: usuario.email,
          tipo: usuario.tipo_usuario,
          cargo: usuario.cargo,
          foto: usuario.foto_perfil
        },
        token: 'token-simulado-' + Math.random().toString(36).substring(2)
      });
    }
    return Promise.reject(new Error('Credenciais inválidas'));
  }
};