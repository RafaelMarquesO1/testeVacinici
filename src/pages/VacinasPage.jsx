import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus } from "react-icons/fi";
import { api } from '../services/api';
import '../styles/Dashboard.css';

// Componente para o modal de detalhes da vacina
const VacinaDetailModal = ({ vacina, onClose }) => {
  if (!vacina) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close">&times;</button>
        <h2>Detalhes da Vacina</h2>
        
        <div className="vacina-details-content">
          <div className="vacina-header">
            {vacina.imagem_url && (
              <img src={vacina.imagem_url} alt={vacina.nome} className="vacina-image" />
            )}
            <div>
              <h3>{vacina.nome}</h3>
              <p className="text-muted">Fabricante: {vacina.fabricante}</p>
              <span className={`badge bg-${vacina.categoria === 'obrigatória' ? 'danger' : vacina.categoria === 'sazonal' ? 'warning' : 'info'}`}>
                {vacina.categoria}
              </span>
            </div>
          </div>
          
          <div className="vacina-info mt-4">
            <h4>Informações</h4>
            <p>{vacina.descricao}</p>
            
            <div className="row mt-3">
              <div className="col-md-6">
                <p><strong>Doses recomendadas:</strong> {vacina.doses_recomendadas}</p>
                {vacina.intervalo_doses && (
                  <p><strong>Intervalo entre doses:</strong> {vacina.intervalo_doses} dias</p>
                )}
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Faixa etária:</strong> {' '}
                  {vacina.idade_minima === 0 ? 'Recém-nascidos' : `${Math.floor(vacina.idade_minima / 12)} anos`}
                  {vacina.idade_maxima ? ` até ${Math.floor(vacina.idade_maxima / 12)} anos` : ' em diante'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <button className="btn-primary">Editar Vacina</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para o modal de adicionar/editar vacina
const VacinaFormModal = ({ vacina, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    fabricante: '',
    descricao: '',
    doses_recomendadas: 1,
    intervalo_doses: '',
    idade_minima: 0,
    idade_maxima: '',
    categoria: 'obrigatória',
    imagem_url: ''
  });

  useEffect(() => {
    if (vacina) {
      setFormData(vacina);
    }
  }, [vacina]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close">&times;</button>
        <h2>{vacina ? 'Editar' : 'Adicionar'} Vacina</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Nome da Vacina</label>
              <input
                type="text"
                className="form-control"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Fabricante</label>
              <input
                type="text"
                className="form-control"
                name="fabricante"
                value={formData.fabricante}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Descrição</label>
            <textarea
              className="form-control"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Doses Recomendadas</label>
              <input
                type="number"
                className="form-control"
                name="doses_recomendadas"
                value={formData.doses_recomendadas}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Intervalo entre Doses (dias)</label>
              <input
                type="number"
                className="form-control"
                name="intervalo_doses"
                value={formData.intervalo_doses}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Categoria</label>
              <select
                className="form-select"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
              >
                <option value="obrigatória">Obrigatória</option>
                <option value="opcional">Opcional</option>
                <option value="sazonal">Sazonal</option>
              </select>
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Idade Mínima (meses)</label>
              <input
                type="number"
                className="form-control"
                name="idade_minima"
                value={formData.idade_minima}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Idade Máxima (meses, deixe em branco se não houver)</label>
              <input
                type="number"
                className="form-control"
                name="idade_maxima"
                value={formData.idade_maxima}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label className="form-label">URL da Imagem</label>
            <input
              type="text"
              className="form-control"
              name="imagem_url"
              value={formData.imagem_url}
              onChange={handleChange}
            />
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

export default function VacinasPage() {
  const [vacinas, setVacinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVacina, setSelectedVacina] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingVacina, setEditingVacina] = useState(null);

  useEffect(() => {
    const fetchVacinas = async () => {
      try {
        const data = await api.getVacinas();
        setVacinas(data);
      } catch (error) {
        console.error('Erro ao buscar vacinas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVacinas();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVacinas = vacinas.filter(vacina => 
    vacina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vacina.fabricante.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vacina.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveVacina = (vacinaData) => {
    // Aqui você implementaria a lógica para salvar no backend
    // Por enquanto, apenas atualizamos o estado local
    if (editingVacina) {
      // Atualizar vacina existente
      const updatedVacinas = vacinas.map(v => 
        v.id === editingVacina.id ? { ...vacinaData, id: editingVacina.id } : v
      );
      setVacinas(updatedVacinas);
    } else {
      // Adicionar nova vacina
      const newVacina = {
        ...vacinaData,
        id: Math.max(...vacinas.map(v => v.id)) + 1
      };
      setVacinas([...vacinas, newVacina]);
    }
    
    setShowFormModal(false);
    setEditingVacina(null);
  };

  const openEditModal = (vacina) => {
    setEditingVacina(vacina);
    setShowFormModal(true);
  };

  return (
    <div className="vacinas-page">
      <h1 className="page-title animated-title">Gerenciamento de Vacinas</h1>
      
      <div className="page-controls animated-component" style={{animationDelay: '100ms'}}>
        <div className="search-bar">
          <FiSearch />
          <input 
            type="text" 
            placeholder="Buscar vacinas..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <button 
          className="btn-primary"
          onClick={() => {
            setEditingVacina(null);
            setShowFormModal(true);
          }}
        >
          <FiPlus />
          <span>Nova Vacina</span>
        </button>
      </div>
      
      {loading ? (
        <div className="loading-indicator">Carregando vacinas...</div>
      ) : (
        <div className="vacinas-grid animated-component" style={{animationDelay: '200ms'}}>
          {filteredVacinas.map((vacina, index) => (
            <div 
              key={vacina.id} 
              className="vacina-card animated-card" 
              style={{animationDelay: `${index * 50}ms`}}
              onClick={() => setSelectedVacina(vacina)}
            >
              <div className="vacina-card-header">
                <img 
                  src={vacina.imagem_url || 'https://placehold.co/100x100/E0F2F1/2A9D8F?text=VACINA'} 
                  alt={vacina.nome} 
                  className="vacina-icon" 
                />
                <span className={`vacina-badge ${vacina.categoria}`}>
                  {vacina.categoria}
                </span>
              </div>
              <h3 className="vacina-name">{vacina.nome}</h3>
              <p className="vacina-manufacturer">{vacina.fabricante}</p>
              <div className="vacina-details">
                <span className="vacina-doses">
                  {vacina.doses_recomendadas} {vacina.doses_recomendadas > 1 ? 'doses' : 'dose'}
                </span>
                <button 
                  className="btn-edit-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(vacina);
                  }}
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
          
          {filteredVacinas.length === 0 && (
            <div className="no-results">
              Nenhuma vacina encontrada com o termo "{searchTerm}".
            </div>
          )}
        </div>
      )}
      
      {selectedVacina && (
        <VacinaDetailModal 
          vacina={selectedVacina} 
          onClose={() => setSelectedVacina(null)} 
        />
      )}
      
      {showFormModal && (
        <VacinaFormModal 
          vacina={editingVacina} 
          onClose={() => {
            setShowFormModal(false);
            setEditingVacina(null);
          }} 
          onSave={handleSaveVacina}
        />
      )}
    </div>
  );
}