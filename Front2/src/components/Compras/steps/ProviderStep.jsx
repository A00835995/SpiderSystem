import React from 'react';
import { Title, Text, Button, RadioButton, FlexBox, FlexBoxJustifyContent } from '@ui5/webcomponents-react';

const ProviderStep = ({ 
  providers, 
  selectedProvider, 
  onProviderSelect, 
  onNext, 
  onBack 
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1.5rem',
      padding: '1.5rem',
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <Title level="H1" style={{
          fontSize: '1.5rem',
          color: 'var(--sapTextColor)',
          fontWeight: '600'
        }}>
          Proveedores
        </Title>
        <Text style={{
          fontSize: '1rem',
          color: 'var(--sapContent_LabelColor)'
        }}>
          Selecciona un proveedor
        </Text>
      </div>
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '0.5rem'
      }}>
        {providers.map((provider) => (
          <div
            key={provider.id}
            onClick={() => onProviderSelect(provider.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              backgroundColor: selectedProvider === provider.id ? 'var(--sapSelectedColor)' : 'transparent',
              border: `1px solid ${selectedProvider === provider.id ? 'var(--sapSelectedColor)' : 'var(--sapContent_ForegroundBorderColor)'}`,
              color: selectedProvider === provider.id ? 'white' : 'var(--sapTextColor)',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <RadioButton
              checked={selectedProvider === provider.id}
              onChange={() => onProviderSelect(provider.id)}
              style={{ margin: 0 }}
            />
            <Text style={{
              fontSize: '0.875rem',
              fontWeight: '400'
            }}>
              {provider.name}
            </Text>
          </div>
        ))}
      </div>
      <FlexBox
        justifyContent={FlexBoxJustifyContent.SpaceBetween}
        style={{
          marginTop: '1rem',
          paddingTop: '0.5rem'
        }}
      >
        <Button
          onClick={onBack}
          style={{
            minWidth: '100px'
          }}
        >
          Atrás
        </Button>
        <Button
          design="Emphasized"
          onClick={onNext}
          disabled={!selectedProvider}
          style={{
            minWidth: '100px'
          }}
        >
          Continuar
        </Button>
      </FlexBox>
    </div>
  );
};

export default ProviderStep; 