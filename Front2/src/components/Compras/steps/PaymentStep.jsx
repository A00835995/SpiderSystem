import React from 'react';
import {
  Title,
  Text,
  Button,
  Icon,
  FlexBox,
  FlexBoxJustifyContent
} from '@ui5/webcomponents-react';

const PaymentStep = ({
  paymentMethods,
  selectedPaymentMethod,
  onPaymentMethodSelect,
  onNext,
  onBack
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '2rem',
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <Title level="H1" style={{
          fontSize: '1.75rem',
          color: 'var(--sapTextColor)',
          margin: 0
        }}>
          Pago
        </Title>
        <Text style={{
          fontSize: '1rem',
          color: 'var(--sapContent_LabelColor)',
          margin: 0
        }}>
          Selecciona el método de pago
        </Text>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => onPaymentMethodSelect(method.id)}
            style={{
              border: '1px solid var(--sapContent_ForegroundBorderColor)',
              borderRadius: '8px',
              padding: '1rem',
              cursor: 'pointer',
              backgroundColor: selectedPaymentMethod === method.id ? 'var(--sapList_SelectionBackgroundColor)' : 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'var(--sapSelectedColor)',
                backgroundColor: selectedPaymentMethod === method.id ? 'var(--sapList_SelectionBackgroundColor)' : 'var(--sapList_Hover_Background)'
              }
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flex: 1
            }}>
              <Icon
                name={
                  method.id === 1 ? "credit-card" :
                  method.id === 2 ? "money-bills" :
                  method.id === 3 ? "document" :
                  method.id === 4 ? "payment-approval" :
                  "cart"
                }
                style={{
                  fontSize: '1.25rem',
                  color: 'var(--sapContent_IconColor)'
                }}
              />
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}>
                <Text style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--sapTextColor)',
                  margin: 0
                }}>
                  {method.name}
                </Text>
                <Text style={{
                  color: 'var(--sapContent_LabelColor)',
                  fontSize: '0.875rem',
                  margin: 0
                }}>
                  {method.description}
                </Text>
              </div>
            </div>
            {selectedPaymentMethod === method.id && (
              <Icon
                name="accept"
                style={{
                  color: 'var(--sapSuccessColor)',
                  fontSize: '1.25rem'
                }}
              />
            )}
          </div>
        ))}
      </div>

      <FlexBox
        justifyContent={FlexBoxJustifyContent.SpaceBetween}
        style={{
          marginTop: 'auto',
          paddingTop: '2rem',
          borderTop: '1px solid var(--sapContent_ForegroundBorderColor)'
        }}
      >
        <Button
          design="Default"
          onClick={onBack}
          style={{
            minWidth: '120px'
          }}
        >
          Atrás
        </Button>
        <Button
          design="Emphasized"
          onClick={onNext}
          disabled={!selectedPaymentMethod}
          style={{
            minWidth: '120px'
          }}
        >
          Continuar
        </Button>
      </FlexBox>
    </div>
  );
};

export default PaymentStep;