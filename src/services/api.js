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

// Funções de API para o backend Spring Boot
export const api = {
  // Usuários
  getUsuarios: async () => {
    const res = await fetch('http://localhost:8080/api/usuarios');
    return res.json();
  },
  getUsuarioById: async (id) => {
    const res = await fetch(`http://localhost:8080/api/usuarios/${id}`);
    return res.json();
  },
  createUsuario: async (usuario) => {
    const res = await fetch('http://localhost:8080/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });
    return res.json();
  },
  updateUsuario: async (id, usuario) => {
    const res = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });
    return res.json();
  },
  deleteUsuario: async (id) => {
    const res = await fetch(`http://localhost:8080/api/usuarios/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error(`Erro ao deletar usuário: ${res.status}`);
    }
    // DELETE pode retornar 200 ou 204, verifica se há conteúdo para fazer parse
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return res.json();
    }
    return {}; // Retorna objeto vazio se não houver JSON
  },

  // Vacinas
  getVacinas: async () => {
    const res = await fetch('http://localhost:8080/api/vacinas');
    return res.json();
  },
  getVacinaById: async (id) => {
    const res = await fetch(`http://localhost:8080/api/vacinas/${id}`);
    return res.json();
  },
  createVacina: async (vacina) => {
    const res = await fetch('http://localhost:8080/api/vacinas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vacina)
    });
    return res.json();
  },
  updateVacina: async (id, vacina) => {
    const res = await fetch(`http://localhost:8080/api/vacinas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vacina)
    });
    return res.json();
  },
  deleteVacina: async (id) => {
    const res = await fetch(`http://localhost:8080/api/vacinas/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error(`Erro ao deletar vacina: ${res.status}`);
    }
    return res.status === 204 ? {} : res.json();
  },

  // Locais de Vacinação
  getLocaisVacinacao: async () => {
    const res = await fetch('http://localhost:8080/api/locais');
    return res.json();
  },
  getLocalById: async (id) => {
    const res = await fetch(`http://localhost:8080/api/locais/${id}`);
    return res.json();
  },
  createLocal: async (local) => {
    const res = await fetch('http://localhost:8080/api/locais', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(local)
    });
    return res.json();
  },
  updateLocal: async (id, local) => {
    const res = await fetch(`http://localhost:8080/api/locais/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(local)
    });
    return res.json();
  },
  deleteLocal: async (id) => {
    const res = await fetch(`http://localhost:8080/api/locais/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error(`Erro ao deletar local: ${res.status}`);
    }
    return res.status === 204 ? {} : res.json();
  },



  // Histórico de Vacinação
  getHistoricoVacinacao: async (paciente_id) => {
    let url = 'http://localhost:8080/api/historico';
    if (paciente_id) url += `/paciente/${paciente_id}`;
    const res = await fetch(url);
    return res.json();
  },
  getHistoricoById: async (id) => {
    const res = await fetch(`http://localhost:8080/api/historico/${id}`);
    return res.json();
  },
  createHistorico: async (registro) => {
    const res = await fetch('http://localhost:8080/api/historico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registro)
    });
    return res.json();
  },
  updateHistorico: async (id, registro) => {
    const res = await fetch(`http://localhost:8080/api/historico/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registro)
    });
    return res.json();
  },
  deleteHistorico: async (id) => {
    const res = await fetch(`http://localhost:8080/api/historico/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error(`Erro ao deletar histórico: ${res.status}`);
    }
    return res.status === 204 ? {} : res.json();
  },

  // Agendamentos
  getAgendamentos: async () => {
    const res = await fetch('http://localhost:8080/api/agendamentos');
    return res.json();
  },
  getAgendamentoById: async (id) => {
    const res = await fetch(`http://localhost:8080/api/agendamentos/${id}`);
    return res.json();
  },
  createAgendamento: async (agendamento) => {
    const res = await fetch('http://localhost:8080/api/agendamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agendamento)
    });
    return res.json();
  },
  updateAgendamentoStatus: async (id, status, dose, motivoCancelamento) => {
    const body = { status };
    if (dose !== undefined) body.dose = dose;
    if (motivoCancelamento) body.motivoCancelamento = motivoCancelamento;
    
    const res = await fetch(`http://localhost:8080/api/agendamentos/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    // Se o status for 'realizado', criar registro no histórico
    if (status === 'realizado') {
      try {
        const agendamentoRes = await fetch(`http://localhost:8080/api/agendamentos/${id}`);
        const agendamento = await agendamentoRes.json();
        
        // Buscar dados completos do agendamento
        const vacina = await fetch(`http://localhost:8080/api/vacinas/${agendamento.vacinaId}`).then(r => r.json()).catch(() => null);
        const local = await fetch(`http://localhost:8080/api/locais/${agendamento.localId}`).then(r => r.json()).catch(() => null);
        
        const historicoData = {
          pacienteId: agendamento.pacienteId,
          funcionarioId: agendamento.funcionarioId || 1,
          vacinaId: agendamento.vacinaId,
          dose: dose || agendamento.dose || 'Dose única',
          dataAplicacao: new Date().toISOString().split('T')[0],
          lote: `LT${Date.now()}`,
          validade: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          localId: agendamento.localId || 1,
          observacoes: 'Vacinação realizada via agendamento',
          nomeVacina: vacina?.nome || agendamento.nomeVacina || 'Vacina Aplicada',
          nomeLocal: local?.nome || agendamento.nomeLocal || 'Local de Vacinação'
        };
        
        await fetch('http://localhost:8080/api/historico', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(historicoData)
        });
      } catch (error) {
        console.error('Erro ao criar histórico:', error);
      }
    }
    
    return res.json();
  },
  deleteAgendamento: async (id) => {
    const res = await fetch(`http://localhost:8080/api/agendamentos/${id}`, { 
      method: 'DELETE' 
    });
    if (!res.ok) {
      throw new Error(`Erro ao deletar agendamento: ${res.status}`);
    }
    return res.status === 204 ? {} : res.json();
  },

  cancelarAgendamento: async (id, motivo) => {
    const res = await fetch(`http://localhost:8080/api/agendamentos/${id}/cancelar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ motivoCancelamento: motivo })
    });
    if (!res.ok) {
      throw new Error(`Erro ao cancelar agendamento: ${res.status}`);
    }
    return res.json();
  },

  aplicarVacina: async (agendamentoId, dadosAplicacao) => {
    const res = await fetch(`http://localhost:8080/api/agendamentos/${agendamentoId}/aplicar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosAplicacao)
    });
    if (!res.ok) {
      throw new Error(`Erro ao aplicar vacina: ${res.status}`);
    }
    return res.json();
  },

  // Login
  login: async (email, senha) => {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Credenciais inválidas');
    }
    return data;
  },



  getAgendamentosSemana: async () => {
    try {
      const agendamentos = await fetch('http://localhost:8080/api/agendamentos').then(r => r.json());
      
      const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const agendamentosPorDia = diasSemana.map((dia, index) => {
        const count = agendamentos.filter(a => {
          if (!a.dataAgendamento) return false;
          const data = new Date(a.dataAgendamento);
          return data.getDay() === index;
        }).length;
        return { dia, agendamentos: count };
      });
      
      return agendamentosPorDia;
    } catch (error) {
      console.error('Erro ao carregar agendamentos da semana:', error);
      return [
        { dia: 'Dom', agendamentos: 12 },
        { dia: 'Seg', agendamentos: 28 },
        { dia: 'Ter', agendamentos: 35 },
        { dia: 'Qua', agendamentos: 31 },
        { dia: 'Qui', agendamentos: 42 },
        { dia: 'Sex', agendamentos: 38 },
        { dia: 'Sáb', agendamentos: 19 }
      ];
    }
  },

  // Admin Overview - Estatísticas específicas
  getAdminStats: async () => {
    try {
      const [agendamentos, historico, vacinas] = await Promise.all([
        fetch('http://localhost:8080/api/agendamentos').then(r => r.json()),
        fetch('http://localhost:8080/api/historico').then(r => r.json()),
        fetch('http://localhost:8080/api/vacinas').then(r => r.json())
      ]);
      
      // Contar vacinações por tipo de vacina
      const vacinaCount = {};
      historico.forEach(h => {
        const nomeVacina = h.nomeVacina || 'Desconhecida';
        vacinaCount[nomeVacina] = (vacinaCount[nomeVacina] || 0) + 1;
      });
      
      const vacinasComCount = Object.entries(vacinaCount).map(([nome, count]) => ({
        nome,
        count
      }));
      
      return {
        agendamentos,
        historico,
        vacinas: vacinasComCount
      };
    } catch (error) {
      console.error('Erro ao carregar dados admin:', error);
      return {
        agendamentos: [],
        historico: [],
        vacinas: []
      };
    }
  }
};