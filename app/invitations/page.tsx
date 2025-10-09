"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Send, Copy, History, CheckCircle, XCircle, DollarSign } from "lucide-react"
import { Header } from "@/components/shared/Header"
import { BottomNav } from "@/components/shared/BottomNav"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useCart } from "@/contexts/CartContext"
import { events, invitations, invitationHistory } from "@/lib/data/mockData"
import { calculateCommission, generatePaymentLink } from "@/lib/utils/formatters"

export default function InvitationsPage() {
  const { cart, setCartModalOpen } = useCart()
  const [selectedEvent, setSelectedEvent] = useState("all")
  const [showHistory, setShowHistory] = useState(false)
  const [historyFilter, setHistoryFilter] = useState("all")
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [invitationModalOpen, setInvitationModalOpen] = useState(false)
  const [invitationType, setInvitationType] = useState("free")
  const [invitationPrice, setInvitationPrice] = useState("")
  const [guestName, setGuestName] = useState("")
  const [guestPhone, setGuestPhone] = useState("")

  const filteredInvitations = selectedEvent === "all" ? invitations : invitations.filter((inv) => inv.event === selectedEvent)

  const filterHistoryByDate = (items: any[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthStart = new Date(selectedYear, selectedMonth, 1)
    const monthEnd = new Date(selectedYear, selectedMonth + 1, 0)

    return items.filter((item) => {
      const itemDate = new Date(item.date)
      switch (historyFilter) {
        case "today":
          return itemDate >= today
        case "week":
          return itemDate >= weekAgo
        case "month":
          return itemDate >= monthStart && itemDate <= monthEnd
        default:
          return true
      }
    })
  }

  const getEventStats = () => {
    const eventInvitations = selectedEvent === "all" ? invitations : invitations.filter((inv) => inv.event === selectedEvent)
    const totalInvitations = eventInvitations.length
    const confirmedInvitations = eventInvitations.filter((inv) => inv.status === "confirmed" || inv.status === "paid").length
    const totalGuests = eventInvitations.reduce((sum, inv) => sum + inv.guests, 0)
    return { totalInvitations, confirmedInvitations, totalGuests }
  }

  const stats = getEventStats()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black pb-20">
        <Header cart={cart} onCartClick={() => setCartModalOpen(true)} />
        <div className="px-4 pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">Invitaciones</h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full px-3 py-1 text-xs ${showHistory ? "bg-lime-400 text-black" : "text-zinc-400 hover:text-white"
                }`}
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="w-4 h-4 mr-1" />
              Historial
            </Button>
            <Dialog open={invitationModalOpen} onOpenChange={setInvitationModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-lime-400 hover:bg-lime-500 text-black rounded-full px-4 py-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm mx-4">
                <DialogHeader>
                  <DialogTitle className="text-lime-400">Nueva Invitación</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Evento</Label>
                    <Select defaultValue="friday-night">
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        {events
                          .filter((event) => event.id !== "all")
                          .map((event) => (
                            <SelectItem key={event.id} value={event.id} className="text-white">
                              {event.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Nombre</Label>
                    <Input
                      placeholder="Nombre completo"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Teléfono</Label>
                    <Input
                      placeholder="+54 9 11..."
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Tipo</Label>
                    <Select value={invitationType} onValueChange={setInvitationType}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="free" className="text-white">Free</SelectItem>
                        <SelectItem value="vip" className="text-white">VIP</SelectItem>
                        <SelectItem value="paid" className="text-white">Paga</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {invitationType === "paid" && (
                    <div className="space-y-2">
                      <Label className="text-zinc-300">Precio</Label>
                      <Input
                        type="number"
                        placeholder="5000"
                        value={invitationPrice}
                        onChange={(e) => setInvitationPrice(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                      {invitationPrice && (
                        <p className="text-lime-400 text-sm">
                          Tu comisión: ${calculateCommission(invitationPrice, "invitation")}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    {invitationType === "paid" ? (
                      <>
                        <Button
                          className="bg-lime-400 hover:bg-lime-500 text-black rounded-full"
                          onClick={() => {
                            const link = generatePaymentLink(invitationPrice, `Invitación ${guestName}`)
                            navigator.clipboard.writeText(link)
                            alert("Link copiado!")
                          }}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar Link
                        </Button>
                        <Button
                          variant="outline"
                          className="border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-black rounded-full bg-transparent"
                          onClick={() => {
                            const link = generatePaymentLink(invitationPrice, `Invitación ${guestName}`)
                            const whatsappUrl = `https://wa.me/${guestPhone}?text=${encodeURIComponent(`¡Hola ${guestName}! Invitación: $${invitationPrice}. Paga: ${link}`)}`
                            window.open(whatsappUrl, "_blank")
                            setInvitationModalOpen(false)
                          }}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Enviar WhatsApp
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="bg-lime-400 hover:bg-lime-500 text-black rounded-full"
                        onClick={() => {
                          const message = invitationType === "vip"
                            ? `¡Hola ${guestName}! Invitación VIP confirmada. ¡Te esperamos!`
                            : `¡Hola ${guestName}! Estás invitado/a. ¡Te esperamos!`
                          const whatsappUrl = `https://wa.me/${guestPhone}?text=${encodeURIComponent(message)}`
                          window.open(whatsappUrl, "_blank")
                          setInvitationModalOpen(false)
                        }}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Enviar {invitationType.toUpperCase()}
                      </Button>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {showHistory && (
          <div className="space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { id: "all", name: "Todo" },
                { id: "today", name: "Hoy" },
                { id: "week", name: "Semana" },
                { id: "month", name: "Mes" },
              ].map((filter) => (
                <Button
                  key={filter.id}
                  variant={historyFilter === filter.id ? "default" : "ghost"}
                  className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${historyFilter === filter.id
                      ? "bg-lime-400 text-black"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                    }`}
                  onClick={() => setHistoryFilter(filter.id)}
                >
                  {filter.name}
                </Button>
              ))}
            </div>

            {historyFilter === "month" && (
              <div className="flex gap-2">
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()} className="text-white">
                        {new Date(2024, i).toLocaleDateString("es", { month: "long" })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {[2024, 2023, 2022].map((year) => (
                      <SelectItem key={year} value={year.toString()} className="text-white">
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {!showHistory && (
          <>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {events.map((event) => (
                <Button
                  key={event.id}
                  variant={selectedEvent === event.id ? "default" : "ghost"}
                  className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${selectedEvent === event.id
                      ? "bg-lime-400 text-black"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                    }`}
                  onClick={() => setSelectedEvent(event.id)}
                >
                  {event.name}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-zinc-900 rounded-xl p-3 text-center">
                <div className="text-lime-400 text-lg font-bold">{stats.totalInvitations}</div>
                <div className="text-zinc-400 text-xs">Invitaciones</div>
              </div>
              <div className="bg-zinc-900 rounded-xl p-3 text-center">
                <div className="text-lime-400 text-lg font-bold">{stats.confirmedInvitations}</div>
                <div className="text-zinc-400 text-xs">Confirmadas</div>
              </div>
              <div className="bg-zinc-900 rounded-xl p-3 text-center">
                <div className="text-lime-400 text-lg font-bold">{stats.totalGuests}</div>
                <div className="text-zinc-400 text-xs">Invitados</div>
              </div>
            </div>
          </>
        )}

        <div className="space-y-3">
          {showHistory ? (
            <>
              <div className="text-zinc-400 text-sm mb-2">
                {filterHistoryByDate(invitationHistory).length} invitaciones encontradas
              </div>
              {filterHistoryByDate(invitationHistory).map((invitation) => (
                <div key={invitation.id} className="bg-zinc-900 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">{invitation.name}</h4>
                      <p className="text-zinc-400 text-sm">{invitation.phone}</p>
                      <p className="text-zinc-500 text-xs">
                        {events.find((e) => e.id === invitation.event)?.name} •{" "}
                        {new Date(invitation.date).toLocaleDateString("es")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        {invitation.price > 0 && (
                          <div className="text-lime-400 text-sm font-bold">${invitation.price.toLocaleString()}</div>
                        )}
                        <Badge
                          className={invitation.type === "VIP" ? "bg-lime-400 text-black" : "bg-zinc-700 text-white"}
                        >
                          {invitation.type}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <div className="text-lime-400 font-bold">{invitation.guests}</div>
                        <div className="text-zinc-500 text-xs">invitados</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            filteredInvitations.map((invitation, index) => (
              <div key={index} className="bg-zinc-900 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{invitation.name}</h4>
                    <p className="text-zinc-400 text-sm">{invitation.phone}</p>
                    <p className="text-zinc-500 text-xs">{events.find((e) => e.id === invitation.event)?.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={invitation.type === "VIP" ? "bg-lime-400 text-black" : "bg-zinc-700 text-white"}>
                      {invitation.type}
                    </Badge>
                    <div className="text-center">
                      <div className="text-lime-400 font-bold">{invitation.guests}</div>
                      <div className="text-zinc-500 text-xs">invitados</div>
                    </div>
                    {invitation.status === "confirmed" ? (
                      <CheckCircle className="w-5 h-5 text-lime-400" />
                    ) : invitation.status === "paid" ? (
                      <DollarSign className="w-5 h-5 text-lime-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-zinc-500" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </div>
    </ProtectedRoute>
  )
}
