import React from 'react';
import { Title, Text, Button, RadioButton, FlexBox, FlexBoxJustifyContent } from '@ui5/webcomponents-react';

const ProviderStep = ({ 
  //Se está recibiendo los datos de los proveedores
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
      height: 'calc(100vh - 160px)', // Aumentamos la altura reduciendo el espacio que restamos
      padding: '1.5rem',
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginBottom: '1.5rem'
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

      {/* Lista scrolleable de proveedores */}
      <div style={{ 
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '0.5rem',
        marginBottom: '1.5rem',
        // Estilo para la barra de scroll
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px'
        },
        '&::-webkit-scrollbar-track': {
          background: 'var(--sapScrollBar_TrackColor)',
          borderRadius: '4px'
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'var(--sapScrollBar_FaceColor)',
          borderRadius: '4px',
          '&:hover': {
            background: 'var(--sapScrollBar_Hover_FaceColor)'
          }
        }
      }}>
        {providers.map((provider) => ( //Se está iterando sobre el array de proveedores
          <div
            key={provider.id}
            //Se está pasando el id del proveedor
            onClick={() => onProviderSelect(provider.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              backgroundColor: selectedProvider === provider.id ? 'var(--sapSelectedColor)' : 'white',
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

      {/* Footer con botones */}
      <FlexBox
        justifyContent={FlexBoxJustifyContent.SpaceBetween}
        style={{
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--sapContent_ForegroundBorderColor)'
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