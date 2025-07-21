import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { RxDashboard } from "react-icons/rx";
import { FiUsers, FiLogOut, FiMenu, FiX, FiSun, FiMoon, FiCalendar, FiList, FiMapPin } from "react-icons/fi";
import { FaSyringe } from "react-icons/fa";
import '../../styles/Dashboard.css';

export default function Sidebar({ handleLogout }) { // Recebe a função de logout como prop
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <>
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FiX /> : <FiMenu />}
      </button>

      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-wrapper">
            <span className="sidebar-logo">{isCollapsed ? 'V' : 'Vacinici'}</span>
          </div>
          <button className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)} aria-label="Collapse menu">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admin/dashboard" className="nav-link" onClick={handleLinkClick}>
            <RxDashboard className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </NavLink>
          <NavLink to="/admin/usuarios" className="nav-link" onClick={handleLinkClick}>
            <FiUsers className="nav-icon" />
            <span className="nav-text">Usuários</span>
          </NavLink>
        </nav>
        
        <div className="sidebar-footer">
           <button onClick={toggleTheme} className="nav-link theme-toggle-btn" aria-label="Alternar tema">
              {isDarkMode ? <FiSun className="nav-icon" /> : <FiMoon className="nav-icon" />}
              <span className="nav-text">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
           </button>
           
           {/* Botão de Sair agora usa a função handleLogout */}
           <button onClick={handleLogout} className="nav-link logout-btn">
            <FiLogOut className="nav-icon" />
            <span className="nav-text">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
