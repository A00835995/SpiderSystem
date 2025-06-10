import React from "react";
import {
  FlexBox,
  FlexBoxDirection,
  FlexBoxAlignItems,
  FlexBoxJustifyContent,
  Text,
  List,
  StandardListItem,
  Icon,
  Card,
  IllustratedMessage,
  IllustrationMessageType,
  BusyIndicator
} from "@ui5/webcomponents-react";
import { styles } from "../../Styles/AlertasStyle";
import AlertPagination from "./AlertPagination";

export default function AlertList({
  alerts,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onAlertClick,
  getValueState,
  getCategoryIcon
}) {
  if (isLoading) {
    return (
      <FlexBox 
        direction={FlexBoxDirection.Column}
        justifyContent={FlexBoxJustifyContent.Center}
        alignItems={FlexBoxAlignItems.Center}
        style={{ height: "400px" }}
      >
        <BusyIndicator size="Large" />
        <Text style={{ marginTop: "1rem" }}>Cargando alertas...</Text>
      </FlexBox>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <IllustratedMessage
          name={IllustrationMessageType.NoData}
          titleText="No hay alertas que mostrar"
          subtitleText="No se encontraron alertas con los filtros seleccionados"
          style={{ margin: "2rem 0" }}
        />
      </Card>
    );
  }

  return (
    <>
      <Text style={{ marginBottom: "1rem" }}>
        Mostrando {alerts.length} {alerts.length === 1 ? "alerta" : "alertas"} (Página {currentPage} de {totalPages})
      </Text>
      
      <List>
        {alerts.map(alert => (
          <StandardListItem
            key={alert.id}
            icon={getCategoryIcon(alert.category)}
            iconEnd={alert.isResolved ? <Icon name="message-success" /> : null}
            info={alert.status}
            infoState={getValueState(alert.type)}
            style={{ 
              ...styles.alertItem,
              ...(alert.type === "error" ? styles.alertItemError : 
                 alert.type === "warning" ? styles.alertItemWarning : 
                 alert.type === "success" ? styles.alertItemSuccess : {}),
              opacity: alert.isResolved ? 0.7 : 1
            }}
            onClick={() => onAlertClick(alert)}
          >
            {alert.title}
          </StandardListItem>
        ))}
      </List>
      
      {totalPages > 1 && (
        <div style={styles.paginationBar}>
          <AlertPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
} 