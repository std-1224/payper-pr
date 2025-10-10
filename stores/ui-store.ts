import { create } from 'zustand'

interface UIState {
  // Table management state
  selectedTable: number | null
  tableModalOpen: boolean
  tablePrice: string
  clientName: string
  customMessage: string
  
  // History and filters
  showHistory: boolean
  historyFilter: string
  selectedMonth: number
  selectedYear: number
  
  // Actions
  setSelectedTable: (tableNumber: number | null) => void
  setTableModalOpen: (open: boolean) => void
  setTablePrice: (price: string) => void
  setClientName: (name: string) => void
  setCustomMessage: (message: string) => void
  setShowHistory: (show: boolean) => void
  setHistoryFilter: (filter: string) => void
  setSelectedMonth: (month: number) => void
  setSelectedYear: (year: number) => void
  
  // Reset functions
  resetTableForm: () => void
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  selectedTable: null,
  tableModalOpen: false,
  tablePrice: '',
  clientName: '',
  customMessage: '',
  showHistory: false,
  historyFilter: 'all',
  selectedMonth: new Date().getMonth(),
  selectedYear: new Date().getFullYear(),
  
  // Actions
  setSelectedTable: (tableNumber) => set({ selectedTable: tableNumber }),
  setTableModalOpen: (open) => set({ tableModalOpen: open }),
  setTablePrice: (price) => set({ tablePrice: price }),
  setClientName: (name) => set({ clientName: name }),
  setCustomMessage: (message) => set({ customMessage: message }),
  setShowHistory: (show) => set({ showHistory: show }),
  setHistoryFilter: (filter) => set({ historyFilter: filter }),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
  setSelectedYear: (year) => set({ selectedYear: year }),
  
  // Reset functions
  resetTableForm: () => set({
    tablePrice: '',
    clientName: '',
    customMessage: '',
    selectedTable: null,
    tableModalOpen: false,
  }),
}))
