import React from 'react';
import { Card, Title, Text } from '@ui5/webcomponents-react';

const StockPorCategoria = ({ stockPorCategoria }) => {
  // Manejar el caso cuando no hay datos
  if (!Array.isArray(stockPorCategoria) || stockPorCategoria.length === 0) {
    return (
      <Card>
        <div style={{ padding: '1rem' }}>
          <Title level="H2" style={{ marginBottom: '1rem' }}>Stock por Categoría</Title>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--sapContent_LabelColor)'
          }}>
            <Text>No hay datos de stock por categoría disponibles</Text>
          </div>
        </div>
      </Card>
    );
  }

  // Calcular total de unidades
  const totalUnidades = stockPorCategoria.reduce((total, cat) => total + (cat.unidades || 0), 0);

  return (
    <Card>
      <div style={{ padding: '1rem' }}>
        <Title level="H2" style={{ marginBottom: '1rem' }}>Stock por Categoría</Title>
        
        {/* Resumen total */}
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          borderBottom: '1px solid var(--sapList_BorderColor)',
          marginBottom: '1rem'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--sapContent_LabelColor)' }}>
            {totalUnidades.toLocaleString()} unidades
          </div>
          <Text style={{ color: 'var(--sapContent_LabelColor)' }}>Inventario Total</Text>
        </div>

        {/* Lista de categorías */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {stockPorCategoria.map((categoria, index) => (
            <div key={index} style={{
              padding: '1rem',
              border: '1px solid var(--sapList_BorderColor)',
              borderRadius: '0.5rem',
              backgroundColor: 'var(--sapList_Background)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: categoria.color || '#6c757d'
                }}></div>
                <Text style={{ fontWeight: 'bold' }}>{categoria.categoria || 'Sin categoría'}</Text>
              </div>
              
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: categoria.color || '#6c757d', marginBottom: '0.25rem' }}>
                {(categoria.unidades || 0).toLocaleString()} unidades
              </div>
              
              <Text style={{ color: 'var(--sapContent_LabelColor)', fontSize: '0.875rem' }}>
                {categoria.productos || 0} productos en catálogo
              </Text>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default StockPorCategoria; 