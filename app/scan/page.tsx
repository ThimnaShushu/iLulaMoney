"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Camera, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState("")
  const router = useRouter()

  // Mock QR scanner - in real app would use react-qr-reader
  const startScanning = () => {
    setIsScanning(true)

    // Simulate scanning delay
    setTimeout(() => {
      const mockWalletAddress = "$wallet.example/mama-thabo"
      setScannedData(mockWalletAddress)
      setIsScanning(false)

      // Navigate to send page with pre-filled address
      router.push(`/send?address=${encodeURIComponent(mockWalletAddress)}`)
    }, 3000)
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
            <h1 className="text-2xl font-bold text-gray-900">Scan QR Code</h1>
          </motion.div>

          {/* Scanner Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <Card className="shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square bg-gray-900 flex items-center justify-center">
                  {!isScanning ? (
                    <div className="text-center text-white space-y-4">
                      <Camera className="h-16 w-16 mx-auto opacity-50" />
                      <p className="text-lg">Ready to scan</p>
                      <p className="text-sm opacity-75">Position the QR code within the frame</p>
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Mock camera view */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />

                      {/* Scanning overlay */}
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10">
                        <div className="w-64 h-64 border-2 border-[#00d8d5] rounded-lg relative">
                          {/* Corner indicators */}
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00d8d5] rounded-tl-lg" />
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#00d8d5] rounded-tr-lg" />
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#00d8d5] rounded-bl-lg" />
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#00d8d5] rounded-br-lg" />

                          {/* Scanning line */}
                          <motion.div
                            initial={{ y: 0 }}
                            animate={{ y: 256 }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                            className="absolute left-0 w-full h-0.5 bg-[#00d8d5] shadow-lg"
                          />
                        </div>

                        <p className="text-white text-center mt-4">Scanning...</p>
                      </motion.div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="flex gap-4">
              {!isScanning ? (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button
                    onClick={startScanning}
                    className="w-full bg-[#00d8d5] hover:bg-[#00b8b5] text-white py-6 text-lg font-semibold"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Start Scanning
                  </Button>
                </motion.div>
              ) : (
                <Button onClick={() => setIsScanning(false)} variant="outline" className="flex-1 py-6">
                  <X className="h-5 w-5 mr-2" />
                  Cancel
                </Button>
              )}
            </div>

            {/* Instructions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">How to scan:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Hold your device steady</li>
                  <li>• Ensure good lighting</li>
                  <li>• Position QR code within the frame</li>
                  <li>• Wait for automatic detection</li>
                </ul>
              </CardContent>
            </Card>

            {/* Demo QR Codes */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Demo QR Codes:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-xs text-gray-500">QR</span>
                    </div>
                    <p className="text-xs text-gray-600">Spaza Shop</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-xs text-gray-500">QR</span>
                    </div>
                    <p className="text-xs text-gray-600">Taxi Fare</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
