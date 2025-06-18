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
  const stats = [
    {
      icon: <FiUsers />,
      title: "Total de Pacientes",
      value: "1,482",
      change: { type: "positive", value: "+12 na última semana" },
      delay: "100ms"
    },
    {
      icon: <FaSyringe />,
      title: "Vacinas Aplicadas (Mês)",
      value: "897",
      change: { type: "positive", value: "+5.2% vs. mês anterior" },
      delay: "200ms"
    },
    {
      icon: <FiPlusCircle />,
      title: "Novos Cadastros (Hoje)",
      value: "8",
      delay: "300ms"
    },
    {
      icon: <FaChartLine />,
      title: "Cobertura BCG (Infantil)",
      value: "92.5%",
      change: { type: "negative", value: "-0.5% da meta nacional" },
      delay: "400ms"
    }
  ];

  const activities = [
    {
      desc: <>Nova vacina de <strong>Febre Amarela</strong> aplicada em <strong>João Silva</strong>.</>,
      time: "2 min atrás"
    },
    {
      desc: <>Novo paciente <strong>Maria Oliveira</strong> cadastrado por <strong>Dr(a). Ana</strong>.</>,
      time: "15 min atrás"
    },
    {
      desc: <>Dados do paciente <strong>Carlos Pereira</strong> atualizados.</>,
      time: "1 hora atrás"
    },
    {
      desc: <>Relatório de cobertura vacinal gerado.</>,
      time: "3 horas atrás"
    }
  ];

  return (
    <div className="dashboard-page">
      <h1 className="page-title animated-title">Painel de Controle</h1>
      
      {/* Grid com os 4 cartões de estatísticas */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            icon={stat.icon} 
            title={stat.title} 
            value={stat.value} 
            change={stat.change} 
            delay={stat.delay}
          />
        ))}
      </div>

      {/* Card com a lista de atividades recentes */}
      <div className="recent-activity-card animated-card" style={{ animationDelay: '500ms' }}>
        <h2>Atividade Recente</h2>
        <ul className="activity-list">
            {activities.map((activity, index) => (
              <li key={index} className="activity-item">
                <span className="activity-desc">{activity.desc}</span>
                <span className="activity-time">{activity.time}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
