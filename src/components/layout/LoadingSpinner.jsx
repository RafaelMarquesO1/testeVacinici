import React from 'react';
import '../../styles/Dashboard.css'; // Usaremos o mesmo CSS para estilizar o spinner

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
