"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, QrCode, BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { SuccessPopup } from "@/components/success-popup"
import { useAppStore } from "@/lib/store"
import { mockILPAPI } from "@/lib/mock-api"

export default function SendPage() {
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("ZAR")
  const [walletAddress, setWalletAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastTransaction, setLastTransaction] = useState<any>(null)

  const { balance, updateBalance, addTransaction, savedAddresses } = useAppStore()

  const handlePayment = async () => {
    if (!amount || !walletAddress) return

    setIsLoading(true)

    try {
      // 1. Create ILP quote
      const quote = await mockILPAPI.createQuote(Number.parseFloat(amount), currency, walletAddress)

      // 2. Execute payment
      const payment = await mockILPAPI.executePayment({
        quoteId: quote.id,
        walletAddress,
      })

      if (payment.success) {
        // 3. Update local state
        const newBalance = balance - Number.parseFloat(amount)
        updateBalance(newBalance)

        const transaction = {
          amount: Number.parseFloat(amount),
          currency,
          recipient: walletAddress,
          timestamp: new Date(),
          status: "completed" as const,
        }

        addTransaction(transaction)
        setLastTransaction({ ...transaction, id: payment.transactionId })

        // 4. Send notification
        await mockILPAPI.sendNotification(Number.parseFloat(amount), walletAddress, payment.transactionId)

        setShowSuccess(true)
        setAmount("")
        setWalletAddress("")
      }
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="lg:ml-64 pt-20 lg:pt-0 pb-20 lg:pb-0 px-4 lg:px-8 py-6">
        <div className="max-w-2xl mx-auto">
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
            <h1 className="text-2xl font-bold text-gray-900">Send Payment</h1>
          </motion.div>

          {/* Payment Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-lg"
                      />
                    </div>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ZAR">ZAR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Wallet Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Wallet Address</Label>
                  <div className="space-y-2">
                    <Input
                      id="address"
                      placeholder="$wallet.example/recipient"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                    />

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <Link href="/scan" className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent" size="sm">
                          <QrCode className="h-4 w-4 mr-2" />
                          Scan QR
                        </Button>
                      </Link>
                      <Link href="/addresses" className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent" size="sm">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Saved
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Saved Addresses Quick Select */}
                {savedAddresses.length > 0 && (
                  <div className="space-y-2">
                    <Label>Quick Select</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {savedAddresses.slice(0, 3).map((addr) => (
                        <Button
                          key={addr.id}
                          variant="ghost"
                          className="justify-start h-auto p-3 text-left"
                          onClick={() => setWalletAddress(addr.address)}
                        >
                          <div>
                            <p className="font-medium">{addr.nickname}</p>
                            <p className="text-sm text-gray-500 truncate">{addr.address}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pay Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handlePayment}
                    disabled={!amount || !walletAddress || isLoading}
                    className="w-full bg-[#00d8d5] hover:bg-[#00b8b5] text-white py-6 text-lg font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay ${currency} ${amount || "0.00"}`
                    )}
                  </Button>
                </motion.div>

                {/* Balance Info */}
                <div className="text-center text-sm text-gray-500">
                  Available balance: {currency} {balance.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Success Popup */}
      {lastTransaction && (
        <SuccessPopup
          isOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
          amount={lastTransaction.amount}
          currency={lastTransaction.currency}
          recipient={lastTransaction.recipient}
          transactionId={lastTransaction.id}
        />
      )}
    </div>
  )
}
