import api from "./api";
import endpoint from "./endpoint";

export const login = (data) => {
  return api.post(endpoint.LOGIN, data);
};