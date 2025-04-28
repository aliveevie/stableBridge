"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function CallToAction() {
  return (
    <section className="relative py-24 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-gray-800">
          Ready to Bridge Your Assets?
        </h2>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
          Join thousands of users who are already benefiting from the seamless bridge between Ethereum and Bitcoin.
          Start your journey today.
        </p>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all hover:shadow-xl">
            <span className="flex items-center">
              Start Bridging Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </span>
          </button>
        </motion.div>

        <p className="mt-6 text-sm text-gray-500">
          No registration required. Connect your wallet and bridge in minutes.
        </p>
      </div>
    </section>
  )
}
