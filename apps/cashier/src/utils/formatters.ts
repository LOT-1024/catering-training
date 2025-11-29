export const formatCurrency = (amount: number): string => {
  return `Rp ${amount.toLocaleString("id-ID")}`
}

export const formatDate = (date: Date): string => {
  return date.toLocaleString()
}