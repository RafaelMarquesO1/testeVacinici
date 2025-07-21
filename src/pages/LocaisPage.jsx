import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiMapPin, FiPhone, FiClock } from "react-icons/fi";
import { api } from '../services/api';
import '../styles/Dashboard.css';

// Componente para o modal de detalhes do local
const LocalDetailModal = ({ local, onClose }) => {
  if (!local) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close">&times;</button>
        <h2>Detalhes do Local</h2>
        
        <div className="local-details-content">
          <h3>{local.nome}</h3>
          <span className="local-type-badge">{local.tipo}</span>
          
          <div className="local-info mt-4">
            <div className="info-group">
              <FiMapPin className="info-icon" />
              <div>
                <h4>Endereço</h4>
                <p>{local.endereco}</p>
                <p>{local.cidade} - {local.estado}, {local.cep}</p>
              </div>
            </div>
            
            <div className="info-group">
              <FiPhone className="info-icon" />
              <div>
                <h4>Contato</h4>
                <p>{local.telefone || 'Não informado'}</p>
              </div>
            </div>
            
            <div className="info-group">
              <FiClock className="info-icon" />
              <div>
                <h4>Horário de Funcionamento</h4>
                <p>{local.horario_funcionamento || 'Não informado'}</p>
              </div>
            </div>
          </div>
          
          {(local.latitude && local.longitude) && (
            <div className="local-map mt-4">
              <h4>Localização no Mapa</h4>
              <div className="map-placeholder">
                <p>Mapa seria exibido aqui com as coordenadas:</p>
                <p>Latitude: {local.latitude}, Longitude: {local.longitude}</p>
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <button className="btn-primary">Editar Local</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para o modal de adicionar/editar local
const LocalFormModal = ({ local, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    horario_funcionamento: '',
    latitude: '',
    longitude: '',
    tipo: 'posto de saúde'
  });

  useEffect(() => {
    if (local) {
      setFormData(local);
    }
  }, [local]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Converter latitude e longitude para números se não estiverem vazios
    const processedData = {
      ...formData,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null
    };
    
    onSave(processedData);
  };

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close">&times;</button>
        <h2>{local ? 'Editar' : 'Adicionar'} Local de Vacinação</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome do Local</label>
            <input
              type="text"
              className="form-control"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Tipo</label>
            <select
              className="form-select"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="posto de saúde">Posto de Saúde</option>
              <option value="hospital">Hospital</option>
              <option value="clínica">Clínica</option>
              <option value="farmácia">Farmácia</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Endereço</label>
            <input
              type="text"
              className="form-control"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Cidade</label>
              <input
                type="text"
                className="form-control"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                {estados.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">CEP</label>
              <input
                type="text"
                className="form-control"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                placeholder="00000-000"
              />
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Telefone</label>
              <input
                type="text"
                className="form-control"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 0000-0000"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Horário de Funcionamento</label>
              <input
                type="text"
                className="form-control"
                name="horario_funcionamento"
                value={formData.horario_funcionamento}
                onChange={handleChange}
                placeholder="Ex: Segunda a Sexta, 8h às 17h"
              />
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Latitude (opcional)</label>
              <input
                type="number"
                step="any"
                className="form-control"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Longitude (opcional)</label>
              <input
                type="number"
                step="any"
                className="form-control"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="d-flex justify-content-end">
            <button type="button" className="btn-secondary me-2" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function LocaisPage() {
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingLocal, setEditingLocal] = useState(null);

  useEffect(() => {
    const fetchLocais = async () => {
      try {
        const data = await api.getLocaisVacinacao();
        setLocais(data);
      } catch (error) {
        console.error('Erro ao buscar locais de vacinação:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocais();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredLocais = locais.filter(local => 
    local.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    local.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
    local.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    local.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveLocal = (localData) => {
    // Aqui você implementaria a lógica para salvar no backend
    // Por enquanto, apenas atualizamos o estado local
    if (editingLocal) {
      // Atualizar local existente
      const updatedLocais = locais.map(l => 
        l.id === editingLocal.id ? { ...localData, id: editingLocal.id } : l
      );
      setLocais(updatedLocais);
    } else {
      // Adicionar novo local
      const newLocal = {
        ...localData,
        id: Math.max(...locais.map(l => l.id)) + 1
      };
      setLocais([...locais, newLocal]);
    }
    
    setShowFormModal(false);
    setEditingLocal(null);
  };

  const openEditModal = (local) => {
    setEditingLocal(local);
    setShowFormModal(true);
  };

  return (
    <div className="locais-page">
      <h1 className="page-title animated-title">Locais de Vacinação</h1>
      
      <div className="page-controls animated-component" style={{animationDelay: '100ms'}}>
        <div className="search-bar">
          <FiSearch />
          <input 
            type="text" 
            placeholder="Buscar locais..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <button 
          className="btn-primary"
          onClick={() => {
            setEditingLocal(null);
            setShowFormModal(true);
          }}
        >
          <FiPlus />
          <span>Novo Local</span>
        </button>
      </div>
      
      {loading ? (
        <div className="loading-indicator">Carregando locais de vacinação...</div>
      ) : (
        <div className="locais-grid animated-component" style={{animationDelay: '200ms'}}>
          {filteredLocais.map((local, index) => (
            <div 
              key={local.id} 
              className="local-card animated-card" 
              style={{animationDelay: `${index * 50}ms`}}
              onClick={() => setSelectedLocal(local)}
            >
              <div className="local-card-header">
                <FiMapPin className="local-icon" />
                <span className="local-type">{local.tipo}</span>
              </div>
              <h3 className="local-name">{local.nome}</h3>
              <p className="local-address">{local.endereco}</p>
              <p className="local-city">{local.cidade} - {local.estado}</p>
              <div className="local-details">
                {local.telefone && (
                  <span className="local-phone">
                    <FiPhone size={14} /> {local.telefone}
                  </span>
                )}
                <button 
                  className="btn-edit-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(local);
                  }}
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
          
          {filteredLocais.length === 0 && (
            <div className="no-results">
              Nenhum local encontrado com o termo "{searchTerm}".
            </div>
          )}
        </div>
      )}
      
      {selectedLocal && (
        <LocalDetailModal 
          local={selectedLocal} 
          onClose={() => setSelectedLocal(null)} 
        />
      )}
      
      {showFormModal && (
        <LocalFormModal 
          local={editingLocal} 
          onClose={() => {
            setShowFormModal(false);
            setEditingLocal(null);
          }} 
          onSave={handleSaveLocal}
        />
      )}
    </div>
  );
}