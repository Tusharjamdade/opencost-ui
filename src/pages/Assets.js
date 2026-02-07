import * as React from "react";
import Page from "../components/Page";
import Header from "../components/Header";
import Footer from "../components/Footer";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Paper, Typography, CircularProgress, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { get, find } from "lodash";
import { useLocation, useNavigate } from "react-router";

import { checkCustomWindow, toVerboseTimeRange } from "../util";
import Subtitle from "../components/Subtitle";
import Warnings from "../components/Warnings";
import AssetsService from "../services/assets";
import AssetsSummary from "../components/assets/AssetsSummary";
import AssetsChart from "../components/assets/AssetsChart";
import AssetsTable from "../components/assets/AssetsTable";
import SelectWindow from "../components/SelectWindow";
import { currencyCodes } from "../constants/currencyCodes";

// Define window options for the Assets API
const windowOptions = [
  { name: "Last 7 Days", value: "7d" },
  { name: "Today", value: "today" },
  { name: "Last Week", value: "lastweek" },
  { name: "Last Month", value: "month" },
  { name: "Last 30 Days", value: "30d" },
  { name: "Last 90 Days", value: "90d" },
];

const Assets = () => {
  // Form state
  const [title, setTitle] = React.useState("Assets for last 7 days");
  const [window, setWindow] = React.useState(windowOptions[0].value);
  const [currency, setCurrency] = React.useState("USD");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Page and settings state
  const [init, setInit] = React.useState(false);
  const [fetch, setFetch] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [errors, setErrors] = React.useState([]);

  // Data
  const [assetsData, setAssetsData] = React.useState([]);

  function generateTitle({ window }) {
    let windowName = get(find(windowOptions, { value: window }), "name", "");
    if (windowName === "") {
      if (checkCustomWindow(window)) {
        windowName = toVerboseTimeRange(window);
      } else {
        console.warn(`unknown window: ${window}`);
      }
    }

    return `Assets for ${windowName}`;
  }

  // Parse any context information from the URL
  const routerLocation = useLocation();
  const searchParams = new URLSearchParams(routerLocation.search);
  const navigate = useNavigate();

  async function initialize() {
    setInit(true);
  }

  async function fetchData() {
    setLoading(true);
    setErrors([]);
    try {
      const resp = await AssetsService.fetchAssetsData(window);
      console.log("[v0] Assets data received:", resp);
      
      if (resp && resp.data) {
        // Transform the API response to match our table structure
        const transformedData = transformAssetsData(resp.data);
        setAssetsData(transformedData);
      } else if (resp && Array.isArray(resp)) {
        const transformedData = transformAssetsData(resp);
        setAssetsData(transformedData);
      } else {
        setAssetsData([]);
        if (!resp) {
          setErrors([
            {
              primary: "No assets data available",
              secondary: "Try a different time window or check your OpenCost configuration.",
            },
          ]);
        }
      }
    } catch (err) {
      console.error("[v0] Error fetching assets:", err);
      if (err.message.indexOf("404") === 0) {
        setErrors([
          {
            primary: "Assets API not available",
            secondary:
              "Please ensure your OpenCost instance supports the Assets API and is properly configured.",
          },
        ]);
      } else {
        let secondary =
          "Please check your OpenCost configuration and try again.";
        if (err.message.length > 0) {
          secondary = err.message;
        }
        setErrors([
          {
            primary: "Failed to load assets data",
            secondary: secondary,
          },
        ]);
      }
      setAssetsData([]);
    }
    setLoading(false);
  }

  function transformAssetsData(data) {
    // Handle different response formats from the API
    if (Array.isArray(data)) {
      return data.map((asset, idx) => ({
        name: asset.name || `Asset ${idx + 1}`,
        type: asset.type || "Unknown",
        provider: asset.provider || asset.providerID || "-",
        cluster: asset.cluster || "-",
        namespace: asset.namespace || "-",
        cost: parseFloat(asset.totalCost || asset.cost || 0),
        cpuCost: parseFloat(asset.cpuCost || 0),
        ramCost: parseFloat(asset.ramCost || asset.memCost || 0),
        gpuCost: parseFloat(asset.gpuCost || 0),
      }));
    }

    // Handle object response format
    if (data && typeof data === "object") {
      return Object.entries(data).map(([key, asset]) => ({
        name: asset.name || key,
        type: asset.type || "Unknown",
        provider: asset.provider || asset.providerID || "-",
        cluster: asset.cluster || "-",
        namespace: asset.namespace || "-",
        cost: parseFloat(asset.totalCost || asset.cost || 0),
        cpuCost: parseFloat(asset.cpuCost || 0),
        ramCost: parseFloat(asset.ramCost || asset.memCost || 0),
        gpuCost: parseFloat(asset.gpuCost || 0),
      }));
    }

    return [];
  }

  React.useEffect(() => {
    setWindow(searchParams.get("window") || "7d");
    setCurrency(searchParams.get("currency") || "USD");
  }, [routerLocation]);

  // Initialize once, then fetch report each time setFetch(true) is called
  React.useEffect(() => {
    if (!init) {
      initialize();
    }
    if (init || fetch) {
      fetchData();
    }
  }, [init, fetch]);

  React.useEffect(() => {
    setFetch(false);
    setTitle(generateTitle({ window }));
  }, [window]);

  return (
    <Page active="/assets">
      <Header headerTitle="Assets">
        <IconButton aria-label="refresh" onClick={() => setFetch(true)}>
          <RefreshIcon />
        </IconButton>
      </Header>

      {!loading && errors.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <Warnings warnings={errors} />
        </div>
      )}

      {init && (
        <div>
          <Paper id="assets">
            <div style={{ display: "flex", flexFlow: "row", padding: 24 }}>
              <div style={{ flexGrow: 1 }}>
                <Typography variant="h5">{title}</Typography>
                <Subtitle report={{ window }} />
              </div>
              <div style={{ 
                flex: "0 0 auto", 
                display: "flex", 
                gap: isMobile ? "8px" : "16px",
                flexFlow: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-end" : "flex-start",
              }}>
                <SelectWindow
                  options={windowOptions}
                  value={window}
                  onChange={(newWindow) => {
                    searchParams.set("window", newWindow);
                    navigate({
                      search: `?${searchParams.toString()}`,
                    });
                  }}
                />
                <div style={{ minWidth: isMobile ? "120px" : "140px" }}>
                  <label style={{ fontSize: "12px", color: "#525252", display: "block", marginBottom: "4px" }}>
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => {
                      searchParams.set("currency", e.target.value);
                      navigate({
                        search: `?${searchParams.toString()}`,
                      });
                    }}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #bdbdbd",
                      fontSize: "14px",
                      width: "100%",
                    }}
                  >
                    {currencyCodes.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {loading && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ paddingTop: 100, paddingBottom: 100 }}>
                  <CircularProgress />
                </div>
              </div>
            )}

            {!loading && (
              <div style={{ padding: "0 24px 24px 24px" }}>
                <AssetsSummary data={assetsData} currency={currency} />
                <AssetsChart data={assetsData} currency={currency} />
                <AssetsTable data={assetsData} currency={currency} />
              </div>
            )}
          </Paper>
        </div>
      )}
      <Footer />
    </Page>
  );
};

export default React.memo(Assets);
