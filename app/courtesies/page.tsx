"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gift, Send } from "lucide-react"
import { Header } from "@/components/shared/Header"
import { BottomNav } from "@/components/shared/BottomNav"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useCart } from "@/contexts/CartContext"
import { courtesies, products } from "@/lib/data/mockData"

export default function CourtesiesPage() {
  const { cart, setCartModalOpen } = useCart()
  const [courtesyModalOpen, setCourtesyModalOpen] = useState(false)
  const [selectedCourtesy, setSelectedCourtesy] = useState("")
  const [courtesyRecipient, setCourtesyRecipient] = useState("")

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black pb-20 pt-16">
        <Header cart={cart} onCartClick={() => setCartModalOpen(true)} />
        <div className="px-4 pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">Cortesías</h2>
          <Dialog open={courtesyModalOpen} onOpenChange={setCourtesyModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lime-400 hover:bg-lime-500 text-black rounded-full px-4 py-2">
                <Gift className="w-4 h-4 mr-2" />
                Enviar
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm mx-4">
              <DialogHeader>
                <DialogTitle className="text-lime-400">Enviar Cortesía</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Cortesía</Label>
                  <Select value={selectedCourtesy} onValueChange={setSelectedCourtesy}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.name} className="text-white">
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Destinatario</Label>
                  <Input
                    placeholder="Mesa 5, VIP Juan, etc."
                    value={courtesyRecipient}
                    onChange={(e) => setCourtesyRecipient(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <Button
                  className="w-full bg-lime-400 hover:bg-lime-500 text-black rounded-full"
                  onClick={() => {
                    alert(`Cortesía enviada: ${selectedCourtesy} para ${courtesyRecipient}`)
                    setCourtesyModalOpen(false)
                    setSelectedCourtesy("")
                    setCourtesyRecipient("")
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Cortesía
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {["Trago Premium", "Shots x2", "Champagne", "Botella Vino"].map((item) => (
            <Button
              key={item}
              variant="outline"
              className="border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-black rounded-xl py-3 bg-transparent"
              onClick={() => {
                setSelectedCourtesy(item.toLowerCase().replace(" ", ""))
                setCourtesyModalOpen(true)
              }}
            >
              {item}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          {courtesies.map((courtesy) => (
            <div key={courtesy.id} className="bg-zinc-900 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">{courtesy.name}</h4>
                  <p className="text-zinc-400 text-sm">{courtesy.recipient}</p>
                  <p className="text-zinc-500 text-xs">{new Date(courtesy.date).toLocaleDateString("es")}</p>
                </div>
                <Badge
                  className={
                    courtesy.status === "delivered"
                      ? "bg-lime-400 text-black"
                      : "bg-zinc-700 text-white"
                  }
                >
                  {courtesy.status === "delivered" ? "Entregado" : "Pendiente"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
    </ProtectedRoute>
  )
}
