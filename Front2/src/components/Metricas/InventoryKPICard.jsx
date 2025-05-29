import React from 'react';
import { 
  Card, 
  Title, 
  Text, 
  FlexBox, 
  FlexBoxJustifyContent, 
  FlexBoxAlignItems, 
  Icon
} from '@ui5/webcomponents-react';

const InventoryKPICard = ({ 
  title, 
  icon, 
  value, 
  additionalInfo, 
  isMonetary = false,
  showDecimals = false
}) => {
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
        <Text style={{ color: 'var(--sapContent_LabelColor)', fontSize: '0.875rem' }}>
          {additionalInfo}
        </Text>
      </div>
    </Card>
  );
};

export default InventoryKPICard; 