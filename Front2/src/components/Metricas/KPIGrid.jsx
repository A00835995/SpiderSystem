import React from 'react';
import KPICard from './KPICard';
import InventoryKPICard from './InventoryKPICard';

const KPIGrid = ({ metrics, vista = 'general' }) => {
  if (vista === 'inventario') {
    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '1rem' 
      }}>
        <InventoryKPICard
          title="Stock Total"
          icon="product"
          value={metrics.stockTotal.valor}
          additionalInfo={`Productos únicos: ${metrics.stockTotal.productosUnicos}`}
          isMonetary={false}
        />
        
        <InventoryKPICard
          title="Stock Bajo"
          icon="warning"
          value={metrics.stockCritico.valor}
          additionalInfo={`Productos afectados: ${metrics.stockCritico.productosAfectados}`}
          isMonetary={false}
        />
      </div>
    );
  }

  // Vista general (ventas)
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
        additionalInfo={`Día con más ventas: ${metrics.clientesNuevos.diaMasVentas}`}
        isMonetary={false}
      />
      
      <KPICard
        title="Venta Promedio"
        icon="cart"
        value={metrics.ventaPromedio.valor}
        change={metrics.ventaPromedio.cambio}
        additionalInfo={`Promedio de productos por venta: ${metrics.ventaPromedio.productosPorVenta}`}
        isMonetary={true}
      />
    </div>
  );
};

export default KPIGrid; 