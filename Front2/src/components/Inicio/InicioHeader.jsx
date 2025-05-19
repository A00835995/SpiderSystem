import React from "react";
import { Icon, Title, Text } from "@ui5/webcomponents-react";

export default function InicioHeader() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      backgroundColor: "var(--sapBackgroundColor)",
      padding: "1.25rem",
      borderRadius: "0.5rem",
      boxShadow: "var(--sapContent_Shadow0)",
      marginTop: "0.5rem",
      minHeight: "72px"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem"
      }}>
        <Icon 
          name="retail-store" 
          style={{
            fontSize: "1.75rem",
            color: "var(--sapContent_IconColor)"
          }}
        />
        <Title level="H1" style={{
          margin: 0,
          fontSize: "1.75rem",
          color: "var(--sapTextColor)",
          padding: "0.25rem 0"
        }}>
          Dashboard Super Shoes
        </Title>
      </div>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}>
        <Icon 
          name="map" 
          style={{
            fontSize: "1rem",
            color: "var(--sapContent_IconColor)"
          }}
        />
        <Text style={{
          fontSize: "0.875rem",
          color: "var(--sapContent_LabelColor)"
        }}>
          Plaza Comercial Reforma, Local 42B, CDMX
        </Text>
      </div>
    </div>
  );
}