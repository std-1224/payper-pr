"use client"

import { useRouter, usePathname } from "next/navigation"
import { Menu, Users, Calendar, Gift, User } from "lucide-react"

export const BottomNav = () => {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { id: "menu", path: "/menu", icon: Menu, label: "Menu" },
    { id: "invitations", path: "/invitations", icon: Users, label: "Invitaciones" },
    { id: "tables", path: "/tables", icon: Calendar, label: "Mesas" },
    { id: "courtesies", path: "/courtesies", icon: Gift, label: "Cortesías" },
    { id: "profile", path: "/profile", icon: User, label: "Perfil" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 px-4 py-3">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
              pathname === item.path ? "text-lime-400" : "text-zinc-500 hover:text-white"
            }`}
            onClick={() => router.push(item.path)}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
