import React from "react";
import { Text, Icon, Select, Option, Button } from "@ui5/webcomponents-react";

export default function InventoryFilters({ 
  selectedCategory, 
  timeRange, 
  onCategoryChange, 
  onTimeRangeChange, 
  onResetFilters 
}) {
  return (
    <div style={{
      padding: "0.5rem 1rem",
      backgroundColor: "var(--sapList_Background)",
      borderRadius: "0.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "var(--sapContent_Shadow0)",
      margin: "0.5rem 0"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <Icon name="filter" />
          <Text>Categoría:</Text>
          <Select
            onChange={(event) => onCategoryChange(event.detail.selectedOption.value)}
          >
            <Option value="all" selected={selectedCategory === "all"}>Todas las categorías</Option>
            <Option value="deportivo" selected={selectedCategory === "deportivo"}>Calzado Deportivo</Option>
            <Option value="casual" selected={selectedCategory === "casual"}>Calzado Casual</Option>
            <Option value="formal" selected={selectedCategory === "formal"}>Calzado Formal</Option>
            <Option value="playa" selected={selectedCategory === "playa"}>Calzado para Playa</Option>
          </Select>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <Icon name="calendar" />
          <Text>Período:</Text>
          <Select
            onChange={(event) => onTimeRangeChange(event.detail.selectedOption.value)}
          >
            <Option value="mesActual" selected={timeRange === "mesActual"}>Mes Actual</Option>
            <Option value="mesPasado" selected={timeRange === "mesPasado"}>Mes Pasado</Option>
          </Select>
        </div>
        <Button 
          icon="refresh"
          design="Transparent"
          onClick={onResetFilters}
        >
          Reiniciar Filtros
        </Button>
      </div>
    </div>
  );
} 