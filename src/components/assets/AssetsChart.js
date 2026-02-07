import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Paper, Typography, Box, Tabs, Tab, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toCurrency } from "../../util";
import { colors } from "./tokens";

const CHART_COLORS = [colors.primary, colors.success, colors.warning, colors.danger];

const AssetsChart = ({ data, currency = "USD" }) => {
  const [tabValue, setTabValue] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  if (!data || data.length === 0) {
    return (
      <Paper style={{ padding: "24px", marginTop: "16px" }}>
        <Typography color="textSecondary" align="center">
          No chart data available
        </Typography>
      </Paper>
    );
  }

  // Prepare data for bar chart
  const chartData = data.slice(0, 10).map((item) => ({
    name: isMobile ? item.name?.substring(0, 8) : item.name?.substring(0, 15) || "Unknown",
    cost: item.cost || 0,
    cpuCost: item.cpuCost || 0,
    ramCost: item.ramCost || 0,
    gpuCost: item.gpuCost || 0,
  }));

  // Prepare data for pie chart (cost breakdown by type)
  const costByType = React.useMemo(() => {
    const breakdown = {
      CPU: 0,
      RAM: 0,
      GPU: 0,
      Other: 0,
    };
    data.forEach((item) => {
      breakdown.CPU += item.cpuCost || 0;
      breakdown.RAM += item.ramCost || 0;
      breakdown.GPU += item.gpuCost || 0;
    });
    breakdown.Other = Math.max(
      0,
      data.reduce((sum, item) => sum + (item.cost || 0), 0) -
        breakdown.CPU -
        breakdown.RAM -
        breakdown.GPU
    );
    return Object.entries(breakdown)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [data]);

  return (
    <Paper style={{ padding: "24px", marginTop: "16px" }}>
      <Box style={{ borderBottom: "1px solid #e0e0e0", marginBottom: "16px" }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Top Assets by Cost" />
          <Tab label="Cost Breakdown by Type" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <div style={{ width: "100%", height: isMobile ? "300px" : "400px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: isMobile ? 100 : 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.gray200} />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={isMobile ? 100 : 80}
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <YAxis
                label={{ value: `Cost (${currency})`, angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "4px",
                }}
                formatter={(value) => toCurrency(value, currency)}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar dataKey="cpuCost" stackId="cost" fill={colors.success} name="CPU Cost" />
              <Bar dataKey="ramCost" stackId="cost" fill={colors.warning} name="RAM Cost" />
              <Bar dataKey="gpuCost" stackId="cost" fill={colors.danger} name="GPU Cost" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {tabValue === 1 && (
        <div style={{ width: "100%", height: isMobile ? "300px" : "400px", display: "flex", justifyContent: "center" }}>
          {costByType.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={isMobile ? 80 : 120}
                  fill={colors.primary}
                  dataKey="value"
                >
                  {costByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => toCurrency(value, currency)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Typography color="textSecondary">No cost breakdown data available</Typography>
          )}
        </div>
      )}
    </Paper>
  );
};

export default AssetsChart;
