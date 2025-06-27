// Mock ILP backend for development
export interface ILPQuote {
  id: string
  receiveAmount: {
    value: string
    assetCode: string
    assetScale: number
  }
  debitAmount: {
    value: string
    assetCode: string
    assetScale: number
  }
  expiresAt: string
}

export interface PaymentRequest {
  quoteId: string
  walletAddress: string
}

export const mockILPAPI = {
  async createQuote(amount: number, currency: string, walletAddress: string): Promise<ILPQuote> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      id: `quote_${Date.now()}`,
      receiveAmount: {
        value: (amount * 100).toString(), // Convert to cents
        assetCode: currency,
        assetScale: 2,
      },
      debitAmount: {
        value: (amount * 100).toString(),
        assetCode: currency,
        assetScale: 2,
      },
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
    }
  },

  async executePayment(request: PaymentRequest): Promise<{ success: boolean; transactionId: string }> {
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 95% success rate for demo
    const success = Math.random() > 0.05

    return {
      success,
      transactionId: `tx_${Date.now()}`,
    }
  },

  async sendNotification(amount: number, recipient: string, txId: string): Promise<void> {
    // Mock SMS/email notification
    console.log(`📱 SMS: Payment of R${amount} sent to ${recipient}. Ref #${txId}`)
    await new Promise((resolve) => setTimeout(resolve, 500))
  },
}
