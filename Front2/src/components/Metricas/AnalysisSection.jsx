import React from 'react';
import VentasPorCategoria from './VentasPorCategoria';
import StockPorCategoria from './StockPorCategoria';

const AnalysisSection = ({ metrics, vista = 'general' }) => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr', 
      gap: '1rem' 
    }}>
      {vista === 'general' ? (
        <VentasPorCategoria ventasPorCategoria={metrics.ventasPorCategoria} />
      ) : (
        <StockPorCategoria stockPorCategoria={metrics.stockPorCategoria} />
      )}
    </div>
  );
};

export default AnalysisSection; 