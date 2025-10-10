"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, ShoppingCart, Loader2 } from "lucide-react"
import { Header } from "@/components/shared/Header"
import { BalanceSection } from "@/components/shared/BalanceSection"
import { BottomNav } from "@/components/shared/BottomNav"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useCart } from "@/contexts/CartContext"
import { formatPrice } from "@/lib/utils/formatters"
import { CartModal } from "@/components/shared/CartModal"
import { OrderConfirmModal } from "@/components/shared/OrderConfirmModal"
import { useProducts } from "@/hooks/use-products"
import { useMenuStore } from "@/stores/menu-store"

export default function MenuPage() {
  const [balance] = useState(27000)
  const { cart, addToCart, updateQuantity, setCartModalOpen } = useCart()

  // Use Zustand store for UI state
  const { selectedCategory, setSelectedCategory } = useMenuStore()

  // Use React Query for server data
  const { data: products, isLoading, error } = useProducts()

  const filteredProducts = products?.filter(
    (product) => selectedCategory === "all" || product.category === selectedCategory,
  ) || []

  const CategoryTabs = () => (
    <div className="px-4 mt-6">
      <h2 className="text-white text-xl font-bold mb-4">Descubrí más</h2>
      <div className="flex gap-2">
        {[
          { id: "all", label: "all" },
          { id: "bebida", label: "bebida" },
          { id: "recipe", label: "recipe" },
        ].map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "ghost"}
            className={`rounded-full px-4 py-2 text-sm ${selectedCategory === category.id
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  )

  const ProductGrid = () => {
    if (isLoading) {
      return (
        <div className="px-4 mt-6 flex justify-center items-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-lime-400" />
          <span className="ml-2 text-white">Cargando productos...</span>
        </div>
      )
    }

    if (error) {
      return (
        <div className="px-4 mt-6 text-center py-8">
          <p className="text-red-400">Error al cargar productos</p>
          <p className="text-zinc-400 text-sm mt-1">Por favor, intenta nuevamente</p>
        </div>
      )
    }

    if (!filteredProducts.length) {
      return (
        <div className="px-4 mt-6 text-center py-8">
          <p className="text-zinc-400">No hay productos disponibles</p>
        </div>
      )
    }

    return (
      <div className="px-4 mt-6 grid grid-cols-2 gap-4">
        {filteredProducts.map((product) => {
        const cartItem = cart.find((item) => item.id === product.id)
        const quantity = cartItem?.quantity || 0

        return (
          <div key={product.id} className="bg-zinc-900 rounded-2xl p-4 space-y-3">
            <div className="aspect-square bg-zinc-800 rounded-xl overflow-hidden">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-medium">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">{formatPrice(product.sale_price)}</span>
                {quantity > 0 ? (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-8 h-8 p-0 text-white hover:bg-zinc-700"
                      onClick={() => updateQuantity(product.id, -1)}
                    >
                      -
                    </Button>
                    <span className="text-white font-bold w-6 text-center">{quantity}</span>
                    <Button
                      size="sm"
                      className="w-8 h-8 p-0 bg-lime-400 hover:bg-lime-500 text-black rounded-full"
                      onClick={() => updateQuantity(product.id, 1)}
                    >
                      +
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    className="w-8 h-8 p-0 bg-lime-400 hover:bg-lime-500 text-black rounded-full"
                    onClick={() => addToCart(product)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      })}
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black pb-20 pt-16">
        <Header cart={cart} onCartClick={() => setCartModalOpen(true)} />
        <BalanceSection balance={balance} formatPrice={formatPrice} />
        <CategoryTabs />
        <ProductGrid />
        {cart.length > 0 && (
          <div className="fixed bottom-20 max-w-md mx-auto">
            <Button
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl p-4 border border-lime-400 leading-7 tracking-normal my-2.5 mx-0 h-auto"
              onClick={() => setCartModalOpen(true)}
            >
              <div className="flex items-center justify-between w-full gap-8">
                <div className="text-left">
                  <p className="font-medium">{cart.reduce((sum, item) => sum + item.quantity, 0)} productos</p>
                  <p className="text-lime-400 font-bold">
                    {formatPrice(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Ver carrito</span>
                  <ShoppingCart className="w-5 h-5" />
                </div>
              </div>
            </Button>
          </div>
        )}
        <CartModal />
        <OrderConfirmModal />
        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}
