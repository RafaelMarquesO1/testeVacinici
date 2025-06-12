import React from 'react';
import { FiUsers, FiPlusCircle } from "react-icons/fi";
import { FaSyringe, FaChartLine } from "react-icons/fa";
import '../styles/Dashboard.css';

// Componente reutilizável para os cartões de estatística
const StatCard = ({ icon, title, value, change, delay }) => (
  // A classe 'animated-card' e o delay vêm do nosso CSS para a animação
  <div className="stat-card animated-card" style={{ animationDelay: delay }}>
    <div className="stat-card-icon">{icon}</div>
    <div className="stat-card-info">
      <span className="stat-card-title">{title}</span>
      <span className="stat-card-value">{value}</span>
      {change && <span className={`stat-card-change ${change.type}`}>{change.value}</span>}
    </div>
  </div>
);

// Componente principal da página do Dashboard
export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <h1 className="page-title animated-title">Painel de Controle</h1>
      
      {/* Grid com os 4 cartões de estatísticas */}
      <div className="stats-grid">
        <StatCard 
          icon={<FiUsers />} 
          title="Total de Pacientes" 
          value="1,482" 
          change={{type: 'positive', value: '+12 na última semana'}} 
          delay="100ms"
        />
        <StatCard 
          icon={<FaSyringe />} 
          title="Vacinas Aplicadas (Mês)" 
          value="897" 
          change={{type: 'positive', value: '+5.2% vs. mês anterior'}} 
          delay="200ms"
        />
        <StatCard 
          icon={<FiPlusCircle />} 
          title="Novos Cadastros (Hoje)" 
          value="8" 
          delay="300ms"
        />
        <StatCard 
          icon={<FaChartLine />} 
          title="Cobertura BCG (Infantil)" 
          value="92.5%" 
          change={{type: 'negative', value: '-0.5% da meta nacional'}} 
          delay="400ms"
        />
      </div>

      {/* Card com a lista de atividades recentes */}
      <div className="recent-activity-card animated-card" style={{ animationDelay: '500ms' }}>
        <h2>Atividade Recente</h2>
        <ul className="activity-list">
            <li className="activity-item">
                <span className="activity-desc">Nova vacina de <strong>Febre Amarela</strong> aplicada em <strong>João Silva</strong>.</span>
                <span className="activity-time">2 min atrás</span>
            </li>
            <li className="activity-item">
                <span className="activity-desc">Novo paciente <strong>Maria Oliveira</strong> cadastrado por <strong>Dr(a). Ana</strong>.</span>
                <span className="activity-time">15 min atrás</span>
            </li>
            <li className="activity-item">
                <span className="activity-desc">Dados do paciente <strong>Carlos Pereira</strong> atualizados.</span>
                <span className="activity-time">1 hora atrás</span>
            </li>
             <li className="activity-item">
                <span className="activity-desc">Relatório de cobertura vacinal gerado.</span>
                <span className="activity-time">3 horas atrás</span>
            </li>
        </ul>
      </div>
    </div>
  );
}
