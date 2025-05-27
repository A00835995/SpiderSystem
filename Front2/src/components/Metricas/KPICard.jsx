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
  isMonetary = false 
}) => {
  const getValueStateFromChange = (change) => {
    if (change > 0) return ValueState.Success;
    if (change < 0) return ValueState.Error;
    return ValueState.None;
  };

  const formatValue = (value) => {
    if (isMonetary) {
      return `$${value.toLocaleString()}`;
    }
    return typeof value === 'number' ? value.toLocaleString() : value;
  };

  return (
    <Card>
      <div style={{ padding: '1rem' }}>
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
          {change}% vs periodo anterior
        </ObjectStatus>
        <Text style={{ color: 'var(--sapContent_LabelColor)', fontSize: '0.875rem' }}>
          {additionalInfo}
        </Text>
      </div>
    </Card>
  );
};

export default KPICard; 