import api from "./api";
import endpoint from "./endpoint";

export const getCategories = () => api.get(endpoint.CATEGORY);

export const getCategoryById = (id) =>
  api.get(endpoint.CATEGORY_BY_ID(id));

export const createCategory = (data) =>
  api.post(endpoint.CATEGORY, data);

export const updateCategory = (id, data) =>
  api.put(endpoint.CATEGORY_BY_ID(id), data);

export const deleteCategory = (id) =>
  api.delete(endpoint.CATEGORY_BY_ID(id));