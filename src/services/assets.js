import client from "./api_client";

const AssetsService = {
  /**
   * Fetch asset data from the OpenCost Assets API
   * @param {string} window - Time window (e.g., '7d', 'today', 'lastweek', '30m', or custom range)
   * @returns {Promise<Object>} Asset data
   */
  async fetchAssetsData(window = "7d") {
    try {
      const response = await client.get(`/assets`, {
        params: {
          window: window,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching assets data:", error);
      throw new Error(
        error.response?.status === 404
          ? "404"
          : error.message || "Failed to fetch assets data"
      );
    }
  },

  /**
   * Fetch carbon cost data from the OpenCost Assets API
   * @param {string} window - Time window
   * @returns {Promise<Object>} Carbon asset data
   */
  async fetchCarbonAssetsData(window = "7d") {
    try {
      const response = await client.get(`/assets/carbon`, {
        params: {
          window: window,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching carbon assets data:", error);
      throw new Error(
        error.response?.status === 404
          ? "404"
          : error.message || "Failed to fetch carbon assets data"
      );
    }
  },
};

export default AssetsService;
