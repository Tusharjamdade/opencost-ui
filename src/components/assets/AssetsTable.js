import * as React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toCurrency } from "../../util";
import { colors } from "./tokens";

const AssetsTable = ({ data, currency = "USD" }) => {
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("cost");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!data || data.length === 0) {
    return (
      <Paper style={{ padding: "24px", marginTop: "16px" }}>
        <Typography color="textSecondary" align="center">
          No asset data available
        </Typography>
      </Paper>
    );
  }

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = React.useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const aValue = a[orderBy] ?? 0;
      const bValue = b[orderBy] ?? 0;

      if (aValue < bValue) {
        return order === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [data, order, orderBy]);

  // Responsive columns - show only essential columns on mobile
  const columns = isMobile ? [
    { id: "name", label: "Asset", numeric: false },
    { id: "cost", label: "Cost", numeric: true },
    { id: "cpuCost", label: "CPU", numeric: true },
  ] : [
    { id: "name", label: "Asset Name", numeric: false },
    { id: "type", label: "Type", numeric: false },
    { id: "provider", label: "Provider", numeric: false },
    { id: "cluster", label: "Cluster", numeric: false },
    { id: "namespace", label: "Namespace", numeric: false },
    { id: "cost", label: "Cost", numeric: true },
    { id: "cpuCost", label: "CPU Cost", numeric: true },
    { id: "ramCost", label: "RAM Cost", numeric: true },
    { id: "gpuCost", label: "GPU Cost", numeric: true },
  ];

  return (
    <TableContainer component={Paper} style={{ marginTop: "16px", overflowX: "auto" }}>
      <Table size={isMobile ? "small" : "medium"}>
        <TableHead>
          <TableRow style={{ backgroundColor: colors.gray100 }}>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.numeric ? "right" : "left"}
                style={{
                  fontWeight: 600,
                  color: colors.textPrimary,
                  borderBottom: `2px solid ${colors.border}`,
                  fontSize: isMobile ? "12px" : "14px",
                }}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : "asc"}
                  onClick={() => handleSort(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row, idx) => (
            <TableRow
              key={idx}
              hover
              style={{
                backgroundColor: idx % 2 === 0 ? colors.background : colors.gray100,
                transition: "all 0.2s ease",
              }}
            >
              {isMobile ? (
                <>
                  <TableCell style={{ fontSize: "12px" }}>{row.name || "-"}</TableCell>
                  <TableCell align="right" style={{ fontWeight: 500, fontSize: "12px" }}>
                    {toCurrency(row.cost || 0, currency)}
                  </TableCell>
                  <TableCell align="right" style={{ fontSize: "12px" }}>
                    {toCurrency(row.cpuCost || 0, currency)}
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{row.name || "-"}</TableCell>
                  <TableCell>{row.type || "-"}</TableCell>
                  <TableCell>{row.provider || "-"}</TableCell>
                  <TableCell>{row.cluster || "-"}</TableCell>
                  <TableCell>{row.namespace || "-"}</TableCell>
                  <TableCell align="right" style={{ fontWeight: 500 }}>
                    {toCurrency(row.cost || 0, currency)}
                  </TableCell>
                  <TableCell align="right">
                    {toCurrency(row.cpuCost || 0, currency)}
                  </TableCell>
                  <TableCell align="right">
                    {toCurrency(row.ramCost || 0, currency)}
                  </TableCell>
                  <TableCell align="right">
                    {toCurrency(row.gpuCost || 0, currency)}
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AssetsTable;
