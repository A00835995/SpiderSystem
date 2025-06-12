import React from 'react';
import { Input, Select, Option, FlexBox, FlexBoxJustifyContent, FlexBoxAlignItems } from '@ui5/webcomponents-react';

const SearchAndFilters = ({ searchQuery, onSearchChange, selectedCategory, onCategoryChange }) => {
  return (
    <FlexBox 
      justifyContent={FlexBoxJustifyContent.SpaceBetween} 
      alignItems={FlexBoxAlignItems.Center}
      style={{ 
        marginBottom: '2rem',
        gap: '1rem',
        flexWrap: 'wrap'
      }}
    >
      {/* Barra de búsqueda */}
      <div style={{ flex: '1 1 300px', minWidth: '250px' }}>
        <Input
          icon="search"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
      
      {/* Filtro de categoría */}
      <div style={{ flex: '0 0 200px' }}>
        <Select
          onChange={(e) => onCategoryChange(e.detail.selectedOption.dataset.value)}
          style={{ width: '100%' }}
        >
          <Option data-value="todas" selected={true}>Todas las categorías</Option>
        </Select>
      </div>
    </FlexBox>
  );
};

export default SearchAndFilters; 