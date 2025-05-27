import React from 'react';
import { Button, Title } from '@ui5/webcomponents-react';

const CustomDialog = ({ isOpen, onClose, title, children, footer, width = "900px" }) => {
  if (!isOpen) return null;

  // Prevenir que clics dentro del diálogo cierren el diálogo
  const handleDialogClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
      }}
      onClick={onClose} // Cerrar al hacer clic fuera del diálogo
    >
      <div 
        style={{
          width: width,
          maxWidth: '95vw',
          maxHeight: '90vh',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 0 24px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1001
        }}
        onClick={handleDialogClick} // Evitar que clics dentro del diálogo lo cierren
      >
        {/* Header */}
        <div style={{ 
          padding: '0.75rem 1rem',
          borderBottom: '1px solid #e5e5e5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          <Title level="H4">{title}</Title>
          <Button 
            icon="decline" 
            design="Transparent" 
            onClick={onClose}
            ariaLabel="Cerrar"
          />
        </div>
        
        {/* Content */}
        <div style={{ 
          padding: '1rem', 
          overflowY: 'auto',
          flexGrow: 1,
          maxHeight: 'calc(80vh - 120px)'
        }}>
          {children}
        </div>
        
        {/* Footer */}
        <div style={{ 
          padding: '0.75rem 1rem',
          borderTop: '1px solid #e5e5e5',
          display: 'flex',
          justifyContent: 'flex-end',
          backgroundColor: '#f5f5f5'
        }}>
          {footer}
        </div>
      </div>
    </div>
  );
};

export default CustomDialog; 