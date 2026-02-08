import { parseFilters } from "../util";
import client from "./api_client";

class AssetsService {
  async fetchAssets(window, aggregate, filters) {
    const params = {
      window,
      aggregate,
      filter: parseFilters(filters ?? []),
    };

    const result = await client.get("/assets", { params });
    return result.data.data;
  }
}

export default new AssetsService();
