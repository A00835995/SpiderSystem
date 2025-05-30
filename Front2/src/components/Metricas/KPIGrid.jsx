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
        
        <InventoryKPICard
          title="Rotación de Stock"
          icon="refresh"
          value={metrics.rotacionStock.valor}
          additionalInfo={`Días promedio: ${metrics.rotacionStock.diasPromedio}`}
          isMonetary={false}
          showDecimals={true}
        />
        
        <InventoryKPICard
          title="Inventario Inactivo"
          icon="return"
          value={`${metrics.devoluciones.valor}%`}
          additionalInfo={`Unidades: ${metrics.devoluciones.unidades}`}
          isMonetary={false}
          showDecimals={true}
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