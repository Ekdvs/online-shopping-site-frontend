// src/utils.js
export const currency = (n) =>
  typeof n === "number" ? n.toLocaleString(undefined, { minimumFractionDigits: 0 }) : n;
