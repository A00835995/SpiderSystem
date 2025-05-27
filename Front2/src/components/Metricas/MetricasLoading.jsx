import React from 'react';
import { Icon, Text } from '@ui5/webcomponents-react';

const MetricasLoading = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <Icon name="loading" />
      <Text>Cargando métricas...</Text>
    </div>
  );
};

export default MetricasLoading; 