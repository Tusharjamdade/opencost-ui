import * as React from "react";
import { toCurrency } from "../../util";

const getAssetName = (asset, aggregateBy) =>
  asset?.aggregationProperties?.[aggregateBy] ||
  asset?.properties?.[aggregateBy] ||
  asset?.[aggregateBy] ||
  asset?.name ||
  asset?.assetName ||
  "Unallocated";

const AssetsTable = ({ assets, aggregateBy, totalCost, currency = "USD" }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const numData = assets.length;
  const lastPage = Math.floor(numData / rowsPerPage);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const pageRows = assets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  React.useEffect(() => {
    setPage(0);
  }, [numData]);

  if (assets.length === 0) {
    return <p className="cds--body-short-01">No results</p>;
  }

  return (
    <div id="assets-table">
      <div className="cds--data-table-container">
        <table className="cds--data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th style={{ textAlign: "right" }}>Total Cost</th>
              <th style={{ textAlign: "right" }}>CPU</th>
              <th style={{ textAlign: "right" }}>RAM</th>
              <th style={{ textAlign: "right" }}>GPU</th>
              <th style={{ textAlign: "right" }}>PV</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600 }}>Total</td>
              <td />
              <td style={{ textAlign: "right", fontWeight: 600 }}>
                {toCurrency(totalCost, currency)}
              </td>
              <td />
              <td />
              <td />
              <td />
            </tr>
            {pageRows.map((asset, index) => (
              <tr key={asset?.name || asset?.assetName || index}>
                <td>{getAssetName(asset, aggregateBy)}</td>
                <td>
                  {asset?.type ||
                    asset?.assetType ||
                    asset?.classification ||
                    "-"}
                </td>
                <td style={{ textAlign: "right" }}>
                  {toCurrency(asset?.totalCost || asset?.cost || 0, currency)}
                </td>
                <td style={{ textAlign: "right" }}>
                  {toCurrency(asset?.cpuCost || 0, currency)}
                </td>
                <td style={{ textAlign: "right" }}>
                  {toCurrency(asset?.ramCost || 0, currency)}
                </td>
                <td style={{ textAlign: "right" }}>
                  {toCurrency(asset?.gpuCost || 0, currency)}
                </td>
                <td style={{ textAlign: "right" }}>
                  {toCurrency(asset?.pvCost || 0, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className="cds--pagination"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <button
          type="button"
          className="cds--btn cds--btn--ghost"
          disabled={page === 0}
          onClick={() => handleChangePage(null, page - 1)}
        >
          Previous
        </button>
        <span className="cds--body-short-01">
          Page {Math.min(page + 1, lastPage + 1)} of {lastPage + 1}
        </span>
        <button
          type="button"
          className="cds--btn cds--btn--ghost"
          disabled={page >= lastPage}
          onClick={() => handleChangePage(null, page + 1)}
        >
          Next
        </button>
        <div className="cds--select">
          <label className="cds--label" htmlFor="assets-page-size">
            Items per page
          </label>
          <div className="cds--select-input__wrapper">
            <select
              id="assets-page-size"
              className="cds--select-input"
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
            >
              {[10, 25, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="cds--select__arrow" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AssetsTable);
