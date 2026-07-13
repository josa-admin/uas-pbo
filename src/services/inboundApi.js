import api from "./api";
import endpoint from "./endpoint";

export const getInbounds = () =>
  api.get(endpoint.INBOUND);

export const getInboundById = (id) =>
  api.get(endpoint.INBOUND_BY_ID(id));

export const createInbound = (data) =>
  api.post(endpoint.INBOUND, data);

export const updateInbound = (id, data) =>
  api.put(endpoint.INBOUND_BY_ID(id), data);

export const deleteInbound = (id) =>
  api.delete(endpoint.INBOUND_BY_ID(id));