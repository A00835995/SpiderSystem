import React from 'react';
import VentasPorCategoria from './VentasPorCategoria';
import DistribucionVentas from './DistribucionVentas';

const AnalysisSection = ({ metrics }) => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '2fr 1fr', 
      gap: '1rem' 
    }}>
      <VentasPorCategoria ventasPorCategoria={metrics.ventasPorCategoria} />
      <DistribucionVentas distribucionVentas={metrics.distribucionVentas} />
    </div>
  );
};

export default AnalysisSection; 