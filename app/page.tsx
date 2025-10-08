"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  ShoppingCart,
  Plus,
  Send,
  Menu,
  User,
  Gift,
  QrCode,
  Users,
  Calendar,
  Copy,
  DollarSign,
  CheckCircle,
  XCircle,
  Minus,
  X,
  History,
} from "lucide-react"

export default function PayperApp() {
  const [currentView, setCurrentView] = useState("home")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState([])
  const [balance] = useState(27000)
  const [cartModalOpen, setCartModalOpen] = useState(false)
  const [orderConfirmModalOpen, setOrderConfirmModalOpen] = useState(false)
  const [generatedQR, setGeneratedQR] = useState("")

  const [tableModalOpen, setTableModalOpen] = useState(false)
  const [invitationModalOpen, setInvitationModalOpen] = useState(false)
  const [courtesyModalOpen, setCourtesyModalOpen] = useState(false)
  const [selectedTable, setSelectedTable] = useState(null)
  const [tablePrice, setTablePrice] = useState("")
  const [clientName, setClientName] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [invitationType, setInvitationType] = useState("free")
  const [invitationPrice, setInvitationPrice] = useState("")
  const [guestName, setGuestName] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [selectedCourtesy, setSelectedCourtesy] = useState("")
  const [courtesyRecipient, setCourtesyRecipient] = useState("")

  const [selectedEvent, setSelectedEvent] = useState("all")

  const [showHistory, setShowHistory] = useState(false)
  const [historyFilter, setHistoryFilter] = useState("all") // all, today, week, month
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const [showTransactionHistory, setShowTransactionHistory] = useState(false)

  const events = [
    { id: "all", name: "Todos los eventos" },
    { id: "friday-night", name: "Friday Night" },
    { id: "saturday-party", name: "Saturday Party" },
    { id: "sunday-brunch", name: "Sunday Brunch" },
  ]

  const invitations = [
    {
      name: "María González",
      phone: "+54 9 11 1234-5678",
      type: "VIP",
      status: "confirmed",
      guests: 2,
      event: "friday-night",
    },
    {
      name: "Carlos Ruiz",
      phone: "+54 9 11 8765-4321",
      type: "Free",
      status: "pending",
      guests: 1,
      event: "saturday-party",
    },
    { name: "Ana López", phone: "+54 9 11 5555-5555", type: "Paga", status: "paid", guests: 3, event: "friday-night" },
    {
      name: "Pedro Martín",
      phone: "+54 9 11 9999-9999",
      type: "VIP",
      status: "confirmed",
      guests: 1,
      event: "sunday-brunch",
    },
    {
      name: "Laura Silva",
      phone: "+54 9 11 7777-7777",
      type: "Free",
      status: "confirmed",
      guests: 2,
      event: "saturday-party",
    },
  ]

  const invitationHistory = [
    {
      id: 1,
      name: "María González",
      phone: "+54 9 11 1234-5678",
      type: "VIP",
      event: "friday-night",
      date: "2024-01-15",
      status: "confirmed",
      guests: 2,
      price: 8000,
    },
    {
      id: 2,
      name: "Carlos Ruiz",
      phone: "+54 9 11 2345-6789",
      type: "Paga",
      event: "saturday-party",
      date: "2024-01-14",
      status: "paid",
      guests: 4,
      price: 12000,
    },
    {
      id: 3,
      name: "Ana López",
      phone: "+54 9 11 3456-7890",
      type: "Free",
      event: "sunday-brunch",
      date: "2024-01-13",
      status: "confirmed",
      guests: 1,
      price: 0,
    },
    {
      id: 4,
      name: "Pedro Martín",
      phone: "+54 9 11 4567-8901",
      type: "VIP",
      event: "friday-night",
      date: "2024-01-12",
      status: "confirmed",
      guests: 3,
      price: 15000,
    },
    {
      id: 5,
      name: "Laura Silva",
      phone: "+54 9 11 5678-9012",
      type: "Paga",
      event: "saturday-party",
      date: "2024-01-11",
      status: "paid",
      guests: 2,
      price: 10000,
    },
  ]

  const tableHistory = [
    {
      id: 1,
      tableNumber: 5,
      client: "Roberto García",
      price: 25000,
      date: "2024-01-15",
      status: "confirmed",
      commission: 2500,
    },
    {
      id: 2,
      tableNumber: 12,
      client: "Sofía Mendez",
      price: 30000,
      date: "2024-01-14",
      status: "confirmed",
      commission: 3000,
    },
    {
      id: 3,
      tableNumber: 8,
      client: "Diego Torres",
      price: 20000,
      date: "2024-01-13",
      status: "confirmed",
      commission: 2000,
    },
    {
      id: 4,
      tableNumber: 15,
      client: "Carmen Vega",
      price: 35000,
      date: "2024-01-12",
      status: "confirmed",
      commission: 3500,
    },
    {
      id: 5,
      tableNumber: 3,
      client: "Andrés Morales",
      price: 28000,
      date: "2024-01-11",
      status: "confirmed",
      commission: 2800,
    },
  ]

  const transactionHistory = [
    {
      id: 1,
      type: "purchase",
      description: "Gin Tonic x2, Sprite x1",
      amount: -40000,
      date: "2024-01-15",
      status: "completed",
      qrCode: "QR-001-2024",
    },
    {
      id: 2,
      type: "balance_load",
      description: "Carga de saldo",
      amount: 50000,
      date: "2024-01-14",
      status: "completed",
      method: "Transferencia",
    },
    {
      id: 3,
      type: "purchase",
      description: "Pepsi x3, Cuba Libre x1",
      amount: -63000,
      date: "2024-01-13",
      status: "completed",
      qrCode: "QR-002-2024",
    },
    {
      id: 4,
      type: "balance_load",
      description: "Carga de saldo",
      amount: 100000,
      date: "2024-01-12",
      status: "completed",
      method: "Efectivo",
    },
    {
      id: 5,
      type: "purchase",
      description: "Gin Tonic x1",
      amount: -20000,
      date: "2024-01-11",
      status: "completed",
      qrCode: "QR-003-2024",
    },
  ]

  const filteredInvitations =
    selectedEvent === "all" ? invitations : invitations.filter((inv) => inv.event === selectedEvent)

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
    const eventInvitations =
      selectedEvent === "all" ? invitations : invitations.filter((inv) => inv.event === selectedEvent)
    const totalInvitations = eventInvitations.length
    const confirmedInvitations = eventInvitations.filter(
      (inv) => inv.status === "confirmed" || inv.status === "paid",
    ).length
    const totalGuests = eventInvitations.reduce((sum, inv) => sum + inv.guests, 0)

    return { totalInvitations, confirmedInvitations, totalGuests }
  }

  const products = [
    {
      id: 1,
      name: "Gin Tonic",
      price: 20000,
      category: "bebida",
      image: "/gin-tonic-cocktail-glass.png",
    },
    {
      id: 2,
      name: "Sprite",
      price: 20000,
      category: "bebida",
      image: "/sprite-soda-can-green.png",
    },
    {
      id: 3,
      name: "Cub Libre",
      price: 3000,
      category: "bebida",
      image: "/cuba-libre-cocktail-dark-rum.png",
    },
    {
      id: 4,
      name: "Pepsi",
      price: 20000,
      category: "bebida",
      image: "/pepsi-cola-can-blue.png",
    },
  ]

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (productId, change) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + change
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
          }
          return item
        })
        .filter(Boolean),
    )
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId))
  }

  const filteredProducts = products.filter(
    (product) => selectedCategory === "all" || product.category === selectedCategory,
  )

  const formatPrice = (price) => {
    return `$${price.toLocaleString("es-AR")},00`
  }

  const calculateCommission = (price, type = "table") => {
    const numPrice = Number.parseFloat(price) || 0
    const rate = type === "table" ? 0.08 : 0.15 // 8% for tables, 15% for invitations
    return (numPrice * rate).toFixed(0)
  }

  const generatePaymentLink = (amount, description) => {
    return `https://payper.app/pay?amount=${amount}&desc=${encodeURIComponent(description)}&pr=current_pr_id`
  }

  const generateQRCode = () => {
    const orderDetails = cart.map((item) => `${item.name} x${item.quantity}`).join(", ")
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return `QR:ORDER:${Date.now()}:${orderDetails}:${total}`
  }

  const Header = () => (
    <div className="bg-black border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-white rounded grid grid-cols-2 gap-0.5 p-1">
          <div className="bg-black rounded-sm"></div>
          <div className="bg-black rounded-sm"></div>
          <div className="bg-black rounded-sm"></div>
          <div className="bg-black rounded-sm"></div>
        </div>
        <span className="text-white font-medium">Payper app</span>
      </div>
      <button className="relative" onClick={() => setCartModalOpen(true)}>
        <ShoppingCart className="w-6 h-6 text-white" />
        {cart.length > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </Badge>
        )}
      </button>
    </div>
  )

  const BalanceSection = () => (
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
            className={`rounded-full px-4 py-2 text-sm ${
              selectedCategory === category.id
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

  const ProductGrid = () => (
    <div className="px-4 mt-6 grid grid-cols-2 gap-4">
      {filteredProducts.map((product) => {
        const cartItem = cart.find((item) => item.id === product.id)
        const quantity = cartItem?.quantity || 0

        return (
          <div key={product.id} className="bg-zinc-900 rounded-2xl p-4 space-y-3">
            <div className="aspect-square bg-zinc-800 rounded-xl overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-medium">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">{formatPrice(product.price)}</span>
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

  const CartModal = () => (
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

  const OrderConfirmModal = () => (
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
                    setCart([])
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

  const MenuView = () => (
    <>
      <BalanceSection />
      <CategoryTabs />
      <ProductGrid />
      {cart.length > 0 && (
        <div className="fixed bottom-20 left-4 right-4">
          <Button
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl p-4 border border-lime-400 leading-7 tracking-normal my-2.5 mx-0 h-auto"
            onClick={() => setCartModalOpen(true)}
          >
            <div className="flex items-center justify-between w-full">
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
    </>
  )

  const InvitationsView = () => {
    const stats = getEventStats()

    return (
      <div className="px-4 pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">Invitaciones</h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full px-3 py-1 text-xs ${
                showHistory ? "bg-lime-400 text-black" : "text-zinc-400 hover:text-white"
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
                        <SelectItem value="free" className="text-white">
                          Free
                        </SelectItem>
                        <SelectItem value="vip" className="text-white">
                          VIP
                        </SelectItem>
                        <SelectItem value="paid" className="text-white">
                          Paga
                        </SelectItem>
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
                          const message =
                            invitationType === "vip"
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
                  className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${
                    historyFilter === filter.id
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
                  className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${
                    selectedEvent === event.id
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
    )
  }

  const TablesView = () => (
    <div className="px-4 pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-xl font-bold">Mesas</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full px-3 py-1 text-xs ${
              showHistory ? "bg-lime-400 text-black" : "text-zinc-400 hover:text-white"
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
            <div className="text-lime-400 text-lg font-bold">23</div>
            <div className="text-zinc-400 text-xs">Vendidas</div>
          </div>
          <div className="bg-zinc-900 rounded-xl p-3 text-center">
            <div className="text-white text-lg font-bold">7</div>
            <div className="text-zinc-400 text-xs">Disponibles</div>
          </div>
          <div className="bg-zinc-900 rounded-xl p-3 text-center">
            <div className="text-lime-400 text-lg font-bold">8</div>
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
                className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${
                  historyFilter === filter.id
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
          {Array.from({ length: 30 }, (_, i) => {
            const tableNumber = i + 1
            const isAvailable = [3, 7, 9, 12, 15, 18, 21].includes(tableNumber)
            const owner = isAvailable
              ? null
              : ["Juan Pérez", "Ana García", "Carlos López"][Math.floor(Math.random() * 3)]

            return (
              <div
                key={i}
                className={`bg-zinc-900 rounded-xl p-3 text-center border ${
                  isAvailable ? "border-lime-400" : "border-zinc-700"
                }`}
              >
                <div className="text-white font-bold mb-2">Mesa {tableNumber}</div>
                {isAvailable ? (
                  <div className="space-y-2">
                    <Badge className="bg-lime-400 text-black text-xs">Libre</Badge>
                    <Dialog open={tableModalOpen && selectedTable === tableNumber} onOpenChange={setTableModalOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="w-full bg-lime-400 hover:bg-lime-500 text-black text-xs py-1 rounded-full"
                          onClick={() => setSelectedTable(tableNumber)}
                        >
                          Vender
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm mx-4">
                        <DialogHeader>
                          <DialogTitle className="text-lime-400">Vender Mesa {tableNumber}</DialogTitle>
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
                    <Badge className="bg-zinc-700 text-white text-xs">Vendida</Badge>
                    <p className="text-zinc-500 text-xs">{owner}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  const CourtesiesView = () => (
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
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="trago" className="text-white">
                      Trago Premium
                    </SelectItem>
                    <SelectItem value="shots" className="text-white">
                      Shots x2
                    </SelectItem>
                    <SelectItem value="champagne" className="text-white">
                      Champagne
                    </SelectItem>
                    <SelectItem value="botella" className="text-white">
                      Botella Vino
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Para</Label>
                <Input
                  placeholder="Nombre del invitado"
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
                <Gift className="w-4 h-4 mr-2" />
                Confirmar Envío
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
        {[
          { item: "Trago Premium", recipient: "María González", time: "22:30", status: "delivered" },
          { item: "Champagne", recipient: "Carlos Ruiz", time: "23:15", status: "pending" },
          { item: "Shots x4", recipient: "Ana López", time: "23:45", status: "delivered" },
        ].map((courtesy, index) => (
          <div key={index} className="bg-zinc-900 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">{courtesy.item}</h4>
                <p className="text-zinc-400 text-sm">Para: {courtesy.recipient}</p>
                <p className="text-zinc-500 text-xs">{courtesy.time}</p>
              </div>
              <Badge className={courtesy.status === "delivered" ? "bg-lime-400 text-black" : "bg-zinc-700 text-white"}>
                {courtesy.status === "delivered" ? "Entregado" : "Pendiente"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const StatsView = () => (
    <div className="px-4 pt-4 space-y-4">
      <h2 className="text-white text-xl font-bold">Mi Perfil</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 rounded-2xl p-4 text-center">
          <div className="text-lime-400 text-2xl font-bold">127</div>
          <div className="text-zinc-400 text-sm">Invitaciones</div>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-4 text-center">
          <div className="text-lime-400 text-2xl font-bold">89</div>
          <div className="text-zinc-400 text-sm">Confirmadas</div>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-4 text-center">
          <div className="text-lime-400 text-2xl font-bold">23</div>
          <div className="text-zinc-400 text-sm">Mesas Vendidas</div>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-4 text-center">
          <div className="text-lime-400 text-2xl font-bold">$2,310</div>
          <div className="text-zinc-400 text-sm">Comisiones</div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-4">
        <h3 className="text-white font-medium mb-3">Comisiones del Mes</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-zinc-400">Mesas vendidas</span>
            <span className="text-lime-400 font-bold">$1,840</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Invitaciones pagas</span>
            <span className="text-lime-400 font-bold">$470</span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium">Historial de Transacciones</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-lime-400 hover:text-lime-300 hover:bg-zinc-800"
            onClick={() => setShowTransactionHistory(!showTransactionHistory)}
          >
            {showTransactionHistory ? "Ocultar" : "Ver todo"}
          </Button>
        </div>

        {showTransactionHistory && (
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
                  className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${
                    historyFilter === filter.id
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
              {filterHistoryByDate(transactionHistory).length} transacciones encontradas
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filterHistoryByDate(transactionHistory).map((transaction) => (
                <div key={transaction.id} className="bg-zinc-800 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === "purchase" ? "bg-red-500/20" : "bg-lime-500/20"
                        }`}
                      >
                        {transaction.type === "purchase" ? (
                          <ShoppingCart className="w-4 h-4 text-red-400" />
                        ) : (
                          <Plus className="w-4 h-4 text-lime-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-medium">{transaction.description}</h4>
                        <p className="text-zinc-500 text-xs">
                          {new Date(transaction.date).toLocaleDateString("es")}
                          {transaction.qrCode && ` • ${transaction.qrCode}`}
                          {transaction.method && ` • ${transaction.method}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-sm ${transaction.amount > 0 ? "text-lime-400" : "text-red-400"}`}>
                        {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                      </div>
                      <Badge className="bg-lime-400 text-black text-xs">
                        {transaction.status === "completed" ? "Completado" : "Pendiente"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!showTransactionHistory && (
          <div className="space-y-2">
            {transactionHistory.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      transaction.type === "purchase" ? "bg-red-500/20" : "bg-lime-500/20"
                    }`}
                  >
                    {transaction.type === "purchase" ? (
                      <ShoppingCart className="w-3 h-3 text-red-400" />
                    ) : (
                      <Plus className="w-3 h-3 text-lime-400" />
                    )}
                  </div>
                  <span className="text-zinc-400 text-sm">{transaction.description}</span>
                </div>
                <span className={`text-sm font-medium ${transaction.amount > 0 ? "text-lime-400" : "text-red-400"}`}>
                  {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderCurrentView = () => {
    switch (currentView) {
      case "home":
        return <MenuView />
      case "invitations":
        return <InvitationsView />
      case "tables":
        return <TablesView />
      case "cortesias":
        return <CourtesiesView />
      case "perfil":
        return <StatsView />
      default:
        return <MenuView />
    }
  }

  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 px-4 py-3">
      <div className="flex justify-around items-center">
        {[
          { id: "home", icon: Menu, label: "Menu" },
          { id: "invitations", icon: Users, label: "Invitaciones" },
          { id: "tables", icon: Calendar, label: "Mesas" },
          { id: "cortesias", icon: Gift, label: "Cortesías" },
          { id: "perfil", icon: User, label: "Perfil" },
        ].map((item) => (
          <button
            key={item.id}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
              currentView === item.id ? "text-lime-400" : "text-zinc-500 hover:text-white"
            }`}
            onClick={() => setCurrentView(item.id)}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black pb-20">
      <Header />
      {renderCurrentView()}
      <BottomNav />
    </div>
  )
}
