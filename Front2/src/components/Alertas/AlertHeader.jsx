import React from "react";
import { Title, Text, Icon } from "@ui5/webcomponents-react";
import { styles } from "../../Styles/AlertasStyle";

export default function AlertHeader() {
  return (
    <div style={styles.header}>
      <div style={styles.headerLeft}>
        <Icon 
          name="alert" 
          style={styles.headerIcon}
        />
        <Title level="H1" style={styles.headerTitle}>
          Sistema de Alertas
        </Title>
      </div>
      <div style={styles.headerLocation}>
        <Icon 
          name="map" 
          style={styles.locationIcon}
        />
        <Text style={styles.locationText}>
          Plaza Comercial Reforma, Local 42B, CDMX
        </Text>
      </div>
    </div>
  );
} 