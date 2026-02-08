import * as React from "react";
import Page from "../components/Page";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router";
import AssetsService from "../services/assets";
import AssetsControls from "../components/assets/assetsControls";
import AssetsTable from "../components/assets/assetsTable";
import { aggregationOptions } from "../components/assets/tokens";
import { toCurrency } from "../util";

const Assets = () => {
  const [window, setWindow] = React.useState("7d");
  const [aggregateBy, setAggregateBy] = React.useState(
    aggregationOptions[0].value,
  );
  const [filters, setFilters] = React.useState([]);
  const [currency] = React.useState("USD");

  const [init, setInit] = React.useState(false);
  const [fetch, setFetch] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [errors, setErrors] = React.useState([]);

  const [assetsData, setAssetsData] = React.useState({});

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
      const resp = await AssetsService.fetchAssets(
        window,
        aggregateBy,
        filters,
      );
      setAssetsData(resp || {});
    } catch (err) {
      console.log(err);
      const secondary =
        err.message && err.message.length > 0
          ? err.message
          : "Please open an Issue with OpenCost if problems persist.";
      setErrors([
        {
          primary: "Failed to load assets data",
          secondary,
        },
      ]);
      setAssetsData({});
    }
    setLoading(false);
  }

  const assets = React.useMemo(() => {
    const list = assetsData?.assets ?? assetsData?.items ?? [];
    return Array.isArray(list) ? list : [];
  }, [assetsData]);

  const totalCost = React.useMemo(() => {
    if (typeof assetsData?.totalCost === "number") {
      return assetsData.totalCost;
    }
    return assets.reduce(
      (sum, asset) => sum + (asset?.totalCost || asset?.cost || 0),
      0,
    );
  }, [assetsData, assets]);

  React.useEffect(() => {
    setWindow(searchParams.get("window") || "7d");
    setAggregateBy(searchParams.get("agg") || "cluster");
  }, [routerLocation]);

  React.useEffect(() => {
    if (!init) {
      initialize();
    }
    if (init || fetch) {
      fetchData();
    }
  }, [init, fetch]);

  React.useEffect(() => {
    setFetch(!fetch);
  }, [window, aggregateBy, filters]);

  return (
    <Page active="assets.html">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h2 className="cds--heading-03" style={{ marginBottom: "0.5rem" }}>
            Assets
          </h2>
          <p className="cds--body-short-01">
            {window} · by {aggregateBy}
          </p>
        </div>
        <button
          type="button"
          className="cds--btn cds--btn--secondary"
          onClick={() => setFetch(true)}
        >
          Refresh
        </button>
      </div>
      {!loading && errors.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          {errors.map((error, index) => (
            <div
              key={`${error.primary}-${index}`}
              className="cds--inline-notification cds--inline-notification--error"
              role="alert"
              style={{ marginBottom: "0.75rem" }}
            >
              <div className="cds--inline-notification__details">
                <div className="cds--inline-notification__title">
                  {error.primary}
                </div>
                <div className="cds--inline-notification__subtitle">
                  {error.secondary}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {init && (
        <div className="cds--tile" id="assets" style={{ padding: "1.5rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <AssetsControls
              window={window}
              setWindow={(win) => {
                searchParams.set("window", win);
                navigate({
                  search: `?${searchParams.toString()}`,
                });
              }}
              aggregateBy={aggregateBy}
              setAggregateBy={(agg) => {
                setFilters([]);
                searchParams.set("agg", agg);
                navigate({
                  search: `?${searchParams.toString()}`,
                });
              }}
            />
          </div>

          {loading && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="cds--inline-loading">
                <div
                  className="cds--inline-loading__animation"
                  aria-label="Loading"
                />
                <p className="cds--inline-loading__text">
                  Loading assets data
                </p>
              </div>
            </div>
          )}

          {!loading && (
            <div>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  marginBottom: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <span className="cds--tag cds--tag--cyan">
                  <span className="cds--tag__label">
                    Total Cost: {toCurrency(totalCost, currency)}
                  </span>
                </span>
                <span className="cds--tag cds--tag--gray">
                  <span className="cds--tag__label">
                    Assets: {assets.length}
                  </span>
                </span>
              </div>
              <AssetsTable
                assets={assets}
                aggregateBy={aggregateBy}
                totalCost={totalCost}
                currency={currency}
              />
            </div>
          )}
        </div>
      )}

      <Footer />
    </Page>
  );
};

export default React.memo(Assets);
