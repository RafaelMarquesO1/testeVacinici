import React from 'react';
import '../../styles/Dashboard.css';

export default function Header({ user }) {
  const userName = user ? user.nome.split(' ')[0] : "Usuário";
  const userRole = user && user.cargo ? user.cargo : (user && user.tipo === 'Funcionario' ? 'Funcionário' : '');

  return (
    <header className="header">
      <div className="header-content">
        <div />
        <div className="header-welcome">
          <span>
            Bem-vindo(a) de volta, <strong>{userName}!</strong>
            {userRole && <small className="ms-2 text-muted">({userRole})</small>}
          </span>
        </div>
      </div>
    </header>
  );
}