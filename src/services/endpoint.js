const BASE_URL = "http://localhost:8000/api";

const endpoint = {
  // ===========================
  // AUTH
  // ===========================
  LOGIN: `${BASE_URL}/login/`,

  // ===========================
  // CATEGORY
  // ===========================
  CATEGORY: `${BASE_URL}/categories/`,
  CATEGORY_BY_ID: (id) => `${BASE_URL}/categories/${id}/`,

  // ===========================
  // SUPPLIER
  // ===========================
  SUPPLIER: `${BASE_URL}/suppliers/`,
  SUPPLIER_BY_ID: (id) => `${BASE_URL}/suppliers/${id}/`,

  // ===========================
  // PRODUCT
  // ===========================
  PRODUCT: `${BASE_URL}/products/`,
  PRODUCT_BY_ID: (id) => `${BASE_URL}/products/${id}/`,

  // ===========================
  // BIN
  // ===========================
  BIN: `${BASE_URL}/bins/`,
  BIN_BY_ID: (id) => `${BASE_URL}/bins/${id}/`,

  // ===========================
  // STOCK BATCH
  // ===========================
  STOCK_BATCH: `${BASE_URL}/stock-batches/`,

  // ===========================
  // INBOUND
  // ===========================
  INBOUND: `${BASE_URL}/inbounds/`,
  INBOUND_BY_ID: (id) => `${BASE_URL}/inbounds/${id}/`,

  // ===========================
  // EXPIRED ALERT
  // ===========================
  EXPIRED_ALERT: `${BASE_URL}/expired-alert/`,
};

export default endpoint;