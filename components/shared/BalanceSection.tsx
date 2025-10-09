"use client"

import { Button } from "@/components/ui/button"
import { Plus, Send } from "lucide-react"

interface BalanceSectionProps {
  balance: number
  formatPrice: (price: number) => string
}

export const BalanceSection = ({ balance, formatPrice }: BalanceSectionProps) => (
  <div className="bg-zinc-900 mx-4 mt-4 rounded-2xl p-6 relative overflow-hidden">
    <div className="absolute top-4 right-4">
      <span className="text-white font-bold text-lg italic">Payper.</span>
    </div>
    <div className="space-y-4">
      <p className="text-zinc-400 text-sm">Tu saldo disponible</p>
      <p className="text-white text-4xl font-bold">{formatPrice(balance)}</p>
      <div className="flex gap-3">
        <Button className="bg-lime-400 hover:bg-lime-500 text-black rounded-full px-6 py-2 font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
        <Button variant="ghost" className="text-white hover:bg-zinc-800 rounded-full px-6 py-2">
          <Send className="w-4 h-4 mr-2" />
          Enviar
        </Button>
      </div>
    </div>
  </div>
)
