import React from 'react';
import { 
  Card, 
  Title, 
  Text, 
  FlexBox, 
  FlexBoxJustifyContent, 
  FlexBoxAlignItems, 
  Icon, 
  ObjectStatus, 
  ValueState 
} from '@ui5/webcomponents-react';

const KPICard = ({ 
  title, 
  icon, 
  value, 
  change, 
  additionalInfo, 
  isMonetary = false,
  isNegative = false,
  showDecimals = false
}) => {
  const getValueStateFromChange = (change) => {
    if (isNegative) {
      // Para métricas negativas (como stock crítico), invertir la lógica
      if (change > 0) return ValueState.Error;
      if (change < 0) return ValueState.Success;
      return ValueState.None;
    } else {
      // Lógica normal para métricas positivas
      if (change > 0) return ValueState.Success;
      if (change < 0) return ValueState.Error;
      return ValueState.None;
    }
  };

  const formatValue = (value) => {
    if (typeof value === 'string') {
      return value; // Ya viene formateado (ej: "2.4%")
    }
    
    if (typeof value === 'number') {
      if (isMonetary) {
        return `$${value.toLocaleString()}`;
      }
      if (showDecimals) {
        return value.toFixed(1);
      }
      return value.toLocaleString();
    }
    
    return value;
  };

  const formatChange = (change) => {
    if (showDecimals) {
      return `${change.toFixed(1)}%`;
    }
    return `${change}%`;
  };

  return (
    <Card>
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        <FlexBox alignItems={FlexBoxAlignItems.Center} justifyContent={FlexBoxJustifyContent.SpaceBetween}>
          <Text>{title}</Text>
          <Icon name={icon} />
        </FlexBox>
        <Title level="H2" style={{ margin: '0.5rem 0', fontSize: '1.75rem' }}>
          {formatValue(value)}
        </Title>
        <ObjectStatus 
          state={getValueStateFromChange(change)}
          style={{ marginBottom: '0.5rem' }}
        >
          {formatChange(change)} vs periodo anterior
        </ObjectStatus>
        <Text style={{ color: 'var(--sapContent_LabelColor)', fontSize: '0.875rem' }}>
          {additionalInfo}
        </Text>
      </div>
    </Card>
  );
};

export default KPICard; 