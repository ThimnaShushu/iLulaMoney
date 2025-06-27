"use client"

import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"

export function MiniChart() {
  const { transactions } = useAppStore()

  // Generate last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))

    const dayTransactions = transactions.filter((tx) => {
      const txDate = new Date(tx.timestamp)
      return txDate.toDateString() === date.toDateString()
    })

    const total = dayTransactions.reduce((sum, tx) => sum + tx.amount, 0)

    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      amount: total,
    }
  })

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-gray-600">Last 7 Days</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={last7Days}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
            <Bar dataKey="amount" fill="#00d8d5" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
