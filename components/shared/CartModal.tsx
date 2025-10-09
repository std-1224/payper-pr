"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Minus, X, QrCode } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { formatPrice } from "@/lib/utils/formatters"

export const CartModal = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    cartModalOpen, 
    setCartModalOpen, 
    setOrderConfirmModalOpen 
  } = useCart()

  return (
    <Dialog open={cartModalOpen} onOpenChange={setCartModalOpen}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm mx-4 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lime-400 flex items-center justify-between">
            Mi Pedido
            <Badge className="bg-lime-400 text-black">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} productos
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {cart.length === 0 ? (
            <p className="text-zinc-400 text-center py-8">Tu carrito está vacío</p>
          ) : (
            <>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="bg-zinc-800 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-zinc-700 rounded-lg overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{item.name}</h4>
                        <p className="text-lime-400 font-bold">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-8 h-8 p-0 text-white hover:bg-zinc-600"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          className="w-8 h-8 p-0 bg-lime-400 hover:bg-lime-500 text-black rounded-full"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0 text-red-400 hover:bg-red-900/20"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-700 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-bold text-lg">Total:</span>
                  <span className="text-lime-400 font-bold text-xl">
                    {formatPrice(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                  </span>
                </div>
                <Button
                  className="w-full bg-lime-400 hover:bg-lime-500 text-black rounded-full py-3 font-bold"
                  onClick={() => {
                    setCartModalOpen(false)
                    setOrderConfirmModalOpen(true)
                  }}
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Confirmar Pedido
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
