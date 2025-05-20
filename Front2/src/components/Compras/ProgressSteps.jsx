import React from 'react';
import { Text, Icon } from '@ui5/webcomponents-react';

const ProgressSteps = ({ steps, currentStep }) => {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",
      padding: "1rem 2rem",
      backgroundColor: "white",
      margin: "0 2rem",
      borderRadius: "0.5rem",
      boxShadow: "var(--sapContent_Shadow0)"
    }}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: 
                index < currentStep ? "var(--sapSuccessColor)" :
                index === currentStep ? "var(--sapSelectedColor)" :
                "var(--sapContent_NonInteractiveIconColor)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white"
            }}>
              {index < currentStep ? (
                <Icon name="accept" />
              ) : (
                index + 1
              )}
            </div>
            <Text 
              style={{
                color: index <= currentStep ? 'var(--sapTextColor)' : 'var(--sapContent_LabelColor)',
                fontWeight: index === currentStep ? '600' : '400'
              }}
            >
              {step.title}
            </Text>
          </div>
          {index < steps.length - 1 && (
            <div style={{
              flex: 1,
              height: "2px",
              backgroundColor: index < currentStep ? "var(--sapSuccessColor)" : "var(--sapContent_NonInteractiveIconColor)",
              maxWidth: "50px"
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressSteps; 