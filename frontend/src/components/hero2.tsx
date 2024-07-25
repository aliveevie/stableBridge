"use client"

import Link from "next/link"
import React from "react"
import Image from "next/image"
import hero2 from '../../public/hero2.jpg'

export function Hero2() {
  return (
    <>
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={hero2}
            width={1920}
            height={1080}
            alt="Hero Illustration"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center py-32 md:py-40 lg:py-48">
          <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              Secure and Reliable Cross-Chain Transfers
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl">
              StableBridge enables seamless and secure cross-chain transfers of stablecoins and other digital assets.
            </p>
            <Link
              href="#"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full bg-gradient-to-b from-primary to-primary/80 py-32 md:py-40 lg:py-48">
        <div className="container mx-auto max-w-5xl space-y-8 text-center text-primary-foreground">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Unlock the Power of Cross-Chain Liquidity
            </h2>
            <p className="text-xl md:text-2xl">
              StableBridge empowers you to seamlessly move your digital assets across different blockchain networks,
              unlocking new opportunities and expanding your financial horizons.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-primary/20 p-6 text-left shadow-lg">
              <ShuffleIcon className="h-12 w-12 text-primary-foreground" />
              <h3 className="mt-4 text-2xl font-bold">Effortless Transfers</h3>
              <p className="mt-2 text-base text-primary-foreground/80">
                Seamlessly move your stablecoins and other digital assets across different blockchain networks with just
                a few clicks.
              </p>
            </div>
            <div className="rounded-lg bg-primary/20 p-6 text-left shadow-lg">
              <LockIcon className="h-12 w-12 text-primary-foreground" />
              <h3 className="mt-4 text-2xl font-bold">Ironclad Security</h3>
              <p className="mt-2 text-base text-primary-foreground/80">
                Rest easy knowing your assets are protected by industry-leading security measures and audited smart
                contracts.
              </p>
            </div>
            <div className="rounded-lg bg-primary/20 p-6 text-left shadow-lg">
              <CurrencyIcon className="h-12 w-12 text-primary-foreground" />
              <h3 className="mt-4 text-2xl font-bold">Unparalleled Liquidity</h3>
              <p className="mt-2 text-base text-primary-foreground/80">
                Access deep liquidity pools across multiple blockchain networks, enabling you to move your assets with
                ease and efficiency.
              </p>
            </div>
          </div>
          <Link
            href="#"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary-foreground px-6 text-base font-medium text-primary transition-colors hover:bg-primary-foreground/90 focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            Explore StableBridge
          </Link>
        </div>
      </section>
    </>
  )
}

function CurrencyIcon(props:any) {
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
      <circle cx="12" cy="12" r="8" />
      <line x1="3" x2="6" y1="3" y2="6" />
      <line x1="21" x2="18" y1="3" y2="6" />
      <line x1="3" x2="6" y1="21" y2="18" />
      <line x1="21" x2="18" y1="21" y2="18" />
    </svg>
  )
}


function LockIcon(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}


function ShuffleIcon(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
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
      <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
      <path d="m18 2 4 4-4 4" />
      <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
      <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
      <path d="m18 14 4 4-4 4" />
    </svg>
  )
}


function XIcon(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
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
