import React from "react";
import {
  FlexBox,
  FlexBoxAlignItems,
  FlexBoxJustifyContent,
  Button,
  Text,
  ButtonDesign
} from "@ui5/webcomponents-react";

export default function AlertPagination({ currentPage, totalPages, onPageChange }) {
  return (
    <FlexBox 
      justifyContent={FlexBoxJustifyContent.Center} 
      alignItems={FlexBoxAlignItems.Center}
      style={{ marginTop: "1rem" }}
    >
      <Button
        icon="nav-back"
        disabled={currentPage === 1}
        onClick={() => onPageChange({ detail: { page: currentPage - 1 }})}
        design={ButtonDesign.Transparent}
      />
      <Text style={{ margin: "0 1rem" }}>
        Página {currentPage} de {totalPages}
      </Text>
      <Button
        icon="navigation-right-arrow"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange({ detail: { page: currentPage + 1 }})}
        design={ButtonDesign.Transparent}
      />
    </FlexBox>
  );
} 