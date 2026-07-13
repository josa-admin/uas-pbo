import api from "./api";
import endpoint from "./endpoint";

export const getExpiredAlert = () =>
  api.get(endpoint.EXPIRED_ALERT);