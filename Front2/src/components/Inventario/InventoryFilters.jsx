import React from "react";
import {
  FilterBar,
  FilterGroupItem,
  Input,
  MultiComboBox,
  MultiComboBoxItem
} from "@ui5/webcomponents-react";

export default function InventoryFilters({
  searchQuery,
  handleSearch,
  categorias,
  ubicaciones,
  handleCategoriesChange,
  handleLocationsChange,
  handleEstadosChange,
  selectedEstados,
  handleClearFilters,
  styles
}) {
  return (
    <FilterBar
      showGoButton={false}
      showRestoreButton
      showClearButton
      onClear={handleClearFilters}
      className={styles.filterBar}
    >
      <FilterGroupItem label="Búsqueda">
        <Input
          placeholder="Buscar por nombre o SKU"
          value={searchQuery}
          onChange={handleSearch}
          icon="search"
          className={styles.inputFullWidth}
        />
      </FilterGroupItem>

      <FilterGroupItem label="Categoría">
        <MultiComboBox
          onSelectionChange={handleCategoriesChange}
          placeholder="Filtrar por categoría"
        >
          {categorias.map((cat, index) => (
            <MultiComboBoxItem key={index} text={cat} />
          ))}
        </MultiComboBox>
      </FilterGroupItem>

      <FilterGroupItem label="Ubicación">
        <MultiComboBox
          onSelectionChange={handleLocationsChange}
          placeholder="Filtrar por ubicación"
        >
          {ubicaciones.map((loc, index) => (
            <MultiComboBoxItem key={index} text={loc} />
          ))}
        </MultiComboBox>
      </FilterGroupItem>

      <FilterGroupItem label="Estado">
        <MultiComboBox
          onSelectionChange={handleEstadosChange}
          placeholder="Filtrar por estado"
        >
          <MultiComboBoxItem text="Disponible" />
          <MultiComboBoxItem text="Bajo stock" />
          <MultiComboBoxItem text="Agotado" />
        </MultiComboBox>
      </FilterGroupItem>
    </FilterBar>
  );
}
