"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LogOut, User, Shield, History, DollarSign, TrendingUp, Calendar } from "lucide-react"
import { Header } from "@/components/shared/Header"
import { BottomNav } from "@/components/shared/BottomNav"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { transactionHistory } from "@/lib/data/mockData"

export default function ProfilePage() {
  const { cart, setCartModalOpen } = useCart()
  const { user, profile, signOut } = useAuth()
  const [showTransactionHistory, setShowTransactionHistory] = useState(false)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black pb-20">
        <Header cart={cart} onCartClick={() => setCartModalOpen(true)} />
        <div className="px-4 pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-xl font-bold">Mi Perfil</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
              onClick={signOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>

        {/* User Info Card */}
        <div className="bg-zinc-900 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-lime-400 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-black" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">
                {profile?.name || user?.user_metadata?.full_name || 'Usuario'}
              </h3>
              <p className="text-zinc-400 text-sm">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="w-3 h-3 text-lime-400" />
                <span className={`text-xs font-medium ${profile?.role === 'master' ? 'text-orange-400' : 'text-lime-400'
                  }`}>
                  {profile?.role?.toUpperCase() || 'USER'}
                </span>
                {(profile?.role === 'pr' || profile?.role === 'master') && (
                  <span className="text-xs text-zinc-500">• Authorized</span>
                )}
              </div>
            </div>
          </div>

          {profile && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {profile.phone && (
                <div>
                  <span className="text-zinc-400">Teléfono:</span>
                  <p className="text-white">{profile.phone}</p>
                </div>
              )}
              {profile.status && (
                <div>
                  <span className="text-zinc-400">Estado:</span>
                  <p className="text-white capitalize">{profile.status}</p>
                </div>
              )}
              {profile.balance !== null && (
                <div>
                  <span className="text-zinc-400">Balance:</span>
                  <p className="text-lime-400 font-medium">${profile.balance?.toLocaleString()}</p>
                </div>
              )}
              {profile.spent !== null && (
                <div>
                  <span className="text-zinc-400">Gastado:</span>
                  <p className="text-white">${profile.spent?.toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Grid */}
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

        {/* Commission Summary */}
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

        {/* Transaction History */}
        {showTransactionHistory && (
          <div className="bg-zinc-900 rounded-2xl p-4">
            <div className="space-y-3">
              {transactionHistory.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${transaction.type === "purchase" ? "bg-red-900/20" : "bg-lime-900/20"
                      }`}>
                      {transaction.type === "purchase" ? (
                        <DollarSign className="w-4 h-4 text-red-400" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-lime-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">
                        {transaction.type === "purchase" ? "Compra" : "Carga de saldo"}
                      </div>
                      <div className="text-zinc-400 text-xs">
                        {new Date(transaction.date).toLocaleDateString("es")}
                      </div>
                    </div>
                    <span className="text-zinc-400 text-sm">{transaction.description}</span>
                  </div>
                  <span className={`text-sm font-medium ${transaction.amount > 0 ? "text-lime-400" : "text-red-400"}`}>
                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
    </ProtectedRoute>
  )
}
