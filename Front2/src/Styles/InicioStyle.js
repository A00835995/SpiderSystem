export const styles = {
  pageContainer: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "var(--sapBackgroundColor)",
    position: "relative"
  },
  mainContent: {
    flex: 1,
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "100%"
  },
  kpiSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1rem",
    width: "100%"
  },
  container: {
    padding: "2rem",
    backgroundColor: "var(--sapBackgroundColor)",
    minHeight: "100vh"
  },
  header: {
    marginBottom: "2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 1rem"
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: "600",
    color: "var(--sapTitleColor)",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  subtitle: {
    color: "var(--sapContent_LabelColor)",
    fontSize: "0.875rem"
  },
  kpiCard: {
    backgroundColor: "var(--sapTile_Background)",
    borderRadius: "0.75rem",
    padding: "1.5rem",
    border: "1px solid var(--sapContent_ForegroundBorderColor)",
    boxShadow: "var(--sapContent_Shadow0)",
    transition: "all 0.2s ease-in-out",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "var(--sapContent_Shadow1)"
    }
  },
  kpiHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%"
  },
  kpiValue: {
    fontSize: "2rem",
    fontWeight: "600",
    color: "var(--sapTitleColor)"
  },
  kpiLabel: {
    color: "var(--sapContent_LabelColor)",
    fontSize: "0.875rem"
  },
  kpiTrend: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.875rem",
    marginTop: "auto"
  },
  ordersCard: {
    backgroundColor: "var(--sapTile_Background)",
    borderRadius: "0.75rem",
    border: "1px solid var(--sapContent_ForegroundBorderColor)",
    boxShadow: "var(--sapContent_Shadow0)",
    overflow: "hidden"
  },
  ordersTable: {
    "& .ui5-table-header": {
      backgroundColor: "transparent",
      borderBottom: "1px solid var(--sapList_BorderColor)"
    },
    "& .ui5-table-row": {
      borderBottom: "1px solid var(--sapList_BorderColor)",
      "&:hover": {
        backgroundColor: "var(--sapList_Hover_Background)"
      }
    }
  },
  categoryCard: {
    backgroundColor: "var(--sapTile_Background)",
    borderRadius: "0.75rem",
    border: "1px solid var(--sapContent_ForegroundBorderColor)",
    boxShadow: "var(--sapContent_Shadow0)",
    overflow: "hidden"
  },
  categoryItem: {
    padding: "1rem",
    borderBottom: "1px solid var(--sapContent_ForegroundBorderColor)",
    "&:last-child": {
      borderBottom: "none"
    }
  },
  categoryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.75rem"
  },
  categoryName: {
    fontSize: "0.875rem",
    color: "var(--sapTitleColor)",
    fontWeight: "500"
  },
  categoryValue: {
    fontSize: "0.875rem",
    color: "var(--sapTitleColor)",
    fontWeight: "600"
  },
  progressBar: {
    height: "0.5rem",
    backgroundColor: "var(--sapList_HeaderBackground)",
    borderRadius: "0.25rem",
    overflow: "hidden",
    marginBottom: "0.5rem"
  },
  progressFill: {
    height: "100%",
    borderRadius: "0.25rem",
    transition: "width 0.3s ease"
  },
  progressLabel: {
    fontSize: "0.75rem",
    color: "var(--sapContent_LabelColor)",
    textAlign: "right"
  },
  productsSection: {
    marginTop: "2rem",
    padding: "0 1rem"
  },
  productsHeader: {
    marginBottom: "1rem"
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1.5rem"
  },
  productCard: {
    backgroundColor: "var(--sapTile_Background)",
    borderRadius: "0.75rem",
    overflow: "hidden",
    transition: "all 0.2s ease-in-out",
    border: "1px solid var(--sapContent_ForegroundBorderColor)",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "var(--sapContent_Shadow2)"
    }
  },
  productImageContainer: {
    position: "relative",
    width: "100%",
    height: "200px",
    overflow: "hidden",
    backgroundColor: "var(--sapList_Background)",
    flexShrink: 0
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
    display: "block"
  },
  productInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "var(--sapTile_Background)",
    padding: "1rem"
  },
  productHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "0.75rem"
  },
  productName: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "var(--sapTitleColor)",
    marginBottom: "0.25rem"
  },
  productPrice: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "var(--sapHighlightColor)",
    marginBottom: "0.75rem"
  },
  productMetrics: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginTop: "auto"
  },
  metricRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  metricLabel: {
    fontSize: "0.875rem",
    color: "var(--sapContent_LabelColor)"
  },
  metricValue: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "var(--sapTextColor)"
  },
  stockIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: "0.75rem"
  },
  stockDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%"
  },
  stockText: {
    fontSize: "0.875rem",
    fontWeight: "500"
  },
  statusBadge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "1rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    display: "inline-block",
    textAlign: "center"
  },
  // Estados específicos
  pendiente: {
    backgroundColor: "#FFF4E5",
    color: "#E9730C",
    border: "1px solid #E9730C"
  },
  enProceso: {
    backgroundColor: "#EAF6FF",
    color: "#0854A0",
    border: "1px solid #0854A0"
  },
  completada: {
    backgroundColor: "#F1FFE5",
    color: "#107E3E",
    border: "1px solid #107E3E"
  },
  enTransito: {
    backgroundColor: "#FFF0FA",
    color: "#A100C2",
    border: "1px solid #A100C2"
  }
};
