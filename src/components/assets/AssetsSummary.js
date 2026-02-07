import * as React from "react";
import { Grid, Paper, Typography, Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toCurrency } from "../../util";
import { colors } from "./tokens";

const SummaryCard = ({ title, value, icon: Icon, color }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <Paper
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "20px",
        textAlign: "center",
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `2px solid ${color}30`,
        borderRadius: "8px",
        transition: "all 0.3s ease",
        cursor: "pointer",
        boxShadow: isHovered ? `0 4px 12px ${color}20` : "0 1px 3px rgba(0,0,0,0.08)",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <Box style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
        {Icon && <Icon style={{ fontSize: "28px", color: color, marginRight: "8px" }} />}
      </Box>
      <Typography variant="body2" style={{ color: colors.textSecondary, marginBottom: "8px" }}>
        {title}
      </Typography>
      <Typography variant="h6" style={{ color: color, fontWeight: 600 }}>
        {value}
      </Typography>
    </Paper>
  );
};

const AssetsSummary = ({ data, currency = "USD" }) => {
  const calculateTotals = React.useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalCost: 0,
        totalCpuCost: 0,
        totalRamCost: 0,
        totalGpuCost: 0,
        totalAssets: 0,
      };
    }

    return {
      totalCost: data.reduce((sum, item) => sum + (item.cost || 0), 0),
      totalCpuCost: data.reduce((sum, item) => sum + (item.cpuCost || 0), 0),
      totalRamCost: data.reduce((sum, item) => sum + (item.ramCost || 0), 0),
      totalGpuCost: data.reduce((sum, item) => sum + (item.gpuCost || 0), 0),
      totalAssets: data.length,
    };
  }, [data]);

  const summaryCards = [
    {
      title: "Total Cost",
      value: toCurrency(calculateTotals.totalCost, currency),
      color: colors.primary,
      icon: null,
    },
    {
      title: "CPU Cost",
      value: toCurrency(calculateTotals.totalCpuCost, currency),
      color: colors.success,
      icon: null,
    },
    {
      title: "RAM Cost",
      value: toCurrency(calculateTotals.totalRamCost, currency),
      color: colors.warning,
      icon: null,
    },
    {
      title: "GPU Cost",
      value: toCurrency(calculateTotals.totalGpuCost, currency),
      color: colors.danger,
      icon: null,
    },
    {
      title: "Total Assets",
      value: calculateTotals.totalAssets.toString(),
      color: colors.info,
      icon: null,
    },
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Grid container spacing={2} style={{ marginBottom: "24px" }}>
      {summaryCards.map((card, idx) => (
        <Grid 
          item 
          xs={12} 
          sm={6} 
          md={isTablet ? 6 : 4} 
          lg={isMobile ? 12 : 2.4}
          key={idx}
        >
          <SummaryCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
};

export default AssetsSummary;
