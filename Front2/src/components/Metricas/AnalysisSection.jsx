import React from 'react';
import VentasPorCategoria from './VentasPorCategoria';
import StockPorCategoria from './StockPorCategoria';

const AnalysisSection = ({ metrics, vista = 'general', periodo = 'mesActual' }) => {
  // Determinar si el período es anual o mensual
  const tipoDisplay = periodo.includes('anio') ? 'anio' : 'mes';
  
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr', 
      gap: '1rem' 
    }}>
      {vista === 'general' ? (
        <VentasPorCategoria 
          ventasPorCategoria={metrics.ventasPorCategoria} 
          periodo={tipoDisplay}
        />
      ) : (
        <StockPorCategoria stockPorCategoria={metrics.stockPorCategoria} />
      )}
    </div>
  );
};

export default AnalysisSection; 