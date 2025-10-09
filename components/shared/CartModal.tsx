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
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md mx-auto max-h-[85vh] overflow-hidden">
        <DialogHeader className="pb-2 pt-2">
          <DialogTitle className="text-lime-400 flex items-center justify-between text-lg">
            Mi Pedido
            <Badge className="bg-lime-400 text-black text-xs px-2 py-1">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} productos
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {cart.length === 0 ? (
            <p className="text-zinc-400 text-center py-8">Tu carrito está vacío</p>
          ) : (
            <>
              {/* Scrollable items section */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-[50vh]">
                {cart.map((item) => (
                  <div key={item.id} className="bg-zinc-800 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-zinc-700 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm truncate">{item.name}</h4>
                        <p className="text-lime-400 font-bold text-sm">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-7 h-7 p-0 text-white hover:bg-zinc-600 rounded-full"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-white font-bold w-6 text-center text-sm">{item.quantity}</span>
                        <Button
                          size="sm"
                          className="w-7 h-7 p-0 bg-lime-400 hover:bg-lime-500 text-black rounded-full"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-7 h-7 p-0 text-red-400 hover:bg-red-900/20 rounded-full flex-shrink-0"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fixed bottom section */}
              <div className="border-t border-zinc-700 pt-4 mt-4 bg-zinc-900">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-bold text-lg">Total:</span>
                  <span className="text-lime-400 font-bold text-xl">
                    {formatPrice(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                  </span>
                </div>
                <Button
                  className="w-full bg-lime-400 hover:bg-lime-500 text-black rounded-xl py-3 font-bold text-sm"
                  onClick={() => {
                    setCartModalOpen(false)
                    setOrderConfirmModalOpen(true)
                  }}
                >
                  <QrCode className="w-4 h-4 mr-2" />
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
