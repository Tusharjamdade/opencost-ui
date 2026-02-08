import * as React from "react";
import { aggregationOptions, windowOptions } from "./tokens";

function AssetsControls({ window, setWindow, aggregateBy, setAggregateBy }) {
  const [customWindow, setCustomWindow] = React.useState(window);

  React.useEffect(() => {
    setCustomWindow(window);
  }, [window]);

  return (
    <div className="cds--form" style={{ display: "flex", gap: "1rem" }}>
      <div className="cds--select">
        <label className="cds--label" htmlFor="assets-window-select">
          Window
        </label>
        <div className="cds--select-input__wrapper">
          <select
            id="assets-window-select"
            className="cds--select-input"
            value={window}
            onChange={(event) => setWindow(event.target.value)}
          >
            {windowOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.name}
              </option>
            ))}
          </select>
          <span className="cds--select__arrow" />
        </div>
      </div>
      <div className="cds--form-item" style={{ minWidth: "320px" }}>
        <label className="cds--label" htmlFor="assets-window-custom">
          Custom window
        </label>
        <input
          id="assets-window-custom"
          className="cds--text-input"
          type="text"
          placeholder="e.g. 2023-01-18T10:30:00Z,2023-01-19T10:30:00Z"
          value={customWindow}
          onChange={(event) => setCustomWindow(event.target.value)}
        />
      </div>
      <button
        type="button"
        className="cds--btn cds--btn--secondary"
        onClick={() => setWindow(customWindow)}
        style={{ alignSelf: "flex-end" }}
      >
        Apply
      </button>
      <div className="cds--select">
        <label className="cds--label" htmlFor="assets-aggregation-select">
          Breakdown
        </label>
        <div className="cds--select-input__wrapper">
          <select
            id="assets-aggregation-select"
            className="cds--select-input"
            value={aggregateBy}
            onChange={(event) => setAggregateBy(event.target.value)}
          >
            {aggregationOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.name}
              </option>
            ))}
          </select>
          <span className="cds--select__arrow" />
        </div>
      </div>
    </div>
  );
}

export default React.memo(AssetsControls);
