import React from 'react';
import KPICard from './KPICard';

const KPIGrid = ({ metrics }) => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(4, 1fr)', 
      gap: '1rem' 
    }}>
      <KPICard
        title="Ventas Totales"
        icon="retail-store"
        value={metrics.ventasTotales.valor}
        change={metrics.ventasTotales.cambio}
        additionalInfo={`Modelo más vendido: ${metrics.ventasTotales.modeloMasVendido}`}
        isMonetary={true}
      />
      
      <KPICard
        title="Ganancias"
        icon="money-bills"
        value={metrics.ganancias.valor}
        change={metrics.ganancias.cambio}
        additionalInfo={`Margen promedio: ${metrics.ganancias.margenPromedio}%`}
        isMonetary={true}
      />
      
      <KPICard
        title="Clientes Nuevos"
        icon="customer"
        value={metrics.clientesNuevos.valor}
        change={metrics.clientesNuevos.cambio}
        additionalInfo={`Tasa de conversión: ${metrics.clientesNuevos.tasaConversion}%`}
        isMonetary={false}
      />
      
      <KPICard
        title="Ticket Promedio"
        icon="cart"
        value={metrics.ticketPromedio.valor}
        change={metrics.ticketPromedio.cambio}
        additionalInfo={`Productos por venta: ${metrics.ticketPromedio.productosPorVenta}`}
        isMonetary={true}
      />
    </div>
  );
};

export default KPIGrid; 