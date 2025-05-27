import React from 'react';
import { Card, Title, Text } from '@ui5/webcomponents-react';

const VentasPorCategoria = ({ ventasPorCategoria }) => {
  return (
    <Card>
      <div style={{ padding: '1rem' }}>
        <Title level="H2" style={{ marginBottom: '1rem' }}>Ventas por Categoría</Title>
        {ventasPorCategoria.map((categoria, index) => (
          <div key={index} style={{ 
            padding: '1rem',
            borderBottom: index < ventasPorCategoria.length - 1 ? '1px solid var(--sapList_BorderColor)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'var(--sapButton_Background)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--sapButton_TextColor)'
            }}>
              {categoria.ranking}
            </div>
            <div style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{categoria.categoria}</Text>
              <Text style={{ color: 'var(--sapContent_LabelColor)', fontSize: '0.875rem' }}>
                {categoria.porcentaje} en ventas este mes
              </Text>
            </div>
            <Text style={{ color: 'var(--sapPositiveColor)' }}>
              MXN ${categoria.valor.toLocaleString()}
            </Text>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default VentasPorCategoria; 