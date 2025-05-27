import React from 'react';
import { 
  Dialog, 
  Button, 
  Icon, 
  Title, 
  Text,
  Bar,
  FlexBox
} from '@ui5/webcomponents-react';

const OrderConfirmationDialog = ({ 
  open, 
  onClose, 
  type = 'Success',
  title,
  message,
  ordenId 
}) => {
  return (
    <Dialog
      open={open}
      onAfterClose={onClose}
      style={{
        width: '400px',
        padding: '1rem',
        background: '#f5f6f7'
      }}
    >
      <Bar
        slot="header"
        design="Header"
        style={{
          background: type === 'Success' 
            ? '#f5f6f7' 
            : 'var(--sapErrorBackground)'
        }}
      >
        <FlexBox alignItems="Center" gap="0.5rem">
          <Icon 
            name={type === 'Success' ? "accept" : "error"} 
            style={{
              color: type === 'Success' 
                ? 'var(--sapSuccessColor)' 
                : 'var(--sapErrorColor)',
              width: '1.5rem',
              height: '1.5rem'
            }}
          />
          <Title level="H5">{title}</Title>
        </FlexBox>
      </Bar>

      <div style={{ 
        padding: '2rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <Text style={{ fontSize: '1.1rem' }}>{message}</Text>
        {ordenId && (
          <Text style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold',
            color: 'var(--sapSuccessColor)'
          }}>
            Número de Orden: {ordenId}
          </Text>
        )}
      </div>

      <Bar 
        slot="footer" 
        design="Footer"
        style={{ padding: '0.5rem' , background: '#f5f6f7'}}
      >
        <FlexBox justifyContent="End">
          <Button 
            design={type === 'Success' ? "Emphasized" : "Negative"}
            onClick={onClose}
          >
            {type === 'Success' ? 'Aceptar' : 'Cerrar'}
          </Button>
        </FlexBox>
      </Bar>
    </Dialog>
  );
};

export default OrderConfirmationDialog; 