import api from "./api";
import endpoint from "./endpoint";

export const getSuppliers = () =>
  api.get(endpoint.SUPPLIER);

export const getSupplierById = (id) =>
  api.get(endpoint.SUPPLIER_BY_ID(id));

export const createSupplier = (data) =>
  api.post(endpoint.SUPPLIER, data);

export const updateSupplier = (id, data) =>
  api.put(endpoint.SUPPLIER_BY_ID(id), data);

export const deleteSupplier = (id) =>
  api.delete(endpoint.SUPPLIER_BY_ID(id));