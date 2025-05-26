import React from 'react';
import {
  Button,
  Input,
  Text,
  FlexBox,
  FlexBoxAlignItems,
  Icon
} from '@ui5/webcomponents-react';

const ProveedoresFilters = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  onKeyPress,
  filterType,
  onFilterChange,
  isDarkMode,
  tiposProveedores = []
}) => {
  // Función para formatear el nombre del tipo para mostrar
  const formatTipoNombre = (tipo) => {
    if (!tipo) return '';
    
    // Convertir a minúsculas para la lógica, pero mostrar capitalizado
    const tipoLower = tipo.toLowerCase();
    
    switch (tipoLower) {
      case 'fabricante':
        return 'Fabricantes';
      case 'distribuidor':
        return 'Distribuidores';
      case 'importador':
        return 'Importadores';
      case 'mayorista':
        return 'Mayoristas';
      default:
        // Capitalizar la primera letra para tipos no conocidos
        return tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase() + 's';
    }
  };

  // Función para obtener el valor del filtro (en minúsculas)
  const getTipoValue = (tipo) => {
    return tipo ? tipo.toLowerCase() : '';
  };

  return (
    <div style={{ 
      padding: '0.75rem 0',
      backgroundColor: 'transparent',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1rem',
      marginTop: '0.5rem'
    }}>
      <FlexBox alignItems={FlexBoxAlignItems.Center}>
        <div style={{ position: 'relative', width: '250px' }}>
          <Icon 
            name="search" 
            style={{ 
              position: 'absolute', 
              left: '10px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: isDarkMode ? '#8a8d91' : '#0854a0',
              fontSize: '1rem'
            }} 
          />
          <Input
            placeholder="Buscar proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={onKeyPress}
            style={{ 
              width: '100%', 
              paddingLeft: '2.25rem',
              borderRadius: '0.25rem',
              height: '2.25rem'
            }}
          />
        </div>
        <Button 
          design="Transparent"
          onClick={onSearch}
          style={{ marginLeft: '0.25rem' }}
        >
          Buscar
        </Button>
      </FlexBox>
      
      <FlexBox wrap>
        <Text style={{ 
          marginRight: '0.5rem', 
          alignSelf: 'center',
          fontWeight: '600',
          fontSize: '0.875rem'
        }}>
          Filtrar por:
        </Text>
        <FlexBox wrap>
          {/* Botón "Todos" siempre presente */}
          <Button 
            design={filterType === 'todos' ? 'Emphasized' : 'Default'}
            onClick={() => onFilterChange('todos')}
            style={{ 
              borderRadius: '1rem', 
              fontSize: '0.75rem', 
              height: '1.75rem',
              margin: '0.125rem',
              minWidth: 'auto',
              paddingLeft: '0.75rem',
              paddingRight: '0.75rem'
            }}
          >
            Todos
          </Button>
          
          {/* Botones dinámicos basados en tiposProveedores */}
          {tiposProveedores.map((tipo, index) => {
            const tipoValue = getTipoValue(tipo);
            const tipoLabel = formatTipoNombre(tipo);
            
            return (
              <Button 
                key={`tipo-${index}-${tipoValue}`}
                design={filterType === tipoValue ? 'Emphasized' : 'Default'}
                onClick={() => onFilterChange(tipoValue)}
                style={{ 
                  margin: '0.125rem', 
                  borderRadius: '1rem', 
                  fontSize: '0.75rem', 
                  height: '1.75rem',
                  minWidth: 'auto',
                  paddingLeft: '0.75rem',
                  paddingRight: '0.75rem'
                }}
              >
                {tipoLabel}
              </Button>
            );
          })}
        </FlexBox>
      </FlexBox>
    </div>
  );
};

export default ProveedoresFilters; 