"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Send, QrCode, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { BalanceCard } from "@/components/balance-card"
import { MiniChart } from "@/components/mini-chart"
import { useAppStore } from "@/lib/store"

export default function HomePage() {
  const { transactions } = useAppStore()
  const recentTransactions = transactions.slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="lg:ml-64 pt-20 lg:pt-0 pb-20 lg:pb-0 px-4 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Welcome back! 👋</h1>
            <p className="text-gray-600">Ready to make instant payments across South Africa</p>
          </motion.div>

          {/* Balance Card */}
          <BalanceCard />

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            <Link href="/send">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-[#00d8d5]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Send className="h-6 w-6 text-[#00d8d5]" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Send Payment</h3>
                    <p className="text-sm text-gray-600 mt-1">Quick & secure</p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            <Link href="/scan">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-[#00d8d5]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <QrCode className="h-6 w-6 text-[#00d8d5]" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Scan QR</h3>
                    <p className="text-sm text-gray-600 mt-1">Instant scan</p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </motion.div>

          {/* Charts */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <MiniChart />
          </motion.div>

          {/* Recent Transactions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <Link href="/analytics">
                  <Button variant="ghost" size="sm" className="text-[#00d8d5]">
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tx.recipient}</p>
                        <p className="text-sm text-gray-500">{new Date(tx.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        -{tx.currency} {tx.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-green-600 capitalize">{tx.status}</p>
                    </div>
                  </div>
                ))}

                {recentTransactions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No recent transactions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
