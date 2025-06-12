import React from 'react';
import '../../styles/Dashboard.css'; // O estilo para a animação estará aqui

const LoadingScreen = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-logo-container">
        {/* SVG do seu logo, com classes para animação */}
        <svg 
          className="custom-logo" 
          width="100" 
          height="100" 
          viewBox="0 0 78 85" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* A forma externa que será "desenhada" */}
          <path 
            className="logo-shield" 
            d="M38.8654 2C49.9137 2 76 13.3333 76 33.639C76 53.9447 51.5794 83 38.8654 83C26.1514 83 2 53.9447 2 33.639C2 13.3333 27.8171 2 38.8654 2Z" 
          />
          {/* A forma interna (pessoa) que aparecerá depois */}
          <g className="logo-person">
            <path d="M38.9999 58.5C46.4999 58.5 54.5 45.6667 54.5 37.5C54.5 29.3333 46.4999 24.5 38.9999 24.5C31.4999 24.5 23.5 29.3333 23.5 37.5C23.5 45.6667 31.4999 58.5 38.9999 58.5Z" fill="#1A253C"/>
            <circle cx="39" cy="20.5" r="5" fill="#1A253C"/>
          </g>
        </svg>

        <span className="loading-text">Carregando...</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
