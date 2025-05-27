import React from 'react';
import { FlexBox, FlexBoxAlignItems, Icon, Title } from '@ui5/webcomponents-react';

const VentasHeader = () => {
  return (
    <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ 
      marginBottom: '2rem',
      padding: '0.5rem 0'
    }}>
      <Icon name="cart" style={{ marginRight: '1rem', fontSize: '2rem', color: '#0854a0' }} />
      <Title level="H1" style={{ margin: 0, color: '#333' }}>Ventas - Super Shoes</Title>
    </FlexBox>
  );
};

export default VentasHeader; 