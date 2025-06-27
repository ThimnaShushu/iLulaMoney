import { create } from "zustand"
import { persist } from "zustand/middleware"

interface PaymentAddress {
  id: string
  nickname: string
  address: string
  lastUsed?: Date
}

interface Transaction {
  id: string
  amount: number
  currency: string
  recipient: string
  timestamp: Date
  status: "completed" | "pending" | "failed"
}

interface AppState {
  balance: number
  currency: string
  savedAddresses: PaymentAddress[]
  transactions: Transaction[]

  // Actions
  updateBalance: (amount: number) => void
  addSavedAddress: (address: Omit<PaymentAddress, "id">) => void
  removeSavedAddress: (id: string) => void
  addTransaction: (transaction: Omit<Transaction, "id">) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      balance: 2500.75,
      currency: "ZAR",
      savedAddresses: [
        {
          id: "1",
          nickname: "Mama Thabo (Spaza)",
          address: "$wallet.example/mama-thabo",
          lastUsed: new Date("2024-01-15"),
        },
        {
          id: "2",
          nickname: "Taxi Fare",
          address: "$wallet.example/taxi-001",
          lastUsed: new Date("2024-01-14"),
        },
      ],
      transactions: [
        {
          id: "1",
          amount: 25.5,
          currency: "ZAR",
          recipient: "Mama Thabo (Spaza)",
          timestamp: new Date("2024-01-15T10:30:00"),
          status: "completed",
        },
        {
          id: "2",
          amount: 15.0,
          currency: "ZAR",
          recipient: "Taxi Fare",
          timestamp: new Date("2024-01-14T08:15:00"),
          status: "completed",
        },
      ],

      updateBalance: (amount) => set({ balance: amount }),

      addSavedAddress: (address) =>
        set((state) => ({
          savedAddresses: [...state.savedAddresses, { ...address, id: Date.now().toString() }],
        })),

      removeSavedAddress: (id) =>
        set((state) => ({
          savedAddresses: state.savedAddresses.filter((addr) => addr.id !== id),
        })),

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [{ ...transaction, id: Date.now().toString() }, ...state.transactions],
        })),
    }),
    {
      name: "payflowza-storage",
    },
  ),
)
