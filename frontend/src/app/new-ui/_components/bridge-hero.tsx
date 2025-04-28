"use client"
import { motion } from "framer-motion"
import { EthereumLogo } from "./ethereum-logo"
import { BitcoinLogo } from "./bitcoin-logo"

export function BridgeHero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
      <div className="absolute inset-0 z-0 bg-[url('/grid-pattern.png')] opacity-5"></div>

      <div className="z-10 max-w-5xl">
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Cross-Chain Bridge
          </span>
          <span className="block mt-4 text-gray-800">Ethereum to Bitcoin on Stacks</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600 sm:text-2xl">
          The most intuitive way to move your assets between blockchains
        </p>
      </div>

      <div className="relative z-10 mt-16 flex items-center justify-center">
        <motion.div
          className="mx-6"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
            ease: "easeInOut",
            delay: 0.2,
          }}
        >
          <div className="w-32 h-32">
            <EthereumLogo />
          </div>
        </motion.div>

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
            ease: "easeInOut",
          }}
          className="mx-4 flex flex-col items-center"
        >
          <div className="h-2 w-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <div className="mt-2 text-sm font-medium text-gray-500">BRIDGE</div>
        </motion.div>

        <motion.div
          className="mx-6"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
            ease: "easeInOut",
            delay: 0,
          }}
        >
          <div className="w-32 h-32">
            <BitcoinLogo />
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <path d="M12 5v14"></path>
            <path d="m19 12-7 7-7-7"></path>
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
