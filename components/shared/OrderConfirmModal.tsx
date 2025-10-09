"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { QrCode, Copy } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { formatPrice } from "@/lib/utils/formatters"

export const OrderConfirmModal = () => {
  const { 
    cart, 
    orderConfirmModalOpen, 
    setOrderConfirmModalOpen, 
    generatedQR, 
    setGeneratedQR,
    clearCart 
  } = useCart()

  return (
    <Dialog open={orderConfirmModalOpen} onOpenChange={setOrderConfirmModalOpen}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle className="text-lime-400">Confirmar Pedido</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-zinc-800 rounded-xl p-4">
            <h4 className="text-white font-medium mb-3">Resumen del pedido:</h4>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-zinc-300">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="text-white">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-700 mt-3 pt-3">
              <div className="flex justify-between font-bold">
                <span className="text-white">Total:</span>
                <span className="text-lime-400">
                  {formatPrice(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                </span>
              </div>
            </div>
          </div>

          {generatedQR ? (
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-xl mx-auto w-fit">
                <div className="w-32 h-32 bg-black rounded flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-lime-400 font-bold">¡QR Generado!</p>
                <p className="text-zinc-400 text-sm">Presenta este código para retirar tu pedido</p>
                <div className="bg-zinc-800 rounded-lg p-3">
                  <p className="text-white text-xs font-mono break-all">{generatedQR}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-black rounded-full bg-transparent"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedQR)
                    alert("QR copiado al portapapeles!")
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
                <Button
                  className="flex-1 bg-lime-400 hover:bg-lime-500 text-black rounded-full"
                  onClick={() => {
                    setOrderConfirmModalOpen(false)
                    setGeneratedQR("")
                    clearCart()
                    alert("Pedido confirmado! El cliente puede retirar con el QR.")
                  }}
                >
                  Finalizar
                </Button>
              </div>
            </div>
          ) : (
            <Button
              className="w-full bg-lime-400 hover:bg-lime-500 text-black rounded-full py-3 font-bold"
              onClick={() => {
                const orderDetails = cart.map((item) => `${item.name} x${item.quantity}`).join(", ")
                const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
                const qrCode = `PAYPER:ORDER:${Date.now()}:${orderDetails}:TOTAL:${total}`
                setGeneratedQR(qrCode)
              }}
            >
              <QrCode className="w-5 h-5 mr-2" />
              Generar QR
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
