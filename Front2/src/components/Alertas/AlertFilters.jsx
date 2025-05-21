import React from "react";
import {
  FlexBox,
  FlexBoxAlignItems,
  FlexBoxJustifyContent,
  FlexBoxWrap,
  Button,
  SegmentedButton,
  SegmentedButtonItem
} from "@ui5/webcomponents-react";

export default function AlertFilters({ selectedFilter, onFilterChange, onRefresh }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <FlexBox 
        justifyContent={FlexBoxJustifyContent.SpaceBetween}
        alignItems={FlexBoxAlignItems.Center}
        wrap={FlexBoxWrap.Wrap}
      >
        <FlexBox alignItems={FlexBoxAlignItems.Center}>
          <SegmentedButton
            style={{ marginRight: "1rem" }}
            onSelectionChange={(e) => onFilterChange(e.detail.selectedItem.getAttribute("data-key"))}
          >
            <SegmentedButtonItem data-key="all" icon="circle-task" selected={selectedFilter === "all"}>
              Todas
            </SegmentedButtonItem>
            <SegmentedButtonItem data-key="error" icon="message-error" selected={selectedFilter === "error"}>
              Críticas
            </SegmentedButtonItem>
            <SegmentedButtonItem data-key="warning" icon="message-warning" selected={selectedFilter === "warning"}>
              Advertencias
            </SegmentedButtonItem>
            <SegmentedButtonItem data-key="success" icon="message-success" selected={selectedFilter === "success"}>
              Resueltas
            </SegmentedButtonItem>
          </SegmentedButton>
        </FlexBox>
        
        <FlexBox>
          <Button 
            icon="refresh" 
            onClick={onRefresh}
            tooltip="Actualizar alertas"
          >
            Actualizar
          </Button>
        </FlexBox>
      </FlexBox>
    </div>
  );
} 