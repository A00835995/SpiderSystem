import React, { useRef, useState } from 'react';
import { 
  Button,
  Menu,
  MenuItem,
  Popover
} from '@ui5/webcomponents-react';

const ActionMenu = ({ onUpdate, onCancel, onComplete, onViewComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAction = (action) => {
    handleClose();
    switch(action) {
      case 'update':
        onUpdate();
        break;
      case 'cancel':
        onCancel();
        break;
      case 'complete':
        onComplete();
        break;
      case 'viewComplete':
        onViewComplete();
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Button
        ref={buttonRef}
        icon="overflow"
        design="Transparent"
        onClick={handleClick}
        style={{ minWidth: '36px', height: '36px' }}
      >
        Acciones
      </Button>
      <Popover
        open={isOpen}
        opener={buttonRef.current}
        onAfterClose={handleClose}
        placementType="Bottom"
      >
        <Menu onItemClick={(e) => {
          const action = e.detail.item.dataset.action;
          handleAction(action);
        }}>
          <MenuItem 
            icon="detail-view"
            data-action="viewComplete"
          >
            Ver Completa
          </MenuItem>
          <MenuItem 
            icon="edit"
            data-action="update"
          >
            Actualizar Pedido
          </MenuItem>
          <MenuItem 
            icon="complete"
            data-action="complete"
          >
            Marcar como Completado
          </MenuItem>
          <MenuItem 
            icon="decline"
            data-action="cancel"
          >
            Cancelar Pedido
          </MenuItem>
        </Menu>
      </Popover>
    </>
  );
};

export default ActionMenu; 