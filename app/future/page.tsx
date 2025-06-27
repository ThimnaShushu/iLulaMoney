"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Rocket, Users, Shield, Zap, Globe, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"

const roadmapItems = [
  {
    title: "Social Grant Disbursement",
    description:
      "Direct government grant payments via Interledger Protocol, eliminating intermediaries and reducing costs.",
    status: "In Development",
    icon: Heart,
    timeline: "Q2 2024",
  },
  {
    title: "Merchant Network Expansion",
    description: "Onboard 10,000+ spaza shops, taxis, and informal traders across South Africa.",
    status: "Planning",
    icon: Users,
    timeline: "Q3 2024",
  },
  {
    title: "Cross-Border Payments",
    description: "Enable instant, low-cost payments to neighboring SADC countries using ILP.",
    status: "Research",
    icon: Globe,
    timeline: "Q4 2024",
  },
  {
    title: "Offline Payment Capability",
    description: "SMS-based payments for areas with limited internet connectivity.",
    status: "Concept",
    icon: Zap,
    timeline: "2025",
  },
]

export default function FuturePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="lg:ml-64 pt-20 lg:pt-0 pb-20 lg:pb-0 px-4 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Future Initiatives</h1>
              <p className="text-gray-600 mt-2">Building the future of payments in South Africa</p>
            </div>
          </motion.div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-br from-[#00d8d5] to-[#00b8b5] text-white border-0">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Rocket className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Our Vision</h2>
                    <p className="opacity-90">Financial inclusion through innovative technology</p>
                  </div>
                </div>
                <p className="text-lg leading-relaxed">
                  PayFlowZA is pioneering the use of Interledger Protocol to create an inclusive financial ecosystem
                  that serves all South Africans, from urban centers to rural communities. Our mission is to eliminate
                  barriers to financial participation and enable instant, affordable payments for everyone.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Roadmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Development Roadmap</h2>
            <div className="space-y-6">
              {roadmapItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-[#00d8d5]/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="h-6 w-6 text-[#00d8d5]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                              <Badge
                                variant={item.status === "In Development" ? "default" : "secondary"}
                                className={item.status === "In Development" ? "bg-[#00d8d5]" : ""}
                              >
                                {item.status}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{item.description}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>Target:</span>
                              <span className="font-medium">{item.timeline}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Demo Images Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Real-World Implementation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    alt="Street vendor accepting mobile payments"
                    width={300}
                    height={200}
                    className="rounded-lg"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Street Vendor Integration</h3>
                  <p className="text-sm text-gray-600">
                    Local spaza shops and street vendors equipped with QR payment systems, enabling instant digital
                    transactions in informal markets.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    alt="Taxi dashboard with QR payment sticker"
                    width={300}
                    height={200}
                    className="rounded-lg"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Transport Payment System</h3>
                  <p className="text-sm text-gray-600">
                    Minibus taxis equipped with wallet address QR codes, allowing passengers to pay fares instantly
                    without cash handling.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Impact Metrics */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#00d8d5]" />
                  Expected Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#00d8d5] mb-2">2M+</div>
                    <p className="text-sm text-gray-600">South Africans with improved financial access</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#00d8d5] mb-2">50%</div>
                    <p className="text-sm text-gray-600">Reduction in payment processing costs</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#00d8d5] mb-2">24/7</div>
                    <p className="text-sm text-gray-600">Instant payment availability</p>
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
