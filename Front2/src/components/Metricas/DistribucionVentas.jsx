import React from 'react';
import { 
  Card, 
  Title, 
  Text, 
  FlexBox, 
  FlexBoxJustifyContent 
} from '@ui5/webcomponents-react';

const DistribucionVentas = ({ distribucionVentas }) => {
  return (
    <Card>
      <div style={{ padding: '1rem' }}>
        <Title level="H2" style={{ marginBottom: '1rem' }}>Distribución de Ventas</Title>
        <Text style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          {distribucionVentas.total.toLocaleString()}
        </Text>
        <Text style={{ color: 'var(--sapContent_LabelColor)', marginBottom: '1rem' }}>
          ventas totales
        </Text>
        <Text style={{ marginBottom: '0.5rem' }}>Distribución por Canal</Text>
        {distribucionVentas.canales.map((canal, index) => (
          <div key={index} style={{ 
            marginBottom: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}>
            <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween}>
              <Text>{canal.nombre}</Text>
              <Text style={{ color: 'var(--sapPositiveColor)' }}>{canal.valor}</Text>
            </FlexBox>
            <Text style={{ color: 'var(--sapContent_LabelColor)', fontSize: '0.875rem' }}>
              {canal.ventas.toLocaleString()} ventas
            </Text>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DistribucionVentas; 