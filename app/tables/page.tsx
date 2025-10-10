"use client"


import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { History, Copy, Send } from "lucide-react"
import { Header } from "@/components/shared/Header"
import { BottomNav } from "@/components/shared/BottomNav"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useCart } from "@/contexts/CartContext"
import { useTables, useUpdateTableStatus } from "@/hooks/use-tables"
import { useUIStore } from "@/stores/ui-store"
import { calculateCommission, generatePaymentLink } from "@/lib/utils/formatters"

export default function TablesPage() {
  const { cart, setCartModalOpen } = useCart()

  // Use Zustand store for UI state
  const {
    showHistory,
    historyFilter,
    selectedMonth,
    selectedYear,
    tableModalOpen,
    selectedTable,
    tablePrice,
    clientName,
    customMessage,
    setShowHistory,
    setHistoryFilter,
    setSelectedMonth,
    setSelectedYear,
    setTableModalOpen,
    setSelectedTable,
    setTablePrice,
    setClientName,
    setCustomMessage,
    resetTableForm,
  } = useUIStore()

  // Fetch tables data
  const { data: tables = [], isLoading, error } = useTables()
  const updateTableStatus = useUpdateTableStatus()

  // Show loading state
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black pb-20 pt-16 flex items-center justify-center">
          <div className="text-white">Cargando mesas...</div>
        </div>
      </ProtectedRoute>
    )
  }

  // Show error state
  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black pb-20 pt-16 flex items-center justify-center">
          <div className="text-red-400">Error al cargar mesas: {error.message}</div>
        </div>
      </ProtectedRoute>
    )
  }

  // Calculate table statistics
  const availableTables = tables.filter(table => table.status === 'free')
  const occupiedTables = tables.filter(table => table.status !== 'free')
  const myTables = tables.filter(table => table.status === 'occupied') // Placeholder for user's tables

  // For now, use empty array for history until we implement table history tracking
  const tableHistory: any[] = []

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black pb-20 pt-16">
        <Header cart={cart} onCartClick={() => setCartModalOpen(true)} />
        <div className="px-4 pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">Mesas</h2>
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
          </div>
        </div>

        {!showHistory && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-zinc-900 rounded-xl p-3 text-center">
              <div className="text-lime-400 text-lg font-bold">{occupiedTables.length}</div>
              <div className="text-zinc-400 text-xs">Ocupadas</div>
            </div>
            <div className="bg-zinc-900 rounded-xl p-3 text-center">
              <div className="text-white text-lg font-bold">{availableTables.length}</div>
              <div className="text-zinc-400 text-xs">Disponibles</div>
            </div>
            <div className="bg-zinc-900 rounded-xl p-3 text-center">
              <div className="text-lime-400 text-lg font-bold">{myTables.length}</div>
              <div className="text-zinc-400 text-xs">Mis Ventas</div>
            </div>
          </div>
        )}

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

            <div className="text-zinc-400 text-sm mb-2">
              {filterHistoryByDate(tableHistory).length} mesas vendidas encontradas
            </div>

            <div className="space-y-3">
              {filterHistoryByDate(tableHistory).map((table) => (
                <div key={table.id} className="bg-zinc-900 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Mesa {table.tableNumber}</h4>
                      <p className="text-zinc-400 text-sm">{table.client}</p>
                      <p className="text-zinc-500 text-xs">{new Date(table.date).toLocaleDateString("es")}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lime-400 text-lg font-bold">${table.price.toLocaleString()}</div>
                      <div className="text-zinc-400 text-sm">Comisión: ${table.commission.toLocaleString()}</div>
                      <Badge className="bg-lime-400 text-black mt-1">Confirmada</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!showHistory && (
          <div className="grid grid-cols-3 gap-3">
            {tables.map((table) => {
              const isAvailable = table.status === 'free'
              const statusLabels = {
                'free': 'Libre',
                'occupied': 'Ocupada',
                'waiting_order': 'Esperando',
                'producing': 'Preparando',
                'delivered': 'Entregado',
                'bill_requested': 'Cuenta',
                'paid': 'Pagado'
              }

              return (
                <div
                  key={table.id}
                  className={`bg-zinc-900 rounded-xl p-3 text-center border ${isAvailable ? "border-lime-400" : "border-zinc-700"
                    }`}
                >
                  <div className="text-white font-bold mb-2">Mesa {table.table_number}</div>
                  {isAvailable ? (
                    <div className="space-y-2">
                      <Badge className="bg-lime-400 text-black text-xs">Libre</Badge>
                      <Dialog open={tableModalOpen && selectedTable === table.table_number} onOpenChange={setTableModalOpen}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="w-full bg-lime-400 hover:bg-lime-500 text-black text-xs py-1 rounded-full"
                            onClick={() => setSelectedTable(table.table_number)}
                          >
                            Vender
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm mx-4">
                          <DialogHeader>
                            <DialogTitle className="text-lime-400">Vender Mesa {table.table_number}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-zinc-300">Precio</Label>
                              <Input
                                type="number"
                                placeholder="25000"
                                value={tablePrice}
                                onChange={(e) => setTablePrice(e.target.value)}
                                className="bg-zinc-800 border-zinc-700 text-white"
                              />
                              {tablePrice && (
                                <p className="text-lime-400 text-sm">
                                  Tu comisión: ${calculateCommission(tablePrice, "table")}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label className="text-zinc-300">Cliente</Label>
                              <Input
                                placeholder="Nombre del cliente"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                className="bg-zinc-800 border-zinc-700 text-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-zinc-300">Mensaje</Label>
                              <Textarea
                                placeholder="Mensaje personalizado..."
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                className="bg-zinc-800 border-zinc-700 text-white resize-none"
                                rows={2}
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button
                                className="bg-lime-400 hover:bg-lime-500 text-black rounded-full"
                                onClick={() => {
                                  const link = generatePaymentLink(tablePrice, `Mesa ${selectedTable}`)
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
                                  const link = generatePaymentLink(tablePrice, `Mesa ${selectedTable}`)
                                  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Mesa ${selectedTable} - $${tablePrice}. ${customMessage} Paga: ${link}`)}`
                                  window.open(whatsappUrl, "_blank")
                                  setTableModalOpen(false)
                                }}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Enviar WhatsApp
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Badge className="bg-zinc-700 text-white text-xs">{statusLabels[table.status]}</Badge>
                      {table.description && (
                        <p className="text-zinc-500 text-xs">{table.description}</p>
                      )}
                      {table.current_guest > 0 && (
                        <p className="text-zinc-400 text-xs">{table.current_guest} huéspedes</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
    </ProtectedRoute>
  )
}
