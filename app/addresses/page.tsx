"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, Edit2, Trash2, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Navigation } from "@/components/navigation"
import { useAppStore } from "@/lib/store"

export default function AddressesPage() {
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newNickname, setNewNickname] = useState("")
  const [newAddress, setNewAddress] = useState("")

  const { savedAddresses, addSavedAddress, removeSavedAddress } = useAppStore()

  const handleAddAddress = () => {
    if (newNickname && newAddress) {
      addSavedAddress({
        nickname: newNickname,
        address: newAddress,
        lastUsed: new Date(),
      })
      setNewNickname("")
      setNewAddress("")
      setIsAddingNew(false)
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
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Saved Addresses</h1>
            </div>

            <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
              <DialogTrigger asChild>
                <Button className="bg-[#00d8d5] hover:bg-[#00b8b5]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input
                      id="nickname"
                      placeholder="e.g., Mama Thabo's Shop"
                      value={newNickname}
                      onChange={(e) => setNewNickname(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Wallet Address</Label>
                    <Input
                      id="address"
                      placeholder="$wallet.example/recipient"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddAddress} className="flex-1 bg-[#00d8d5] hover:bg-[#00b8b5]">
                      Save Address
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Addresses List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {savedAddresses.map((address, index) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{address.nickname}</h3>
                        <p className="text-sm text-gray-600 mb-2 font-mono">{address.address}</p>
                        {address.lastUsed && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            Last used: {new Date(address.lastUsed).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="text-gray-500">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeSavedAddress(address.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {savedAddresses.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved addresses yet</h3>
                  <p className="text-gray-600 mb-4">Add frequently used wallet addresses for quick payments</p>
                  <Button onClick={() => setIsAddingNew(true)} className="bg-[#00d8d5] hover:bg-[#00b8b5]">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Address
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
