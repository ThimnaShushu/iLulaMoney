"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuccessPopupProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  currency: string
  recipient: string
  transactionId: string
}

export function SuccessPopup({ isOpen, onClose, amount, currency, recipient, transactionId }: SuccessPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200,
            }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-6 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-gray-600">
                  Payment of{" "}
                  <span className="font-semibold text-[#00d8d5]">
                    {currency} {amount.toFixed(2)}
                  </span>{" "}
                  sent to
                </p>
                <p className="font-semibold text-gray-900">{recipient}</p>
                <p className="text-sm text-gray-500 mt-2">Ref #{transactionId}</p>
              </div>

              <Button onClick={onClose} className="w-full bg-[#00d8d5] hover:bg-[#00b8b5] text-white">
                Done
              </Button>
            </div>

            <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4">
              <X className="h-5 w-5" />
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
