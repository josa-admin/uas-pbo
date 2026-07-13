import api from "./api";
import endpoint from "./endpoint";

export const getBins = () =>
  api.get(endpoint.BIN);

export const getBinById = (id) =>
  api.get(endpoint.BIN_BY_ID(id));

export const createBin = (data) =>
  api.post(endpoint.BIN, data);

export const updateBin = (id, data) =>
  api.put(endpoint.BIN_BY_ID(id), data);

export const deleteBin = (id) =>
  api.delete(endpoint.BIN_BY_ID(id));