"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  category: string | null
  image: string | null
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: any) => void
  updateQuantity: (productId: string, change: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  cartModalOpen: boolean
  setCartModalOpen: (open: boolean) => void
  orderConfirmModalOpen: boolean
  setOrderConfirmModalOpen: (open: boolean) => void
  generatedQR: string
  setGeneratedQR: (qr: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartModalOpen, setCartModalOpen] = useState(false)
  const [orderConfirmModalOpen, setOrderConfirmModalOpen] = useState(false)
  const [generatedQR, setGeneratedQR] = useState("")

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      // Map database product to cart item
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.sale_price,
        category: product.category,
        image: product.image_url,
        quantity: 1,
      }
      setCart([...cart, cartItem])
    }
  }

  const updateQuantity = (productId: string, change: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + change
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[],
    )
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartModalOpen,
        setCartModalOpen,
        orderConfirmModalOpen,
        setOrderConfirmModalOpen,
        generatedQR,
        setGeneratedQR,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
