import React from 'react';
import { Button, FlexBox, Text, MessageStrip } from '@ui5/webcomponents-react';
import CustomDialog from './CustomDialog';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  selectedCompra, 
  actionType 
}) => {
  if (!selectedCompra) return null;

  const isReject = actionType === 'reject';
  const title = isReject ? 'Rechazar Compra' : 'Aceptar Compra';
  const message = isReject 
    ? `¿Estás seguro que deseas rechazar la compra ${selectedCompra.id}?`
    : `¿Estás seguro que deseas aceptar la compra ${selectedCompra.id}?`;
  const stripMessage = isReject
    ? 'Esta acción eliminará la compra del sistema'
    : 'Esta acción cambiará el estado de la compra a "En proceso"';
  const stripDesign = isReject ? 'Warning' : 'Information';

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
            design={isReject ? "Negative" : "Emphasized"}
            icon={isReject ? "decline" : "accept"}
            onClick={onConfirm}
            style={{ 
              backgroundColor: isReject ? '#bb0000' : '#0854a0', 
              color: 'white' 
            }}
          >
            {isReject ? 'Rechazar' : 'Aceptar'}
          </Button>
        </FlexBox>
      }
    >
      <div>
        <Text>{message}</Text>
        <MessageStrip
          design={stripDesign}
          style={{ marginTop: '1rem' }}
        >
          {stripMessage}
        </MessageStrip>
      </div>
    </CustomDialog>
  );
};

export default ConfirmDialog; 