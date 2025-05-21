import React from 'react';
import {
  Title,
  Text,
  Button,
  Icon,
  FlexBox,
  FlexBoxJustifyContent
} from '@ui5/webcomponents-react';

const DeliveryStep = ({
  deliveryPoints,
  selectedDeliveryPoint,
  onDeliveryPointSelect,
  onNext,
  onBack
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '2rem',
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <Title level="H1" style={{
          fontSize: '1.75rem',
          color: 'var(--sapTextColor)',
          margin: 0
        }}>
          Entrega
        </Title>
        <Text style={{
          fontSize: '1rem',
          color: 'var(--sapContent_LabelColor)',
          margin: 0
        }}>
          Punto de entrega asignado
        </Text>
      </div>

      <div 
        onClick={() => onDeliveryPointSelect(deliveryPoints[0].id)}
        style={{
          border: '1px solid var(--sapContent_ForegroundBorderColor)',
          borderRadius: '8px',
          padding: '1.25rem',
          cursor: 'pointer',
          backgroundColor: selectedDeliveryPoint === deliveryPoints[0].id ? 'var(--sapList_SelectionBackgroundColor)' : 'white',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'var(--sapSelectedColor)',
            backgroundColor: selectedDeliveryPoint === deliveryPoints[0].id ? 
              'var(--sapList_SelectionBackgroundColor)' : 
              'var(--sapList_Hover_Background)'
          }
        }}
      >
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start'
        }}>
          <Icon 
            name="map" 
            style={{
              color: 'var(--sapContent_IconColor)',
              fontSize: '1.25rem',
              marginTop: '0.125rem'
            }}
          />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <Text style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--sapTextColor)',
              margin: 0
            }}>
              {deliveryPoints[0].name}
            </Text>
            <Text style={{
              color: 'var(--sapContent_LabelColor)',
              fontSize: '0.875rem',
              margin: 0
            }}>
              {deliveryPoints[0].address}
            </Text>
          </div>
        </div>
        {selectedDeliveryPoint === deliveryPoints[0].id && (
          <Icon 
            name="accept" 
            style={{
              color: 'var(--sapSuccessColor)',
              fontSize: '1.25rem'
            }}
          />
        )}
      </div>

      <FlexBox
        justifyContent={FlexBoxJustifyContent.SpaceBetween}
        style={{
          marginTop: 'auto',
          paddingTop: '2rem',
          borderTop: '1px solid var(--sapContent_ForegroundBorderColor)'
        }}
      >
        <Button
          design="Default"
          onClick={onBack}
          style={{
            minWidth: '120px'
          }}
        >
          Atrás
        </Button>
        <Button
          design="Emphasized"
          onClick={onNext}
          disabled={!selectedDeliveryPoint}
          style={{
            minWidth: '120px'
          }}
        >
          Continuar
        </Button>
      </FlexBox>
    </div>
  );
};

export default DeliveryStep; 