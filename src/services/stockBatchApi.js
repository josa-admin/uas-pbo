import api from "./api";
import endpoint from "./endpoint";

export const getStockBatches = () =>
  api.get(endpoint.STOCK_BATCH);