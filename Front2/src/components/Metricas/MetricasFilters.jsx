import React from 'react';
import { FlexBox, FlexBoxAlignItems, Label, Select, Option } from '@ui5/webcomponents-react';

const MetricasFilters = ({ periodo, setPeriodo, vista, setVista }) => {
  return (
    <div style={{
      padding: "1rem",
      backgroundColor: "var(--sapList_Background)",
      borderRadius: "0.5rem",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      boxShadow: "var(--sapContent_Shadow0)"
    }}>
      <FlexBox alignItems={FlexBoxAlignItems.Center} gap="1rem">
        <Label>Período:</Label>
        <Select value={periodo} onChange={(e) => setPeriodo(e.detail.selectedOption.value)}>
          <Option value="mesActual">Mes Actual</Option>
          <Option value="mesAnterior">Mes Anterior</Option>
        </Select>
        <Label>Vista:</Label>
        <Select value={vista} onChange={(e) => setVista(e.detail.selectedOption.value)}>
          <Option value="general">General</Option>
          <Option value="detallada">Detallada</Option>
        </Select>
      </FlexBox>
    </div>
  );
};

export default MetricasFilters; 