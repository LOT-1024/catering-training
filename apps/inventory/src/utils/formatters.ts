export const formatCurrency = (amount: number): string => {
  return `Rp ${amount.toLocaleString('id-ID')}`;
};

export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000) {
    return `Rp ${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `Rp ${(num / 1000).toFixed(1)}K`;
  }
  return `Rp ${num}`;
};

export const getStockStatus = (stock: number, minStock: number): "normal" | "low" | "critical" => {
  if (stock <= minStock * 0.3) return "critical";
  if (stock <= minStock * 0.7) return "low";
  return "normal";
};