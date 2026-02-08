const windowOptions = [
  { name: "Today", value: "today" },
  { name: "Yesterday", value: "yesterday" },
  { name: "Week-to-date", value: "week" },
  { name: "Month-to-date", value: "month" },
  { name: "Last week", value: "lastweek" },
  { name: "Last month", value: "lastmonth" },
  { name: "Last 30m", value: "30m" },
  { name: "Last 12h", value: "12h" },
  { name: "Last 24h", value: "24h" },
  { name: "Last 48h", value: "48h" },
  { name: "Last 7 days", value: "7d" },
  { name: "Last 14 days", value: "14d" },
];

const aggregationOptions = [
  { name: "Cluster", value: "cluster" },
  { name: "Node", value: "node" },
  { name: "Namespace", value: "namespace" },
  { name: "Controller", value: "controller" },
  { name: "Service", value: "service" },
  { name: "Provider", value: "provider" },
  { name: "Category", value: "category" },
  { name: "Type", value: "type" },
];

export { windowOptions, aggregationOptions };
