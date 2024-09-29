import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { JSX, SVGProps } from "react"

export function Hero3() {
  return (
    <div className="flex flex-col">
     
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-8 shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-primary-foreground rounded-full p-2 mr-4">
                  <WalletIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Secure Transactions</h3>
              </div>
              <p className="text-muted-foreground">
                Stablebridge offers industry-leading security measures to protect your web3 asset transactions. Rest
                easy knowing your assets are safe.
              </p>
            </div>
            <div className="bg-card rounded-lg p-8 shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-primary-foreground rounded-full p-2 mr-4">
                  <InfoIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Advanced Analytics</h3>
              </div>
              <p className="text-muted-foreground">
                Gain valuable insights into your web3 asset performance with our comprehensive analytics dashboard. Make
                informed decisions with ease.
              </p>
            </div>
            <div className="bg-card rounded-lg p-8 shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-primary-foreground rounded-full p-2 mr-4">
                  <CoinsIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Seamless Integration</h3>
              </div>
              <p className="text-muted-foreground">
                Stablebridge seamlessly integrates with your existing web3 asset management systems, making it easy to
                manage your assets from a single platform.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-muted py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Stablebridge Features</h2>
            <p className="text-muted-foreground">Seamless web3 asset management across different blockchains.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-8 shadow-md">
              <h3 className="text-2xl font-bold mb-4">Swap</h3>
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-bold">Swap your assets across different blockchains</span>
              </div>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 mr-2 text-primary" />
                  <span>Seamless cross-chain transactions</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 mr-2 text-primary" />
                  <span>Competitive exchange rates</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 mr-2 text-primary" />
                  <span>Instant settlement</span>
                </li>
              </ul>
            </div>
            <div className="bg-card rounded-lg p-8 shadow-md">
              <h3 className="text-2xl font-bold mb-4">Stake</h3>
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-bold">Earn rewards by staking your assets</span>
              </div>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 mr-2 text-primary" />
                  <span>Competitive staking APYs</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 mr-2 text-primary" />
                  <span>Flexible staking periods</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 mr-2 text-primary" />
                  <span>Automatic compounding</span>
                </li>
              </ul>
            </div>
            <div className="bg-card rounded-lg p-8 shadow-md">
              <h3 className="text-2xl font-bold mb-4">Bridge</h3>
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-bold">Bridge your assets between blockchains</span>
              </div>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 mr-2 text-primary" />
                  <span>Secure and reliable bridge</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 mr-2 text-primary" />
                  <span>Instant asset transfers</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-5 w-5 mr-2 text-primary" />
                  <span>Low bridge fees</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function CheckIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}


function CoinsIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  )
}


function InfoIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}


function WalletIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  )
}


function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
