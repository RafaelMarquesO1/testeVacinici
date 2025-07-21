import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiDownload } from "react-icons/fi";
import { api } from '../services/api';
import '../styles/Dashboard.css';

// Componente para o modal de detalhes da vacinação
const VacinacaoDetailModal = ({ vacinacao, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [paciente, setPaciente] = useState(null);
  const [funcionario, setFuncionario] = useState(null);
  const [vacina, setVacina] = useState(null);
  const [local, setLocal] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [pacienteData, funcionarioData, vacinaData, locaisData] = await Promise.all([
          api.getUsuarioById(vacinacao.paciente_id),
          api.getUsuarioById(vacinacao.funcionario_id),
          api.getVacinaById(vacinacao.vacina_id),
          api.getLocaisVacinacao()
        ]);
        
        setPaciente(pacienteData);
        setFuncionario(funcionarioData);
        setVacina(vacinaData);
        setLocal(locaisData.find(l => l.id === vacinacao.local_id));
      } catch (error) {
        console.error('Erro ao buscar detalhes da vacinação:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [vacinacao]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR').format(date);
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
        <h2>Detalhes da Vacinação</h2>
        
        <div className="vacinacao-details-content">
          <div className="vacinacao-header">
            <h3>{vacina?.nome} - {vacinacao.dose}</h3>
            <span className="vacinacao-date">
              Aplicada em {formatDate(vacinacao.data_aplicacao)}
            </span>
          </div>
          
          <div className="vacinacao-info">
            <div className="info-section">
              <h4>Informações do Paciente</h4>
              {paciente && (
                <>
                  <p><strong>Nome:</strong> {paciente.nome_completo}</p>
                  <p><strong>CPF:</strong> {paciente.cpf}</p>
                  <p><strong>Data de Nascimento:</strong> {formatDate(paciente.data_nascimento)}</p>
                </>
              )}
            </div>
            
            <div className="info-section">
              <h4>Informações da Vacina</h4>
              <p><strong>Lote:</strong> {vacinacao.lote}</p>
              <p><strong>Validade:</strong> {formatDate(vacinacao.validade)}</p>
              <p><strong>Fabricante:</strong> {vacina?.fabricante}</p>
            </div>
            
            <div className="info-section">
              <h4>Informações da Aplicação</h4>
              <p><strong>Aplicador:</strong> {funcionario?.nome_completo}</p>
              <p><strong>Local:</strong> {local?.nome}</p>
              <p><strong>Endereço:</strong> {local?.endereco}, {local?.cidade}-{local?.estado}</p>
            </div>
            
            {vacinacao.observacoes && (
              <div className="info-section">
                <h4>Observações</h4>
                <p>{vacinacao.observacoes}</p>
              </div>
            )}
          </div>
          
          {vacinacao.comprovante_url && (
            <div className="action-buttons mt-4">
              <a 
                href={vacinacao.comprovante_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <FiDownload /> Baixar Comprovante
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente para o modal de registro de vacinação
const RegistrarVacinacaoModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    paciente_id: '',
    funcionario_id: '',
    vacina_id: '',
    dose: '1ª Dose',
    data_aplicacao: new Date().toISOString().split('T')[0],
    lote: '',
    validade: '',
    local_id: '',
    comprovante_url: '',
    observacoes: ''
  });
  const [pacientes, setPacientes] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [vacinas, setVacinas] = useState([]);
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pacientesData, funcionariosData, vacinasData, locaisData] = await Promise.all([
          api.getPacientes(),
          api.getFuncionarios(),
          api.getVacinas(),
          api.getLocaisVacinacao()
        ]);
        
        setPacientes(pacientesData);
        setFuncionarios(funcionariosData);
        setVacinas(vacinasData);
        setLocais(locaisData);
      } catch (error) {
        console.error('Erro ao buscar dados para registro de vacinação:', error);
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
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close">&times;</button>
        <h2>Registrar Vacinação</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
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
            <div className="col-md-6">
              <label className="form-label">Funcionário Responsável</label>
              <select
                className="form-select"
                name="funcionario_id"
                value={formData.funcionario_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um funcionário</option>
                {funcionarios.map(funcionario => (
                  <option key={funcionario.id} value={funcionario.id}>
                    {funcionario.nome_completo} - {funcionario.cargo}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
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
            <div className="col-md-6">
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
          </div>
          
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Data de Aplicação</label>
              <input
                type="date"
                className="form-control"
                name="data_aplicacao"
                value={formData.data_aplicacao}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Lote</label>
              <input
                type="text"
                className="form-control"
                name="lote"
                value={formData.lote}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Validade</label>
              <input
                type="date"
                className="form-control"
                name="validade"
                value={formData.validade}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Local de Aplicação</label>
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
          
          <div className="mb-3">
            <label className="form-label">URL do Comprovante (opcional)</label>
            <input
              type="text"
              className="form-control"
              name="comprovante_url"
              value={formData.comprovante_url}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Observações (opcional)</label>
            <textarea
              className="form-control"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          
          <div className="d-flex justify-content-end">
            <button type="button" className="btn-secondary me-2" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">Registrar Vacinação</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function HistoricoVacinacaoPage() {
  const [historicoVacinacao, setHistoricoVacinacao] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVacinacao, setSelectedVacinacao] = useState(null);
  const [showRegistrarModal, setShowRegistrarModal] = useState(false);

  useEffect(() => {
    fetchHistoricoVacinacao();
  }, []);

  const fetchHistoricoVacinacao = async () => {
    setLoading(true);
    try {
      const data = await api.getHistoricoVacinacao();
      
      // Buscar informações adicionais para cada registro
      const historicoDetalhado = await Promise.all(
        data.map(async (registro) => {
          const paciente = await api.getUsuarioById(registro.paciente_id);
          const funcionario = await api.getUsuarioById(registro.funcionario_id);
          const vacina = await api.getVacinaById(registro.vacina_id);
          
          return {
            ...registro,
            paciente_nome: paciente ? paciente.nome_completo : 'Paciente não encontrado',
            funcionario_nome: funcionario ? funcionario.nome_completo : 'Funcionário não encontrado',
            vacina_nome: vacina ? vacina.nome : 'Vacina não encontrada'
          };
        })
      );
      
      setHistoricoVacinacao(historicoDetalhado);
    } catch (error) {
      console.error('Erro ao buscar histórico de vacinação:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveVacinacao = async (vacinacaoData) => {
    try {
      const novoRegistro = await api.addVacinacao(vacinacaoData);
      
      // Buscar informações adicionais
      const paciente = await api.getUsuarioById(novoRegistro.paciente_id);
      const funcionario = await api.getUsuarioById(novoRegistro.funcionario_id);
      const vacina = await api.getVacinaById(novoRegistro.vacina_id);
      
      const registroDetalhado = {
        ...novoRegistro,
        paciente_nome: paciente ? paciente.nome_completo : 'Paciente não encontrado',
        funcionario_nome: funcionario ? funcionario.nome_completo : 'Funcionário não encontrado',
        vacina_nome: vacina ? vacina.nome : 'Vacina não encontrada'
      };
      
      setHistoricoVacinacao(prev => [...prev, registroDetalhado]);
      setShowRegistrarModal(false);
    } catch (error) {
      console.error('Erro ao registrar vacinação:', error);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const filteredHistorico = historicoVacinacao.filter(registro => 
    registro.paciente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registro.funcionario_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registro.vacina_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registro.lote.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="historico-vacinacao-page">
      <h1 className="page-title animated-title">Histórico de Vacinação</h1>
      
      <div className="page-controls animated-component" style={{animationDelay: '100ms'}}>
        <div className="search-bar">
          <FiSearch />
          <input 
            type="text" 
            placeholder="Buscar no histórico..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowRegistrarModal(true)}
        >
          <FiPlus />
          <span>Registrar Vacinação</span>
        </button>
      </div>
      
      {loading ? (
        <div className="loading-indicator">Carregando histórico de vacinação...</div>
      ) : (
        <div className="table-wrapper animated-component" style={{animationDelay: '200ms'}}>
          <table className="content-table">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Vacina</th>
                <th>Dose</th>
                <th>Data de Aplicação</th>
                <th>Lote</th>
                <th>Aplicador</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistorico.map((registro, index) => (
                <tr 
                  key={registro.id} 
                  className="animated-row" 
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <td>{registro.paciente_nome}</td>
                  <td>{registro.vacina_nome}</td>
                  <td>{registro.dose}</td>
                  <td>{formatDate(registro.data_aplicacao)}</td>
                  <td>{registro.lote}</td>
                  <td>{registro.funcionario_nome}</td>
                  <td>
                    <button 
                      className="btn-action btn-view"
                      onClick={() => setSelectedVacinacao(registro)}
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredHistorico.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Nenhum registro de vacinação encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {selectedVacinacao && (
        <VacinacaoDetailModal 
          vacinacao={selectedVacinacao} 
          onClose={() => setSelectedVacinacao(null)} 
        />
      )}
      
      {showRegistrarModal && (
        <RegistrarVacinacaoModal 
          onClose={() => setShowRegistrarModal(false)} 
          onSave={handleSaveVacinacao}
        />
      )}
    </div>
  );
}