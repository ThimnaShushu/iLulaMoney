"use client"

import { motion } from "framer-motion"
import { Eye, EyeOff, TrendingUp } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"

export function BalanceCard() {
  const [showBalance, setShowBalance] = useState(true)
  const { balance, currency } = useAppStore()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-gradient-to-br from-[#00d8d5] to-[#00b8b5] text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm opacity-90">Available Balance</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowBalance(!showBalance)}
              className="text-white hover:bg-white/20"
            >
              {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-bold">{showBalance ? `${currency} ${balance.toFixed(2)}` : "••••••"}</div>
            <div className="text-sm opacity-75">Last updated: {new Date().toLocaleTimeString()}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
