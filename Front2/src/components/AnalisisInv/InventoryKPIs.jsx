import React from "react";
import { Text, Icon, ObjectStatus } from "@ui5/webcomponents-react";
import { styles } from "../../Styles/InicioStyle";

export default function InventoryKPIs({ kpiCards }) {
  return (
    <div style={styles.kpiSection}>
      {kpiCards.map((card, index) => (
        <div key={index} style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <Icon 
              name={card.icon} 
              style={{ 
                color: `var(--sapIndicationColor_${card.state})`,
                fontSize: "1.5rem"
              }} 
            />
            <ObjectStatus state={card.state}>
              {card.trend}
            </ObjectStatus>
          </div>
          <Text style={{
            fontSize: "0.875rem",
            color: "var(--sapContent_LabelColor)",
            marginBottom: "0.25rem"
          }}>{card.title}</Text>
          <Text style={styles.kpiValue}>{card.value}</Text>
          <Text style={styles.kpiLabel}>{card.subtitle}</Text>
        </div>
      ))}
    </div>
  );
} 