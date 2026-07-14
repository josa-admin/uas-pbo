const ENDPOINTS = {
  LOGIN: "/login/",

  PRODUCT: "/products/",
  PRODUCT_DETAIL: (id) => `/products/${id}/`,

  CATEGORY: "/categories/",
  CATEGORY_DETAIL: (id) => `/categories/${id}/`,

  SUPPLIER: "/suppliers/",
  SUPPLIER_DETAIL: (id) => `/suppliers/${id}/`,

  BIN: "/bins/",
  BIN_DETAIL: (id) => `/bins/${id}/`,

  INBOUND: "/inbounds/",
  OUTBOUND: "/outbounds/",

  STOCK_BATCH: "/stock-batches/",
  EXPIRED_ALERT: "/expired-alert/",
};

export default ENDPOINTS;