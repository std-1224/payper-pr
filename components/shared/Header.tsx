"use client"

import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  cart: any[]
  onCartClick: () => void
}

export const Header = ({ cart, onCartClick }: HeaderProps) => (
  <div className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md flex items-center justify-between border-b border-zinc-800 px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-white rounded grid grid-cols-2 gap-0.5 p-1">
          <div className="bg-black rounded-sm"></div>
          <div className="bg-black rounded-sm"></div>
          <div className="bg-black rounded-sm"></div>
          <div className="bg-black rounded-sm"></div>
        </div>
        <span className="text-white font-medium">Payper app</span>
      </div>
      <button className="relative" onClick={onCartClick}>
        <ShoppingCart className="w-6 h-6 text-white" />
        {cart.length > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </Badge>
        )}
      </button>
  </div>
)
