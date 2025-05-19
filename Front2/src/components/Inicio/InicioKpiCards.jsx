import React from "react";
import { Icon, Text } from "@ui5/webcomponents-react";

export default function KpiCards({ cards, styles }) {
  return (
    <div style={styles.kpiSection}>
      {cards.map((card, index) => (
        <div key={index} style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <Icon
              name={card.icon}
              style={{
                color: `var(--sapIndicationColor_${card.state})`,
                fontSize: "1.5rem"
              }}
            />
          </div>
          <Text style={styles.kpiValue}>{card.value}</Text>
          <Text style={styles.kpiLabel}>{card.subtitle}</Text>
        </div>
      ))}
    </div>
  );
}