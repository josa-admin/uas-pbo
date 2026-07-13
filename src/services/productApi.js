import api from "./api";
import endpoint from "./endpoint";

export const getProducts = () =>
  api.get(endpoint.PRODUCT);

export const getProductById = (id) =>
  api.get(endpoint.PRODUCT_BY_ID(id));

export const createProduct = (data) =>
  api.post(endpoint.PRODUCT, data);

export const updateProduct = (id, data) =>
  api.put(endpoint.PRODUCT_BY_ID(id), data);

export const deleteProduct = (id) =>
  api.delete(endpoint.PRODUCT_BY_ID(id));