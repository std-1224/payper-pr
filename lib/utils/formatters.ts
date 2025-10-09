export const formatPrice = (price: number) => {
  return `$${price.toLocaleString("es-AR")},00`
}

export const calculateCommission = (price: string | number, type = "table") => {
  const numPrice = Number.parseFloat(price.toString()) || 0
  const rate = type === "table" ? 0.08 : 0.15 // 8% for tables, 15% for invitations
  return (numPrice * rate).toFixed(0)
}

export const generatePaymentLink = (amount: string | number, description: string) => {
  return `https://payper.app/pay?amount=${amount}&desc=${encodeURIComponent(description)}&pr=current_pr_id`
}

export const generateQRCode = (cart: any[]) => {
  const orderDetails = cart.map((item) => `${item.name} x${item.quantity}`).join(", ")
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return `QR:ORDER:${Date.now()}:${orderDetails}:${total}`
}
