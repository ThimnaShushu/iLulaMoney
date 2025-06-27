"use client"

import { motion } from "framer-motion"
import { ArrowLeft, TrendingUp, Target, Calendar } from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { useAppStore } from "@/lib/store"

const monthlySpendData = [
  { month: "Jan", grocery: 450, transport: 200, utilities: 150, other: 100 },
  { month: "Feb", grocery: 520, transport: 180, utilities: 160, other: 120 },
  { month: "Mar", grocery: 480, transport: 220, utilities: 140, other: 90 },
  { month: "Apr", grocery: 600, transport: 250, utilities: 170, other: 110 },
  { month: "May", grocery: 550, transport: 200, utilities: 160, other: 95 },
  { month: "Jun", grocery: 580, transport: 230, utilities: 180, other: 105 },
]

const savingsData = [
  { month: "Jan", spent: 900, target: 800 },
  { month: "Feb", spent: 980, target: 850 },
  { month: "Mar", spent: 930, target: 900 },
  { month: "Apr", spent: 1130, target: 950 },
  { month: "May", spent: 1005, target: 1000 },
  { month: "Jun", spent: 1095, target: 1050 },
]

const categoryData = [
  { name: "Grocery", value: 35, color: "#00d8d5" },
  { name: "Transport", value: 25, color: "#00b8b5" },
  { name: "Utilities", value: 20, color: "#0099a3" },
  { name: "Other", value: 20, color: "#007a82" },
]

export default function AnalyticsPage() {
  const { transactions, balance } = useAppStore()

  const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0)
  const avgTransaction = totalSpent / (transactions.length || 1)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="lg:ml-64 pt-20 lg:pt-0 pb-20 lg:pb-0 px-4 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#00d8d5]/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-[#00d8d5]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">R{totalSpent.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#00d8d5]/10 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-[#00d8d5]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Transaction</p>
                    <p className="text-2xl font-bold text-gray-900">R{avgTransaction.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#00d8d5]/10 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-[#00d8d5]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">{transactions.length} payments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monthly Spend by Category */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Spend by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlySpendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="grocery" stackId="a" fill="#00d8d5" />
                      <Bar dataKey="transport" stackId="a" fill="#00b8b5" />
                      <Bar dataKey="utilities" stackId="a" fill="#0099a3" />
                      <Bar dataKey="other" stackId="a" fill="#007a82" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Spending vs Target */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Spending vs Target</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={savingsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="spent" stroke="#ff6b6b" strokeWidth={3} name="Actual Spending" />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#00d8d5"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        name="Target"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Spending Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Savings Advice */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Savings Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">💡 Good News!</h4>
                    <p className="text-sm text-green-700">You're spending 8% less than last month. Keep it up!</p>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Watch Out</h4>
                    <p className="text-sm text-yellow-700">
                      Transport costs increased by 15% this month. Consider carpooling or public transport.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">📊 Tip</h4>
                    <p className="text-sm text-blue-700">
                      Set a monthly budget of R1000 to stay on track with your savings goals.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
