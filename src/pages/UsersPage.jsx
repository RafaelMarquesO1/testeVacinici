import React, { useState } from 'react';
import { FiUserPlus, FiSearch } from "react-icons/fi";
import '../styles/Dashboard.css';

// Dados de exemplo (Mock Data)
const mockPatients = [
  { id: 1, nome: 'Ana Carolina Silva', cpf: '111.222.333-44', nascimento: '15/05/1990', avatar: 'https://placehold.co/40x40/E0F2F1/2A9D8F?text=A' },
  { id: 2, nome: 'Bruno Costa Lima', cpf: '222.333.444-55', nascimento: '20/11/1985', avatar: 'https://placehold.co/40x40/E0F2F1/2A9D8F?text=B' },
  { id: 3, nome: 'Carla Dias Souza', cpf: '333.444.555-66', nascimento: '10/02/2001', avatar: 'https://placehold.co/40x40/E0F2F1/2A9D8F?text=C' },
  { id: 4, nome: 'Daniel Farias', cpf: '444.555.666-77', nascimento: '30/07/1978', avatar: 'https://placehold.co/40x40/E0F2F1/2A9D8F?text=D' },
];
const mockStaff = [
    { id: 101, nome: 'Dr. Ricardo Borges', email: 'ricardo.b@email.com', cargo: 'Administrador', avatar: 'https://placehold.co/40x40/D1FAE5/264653?text=R' },
    { id: 102, nome: 'Enf.ª Mariana Lima', email: 'mariana.l@email.com', cargo: 'Enfermeira', avatar: 'https://placehold.co/40x40/D1FAE5/264653?text=M' },
];

// Componente para o modal de detalhes do paciente
const PatientDetailModal = ({ patient, onClose }) => {
    if (!patient) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="modal-close">&times;</button>
                <h2>Detalhes de {patient.nome}</h2>
                <div className="patient-details-content">
                    <div className="patient-info">
                        <h3>Informações Pessoais</h3>
                        <p><strong>CPF:</strong> {patient.cpf}</p>
                        <p><strong>Nascimento:</strong> {patient.nascimento}</p>
                    </div>
                    <div className="vaccine-history-preview">
                        <h3>Histórico de Vacinas</h3>
                        <ul>
                            <li><strong>COVID-19 (2ª Dose)</strong> - Aplicada por Enf.ª Mariana Lima em 10/12/2023</li>
                            <li><strong>Gripe (Dose Única)</strong> - Aplicada por Enf.ª Mariana Lima em 22/04/2024</li>
                        </ul>
                         <button className="btn-secondary">+ Adicionar Vacina</button>
                    </div>
                </div>
                 <button className="btn-primary">Editar Informações do Paciente</button>
            </div>
        </div>
    );
};


export default function UsersPage() {
  const [activeTab, setActiveTab] = useState('patients');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const renderTable = () => {
    if (activeTab === 'patients') {
      return (
        <table className="content-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Data de Nascimento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockPatients.map((patient, index) => (
              <tr key={patient.id} className="animated-row" style={{ animationDelay: `${index * 60}ms` }}>
                <td>
                  <div className="user-cell">
                    <img src={patient.avatar} alt={patient.nome} className="avatar" />
                    {patient.nome}
                  </div>
                </td>
                <td>{patient.cpf}</td>
                <td>{patient.nascimento}</td>
                <td>
                  <div className="action-buttons">
                      <button onClick={() => setSelectedPatient(patient)} className="btn-action btn-view">Consultar</button>
                      <button className="btn-action btn-edit">Editar</button>
                      <button className="btn-action btn-delete">Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    // Lógica para a aba de funcionários
    if (activeTab === 'staff') {
      return (
        <table className="content-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Cargo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockStaff.map((staff, index) => (
              <tr key={staff.id} className="animated-row" style={{ animationDelay: `${index * 60}ms` }}>
                <td>
                  <div className="user-cell">
                    <img src={staff.avatar} alt={staff.nome} className="avatar" />
                    {staff.nome}
                  </div>
                </td>
                <td>{staff.email}</td>
                <td><span className={`role-badge role-${staff.cargo.toLowerCase()}`}>{staff.cargo}</span></td>
                <td>
                  <div className="action-buttons">
                      <button className="btn-action btn-edit">Editar</button>
                      <button className="btn-action btn-delete">Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div className="users-page">
      <h1 className="page-title animated-title">Usuários do Sistema</h1>
      <div className="page-controls animated-component" style={{animationDelay: '100ms'}}>
        <div className="search-bar">
          <FiSearch />
          <input type="text" placeholder={`Buscar em ${activeTab === 'patients' ? 'pacientes' : 'funcionários'}...`} />
        </div>
        <button className="btn-primary">
          <FiUserPlus />
          <span>Adicionar Novo</span>
        </button>
      </div>

      <div className="tabs animated-component" style={{animationDelay: '200ms'}}>
        <button 
          className={`tab-btn ${activeTab === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveTab('patients')}
        >
          Pacientes
        </button>
        <button 
          className={`tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
          onClick={() => setActiveTab('staff')}
        >
          Funcionários
        </button>
      </div>
      
      <div className="table-wrapper animated-component" style={{animationDelay: '300ms'}}>
        {renderTable()}
      </div>

      {selectedPatient && <PatientDetailModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />}
    </div>
  );
}
