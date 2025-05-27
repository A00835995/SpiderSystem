import React from 'react';
import { Button, Input, Toolbar, ToolbarSpacer } from '@ui5/webcomponents-react';

const ComprasToolbar = ({ onExport, searchQuery, onSearchChange }) => {
  return (
    <Toolbar style={{ 
      marginBottom: '1.5rem',
      padding: '0.5rem 0'
    }}>
      <Button 
        icon="download"
        design="Emphasized"
        onClick={onExport}
        style={{
          backgroundColor: '#0854a0',
          color: 'white',
          padding: '0.5rem 1rem',
          height: 'auto'
        }}
      >
        Exportar Catálogo
      </Button>
      <ToolbarSpacer />
      <div style={{ position: 'relative', width: '300px' }}>
        <Input
          icon="search"
          placeholder="Buscar orden..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
    </Toolbar>
  );
};

export default ComprasToolbar; 