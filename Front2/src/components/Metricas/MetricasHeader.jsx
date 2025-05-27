import React from 'react';
import { Title, Text, Icon } from '@ui5/webcomponents-react';

const MetricasHeader = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '2rem',
      backgroundColor: 'white',
      boxShadow: 'var(--sapContent_Shadow0)',
      borderRadius: '0.5rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <Icon 
          name="business-objects-experience" 
          style={{
            fontSize: '1.25rem',
            color: 'var(--sapContent_IconColor)'
          }}
        />
        <Title level="H1" style={{
          fontSize: '1.75rem',
          margin: 0,
          color: 'var(--sapTextColor)'
        }}>
          Métricas de Rendimiento
        </Title>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <Icon 
          name="map" 
          style={{
            color: 'var(--sapContent_IconColor)',
            fontSize: '1rem'
          }}
        />
        <Text style={{
          color: 'var(--sapContent_LabelColor)',
          fontSize: '0.875rem'
        }}>
          Plaza Comercial Reforma, Local 42B, CDMX
        </Text>
      </div>
    </div>
  );
};

export default MetricasHeader; 