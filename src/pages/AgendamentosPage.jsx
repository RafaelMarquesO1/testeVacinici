import React, { useState, useEffect } from 'react';
import { FiSearch, FiCalendar, FiClock, FiMapPin, FiUser } from "react-icons/fi";
import { api } from '../services/api';
import '../styles/Dashboard.css';

// Componente para o modal de detalhes do agendamento
const AgendamentoDetailModal = ({ agendamento, onClose, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const [paciente, setPaciente] = useState(null);
  const [vacina, setVacina] = useState(null);
  const [local, setLocal] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [pacienteData, vacinaData, localData] = await Promise.all([
          api.getUsuarioById(agendamento.paciente_id),
          api.getVacinaById(agendamento.vacina_id),
          api.getLocaisVacinacao().then(locais => 
            locais.find(l => l.id === agendamento.local_id)
          )
        ]);
        
        setPaciente(pacienteData);
        setVacina(vacinaData);
        setLocal(localData);
      } catch (error) {
        console.error('Erro ao buscar detalhes do agendamento:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [agendamento]);

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleStatusChange = (newStatus) => {
    onStatusChange(agendamento.id, newStatus);
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="loading-indicator">Carregando detalhes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close">&times;</button>
        <h2>Detalhes do Agendamento</h2>
        
        <div className="agendamento-details-content">
          <div className="agendamento-status">
            <span className={`status-badge status-${agendamento.status}`}>
              {agendamento.status === 'agendado' ? 'Agendado' : 
               agendamento.status === 'concluido' ? 'Concluído' : 'Cancelado'}
            </span>
          </div>
          
          <div className="agendamento-info">
            <div className="info-group">
              <FiCalendar className="info-icon" />
              <div>
                <h4>Data e Hora</h4>
                <p>{formatDateTime(agendamento.data_hora)}</p>
              </div>
            </div>
            
            {paciente && (
              <div className="info-group">
                <FiUser className="info-icon" />
                <div>
                  <h4>Paciente</h4>
                  <p>{paciente.nome_completo}</p>
                  <p className="text-muted">CPF: {paciente.cpf}</p>
                </div>
              </div>
            )}
            
            {vacina && (
              <div className="info-group">
                <div className="info-icon">💉</div>
                <div>
                  <h4>Vacina</h4>
                  <p>{vacina.nome} - {agendamento.dose}</p>
                  <p className="text-muted">Fabricante: {vacina.fabricante}</p>
                </div>
              </div>
            )}
            
            {local && (
              <div className="info-group">
                <FiMapPin className="info-icon" />
                <div>
                  <h4>Local</h4>
                  <p>{local.nome}</p>
                  <p className="text-muted">{local.endereco}, {local.cidade}-{local.estado}</p>
                </div>
              </div>
            )}
          </div>
          
          {agendamento.status === 'agendado' && (
            <div className="action-buttons mt-4">
              <button 
                className="btn-success" 
                onClick={() => handleStatusChange('concluido')}
              >
                Marcar como Concluído
              </button>
              <button 
                className="btn-danger ms-2" 
                onClick={() => handleStatusChange('cancelado')}
              >
                Cancelar Agendamento
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente para o modal de novo agendamento
const NovoAgendamentoModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    paciente_id: '',
    vacina_id: '',
    dose: '1ª Dose',
    data_hora: '',
    local_id: '',
    status: 'agendado'
  });
  const [pacientes, setPacientes] = useState([]);
  const [vacinas, setVacinas] = useState([]);
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pacientesData, vacinasData, locaisData] = await Promise.all([
          api.getPacientes(),
          api.getVacinas(),
          api.getLocaisVacinacao()
        ]);
        
        setPacientes(pacientesData);
        setVacinas(vacinasData);
        setLocais(locaisData);
      } catch (error) {
        console.error('Erro ao buscar dados para agendamento:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="loading-indicator">Carregando dados...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close">&times;</button>
        <h2>Novo Agendamento</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Paciente</label>
            <select
              className="form-select"
              name="paciente_id"
              value={formData.paciente_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um paciente</option>
              {pacientes.map(paciente => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.nome_completo} - CPF: {paciente.cpf}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Vacina</label>
            <select
              className="form-select"
              name="vacina_id"
              value={formData.vacina_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma vacina</option>
              {vacinas.map(vacina => (
                <option key={vacina.id} value={vacina.id}>
                  {vacina.nome} - {vacina.fabricante}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Dose</label>
            <select
              className="form-select"
              name="dose"
              value={formData.dose}
              onChange={handleChange}
              required
            >
              <option value="1ª Dose">1ª Dose</option>
              <option value="2ª Dose">2ª Dose</option>
              <option value="3ª Dose">3ª Dose</option>
              <option value="Dose de Reforço">Dose de Reforço</option>
              <option value="Dose Única">Dose Única</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Data e Hora</label>
            <input
              type="datetime-local"
              className="form-control"
              name="data_hora"
              value={formData.data_hora}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Local</label>
            <select
              className="form-select"
              name="local_id"
              value={formData.local_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um local</option>
              {locais.map(local => (
                <option key={local.id} value={local.id}>
                  {local.nome} - {local.endereco}
                </option>
              ))}
            </select>
          </div>
          
          <div className="d-flex justify-content-end">
            <button type="button" className="btn-secondary me-2" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">Agendar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [showNovoAgendamentoModal, setShowNovoAgendamentoModal] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos');

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const fetchAgendamentos = async () => {
    setLoading(true);
    try {
      const data = await api.getAgendamentos();
      
      // Buscar informações adicionais para cada agendamento
      const agendamentosDetalhados = await Promise.all(
        data.map(async (agendamento) => {
          const paciente = await api.getUsuarioById(agendamento.paciente_id);
          const vacina = await api.getVacinaById(agendamento.vacina_id);
          const locais = await api.getLocaisVacinacao();
          const local = locais.find(l => l.id === agendamento.local_id);
          
          return {
            ...agendamento,
            paciente_nome: paciente ? paciente.nome_completo : 'Paciente não encontrado',
            vacina_nome: vacina ? vacina.nome : 'Vacina não encontrada',
            local_nome: local ? local.nome : 'Local não encontrado'
          };
        })
      );
      
      setAgendamentos(agendamentosDetalhados);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateAgendamento(id, { status: newStatus });
      
      // Atualizar a lista de agendamentos
      setAgendamentos(prev => 
        prev.map(agendamento => 
          agendamento.id === id ? { ...agendamento, status: newStatus } : agendamento
        )
      );
      
      setSelectedAgendamento(null);
    } catch (error) {
      console.error('Erro ao atualizar status do agendamento:', error);
    }
  };

  const handleSaveAgendamento = async (agendamentoData) => {
    try {
      const novoAgendamento = await api.createAgendamento(agendamentoData);
      
      // Buscar informações adicionais
      const paciente = await api.getUsuarioById(novoAgendamento.paciente_id);
      const vacina = await api.getVacinaById(novoAgendamento.vacina_id);
      const locais = await api.getLocaisVacinacao();
      const local = locais.find(l => l.id === novoAgendamento.local_id);
      
      const agendamentoDetalhado = {
        ...novoAgendamento,
        paciente_nome: paciente ? paciente.nome_completo : 'Paciente não encontrado',
        vacina_nome: vacina ? vacina.nome : 'Vacina não encontrada',
        local_nome: local ? local.nome : 'Local não encontrado'
      };
      
      setAgendamentos(prev => [...prev, agendamentoDetalhado]);
      setShowNovoAgendamentoModal(false);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
    }
  };

  const formatDate = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const formatTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredAgendamentos = agendamentos.filter(agendamento => {
    const matchesSearch = 
      agendamento.paciente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.vacina_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.local_nome.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filtroStatus === 'todos' || agendamento.status === filtroStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="agendamentos-page">
      <h1 className="page-title animated-title">Agendamentos</h1>
      
      <div className="page-controls animated-component" style={{animationDelay: '100ms'}}>
        <div className="search-bar">
          <FiSearch />
          <input 
            type="text" 
            placeholder="Buscar agendamentos..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowNovoAgendamentoModal(true)}
        >
          <FiCalendar />
          <span>Novo Agendamento</span>
        </button>
      </div>
      
      <div className="filter-tabs animated-component" style={{animationDelay: '150ms'}}>
        <button 
          className={`filter-tab ${filtroStatus === 'todos' ? 'active' : ''}`}
          onClick={() => setFiltroStatus('todos')}
        >
          Todos
        </button>
        <button 
          className={`filter-tab ${filtroStatus === 'agendado' ? 'active' : ''}`}
          onClick={() => setFiltroStatus('agendado')}
        >
          Agendados
        </button>
        <button 
          className={`filter-tab ${filtroStatus === 'concluido' ? 'active' : ''}`}
          onClick={() => setFiltroStatus('concluido')}
        >
          Concluídos
        </button>
        <button 
          className={`filter-tab ${filtroStatus === 'cancelado' ? 'active' : ''}`}
          onClick={() => setFiltroStatus('cancelado')}
        >
          Cancelados
        </button>
      </div>
      
      {loading ? (
        <div className="loading-indicator">Carregando agendamentos...</div>
      ) : (
        <div className="table-wrapper animated-component" style={{animationDelay: '200ms'}}>
          <table className="content-table">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Vacina</th>
                <th>Dose</th>
                <th>Data</th>
                <th>Horário</th>
                <th>Local</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgendamentos.map((agendamento, index) => (
                <tr 
                  key={agendamento.id} 
                  className="animated-row" 
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <td>{agendamento.paciente_nome}</td>
                  <td>{agendamento.vacina_nome}</td>
                  <td>{agendamento.dose}</td>
                  <td>{formatDate(agendamento.data_hora)}</td>
                  <td>{formatTime(agendamento.data_hora)}</td>
                  <td>{agendamento.local_nome}</td>
                  <td>
                    <span className={`status-badge status-${agendamento.status}`}>
                      {agendamento.status === 'agendado' ? 'Agendado' : 
                       agendamento.status === 'concluido' ? 'Concluído' : 'Cancelado'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-action btn-view"
                      onClick={() => setSelectedAgendamento(agendamento)}
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredAgendamentos.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    Nenhum agendamento encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {selectedAgendamento && (
        <AgendamentoDetailModal 
          agendamento={selectedAgendamento} 
          onClose={() => setSelectedAgendamento(null)} 
          onStatusChange={handleStatusChange}
        />
      )}
      
      {showNovoAgendamentoModal && (
        <NovoAgendamentoModal 
          onClose={() => setShowNovoAgendamentoModal(false)} 
          onSave={handleSaveAgendamento}
        />
      )}
    </div>
  );
}