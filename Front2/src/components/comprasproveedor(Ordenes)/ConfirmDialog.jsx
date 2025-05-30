import React from 'react';
import { Button, FlexBox, Text } from '@ui5/webcomponents-react';
import CustomDialog from './CustomDialog';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  selectedCompra
}) => {
  if (!selectedCompra) return null;

  const title = 'Aceptar Compra';
  const message = `¿Estás seguro que deseas aceptar la compra ${selectedCompra.id}?`;

  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width="500px"
      footer={
        <FlexBox style={{ gap: '0.5rem', justifyContent: 'flex-end' }}>
          <Button 
            design="Default"
            onClick={onClose}
            style={{ marginRight: '8px' }}
          >
            Cancelar
          </Button>
          <Button 
            design="Emphasized"
            icon="accept"
            onClick={onConfirm}
            style={{ 
              backgroundColor: '#0854a0', 
              color: 'white' 
            }}
          >
            Aceptar
          </Button>
        </FlexBox>
      }
    >
      <div>
        <Text>{message}</Text>
      </div>
    </CustomDialog>
  );
};

export default ConfirmDialog; 