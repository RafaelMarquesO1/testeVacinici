import React from 'react';
import '../../styles/Dashboard.css';

export default function Header() {
  const adminName = "Administrador";

  return (
    <header className="header">
      <div className="header-content">
        <div />
        <div className="header-welcome">
          <span>Bem-vindo(a) de volta, <strong>{adminName}!</strong></span>
        </div>
      </div>
    </header>
  );
}