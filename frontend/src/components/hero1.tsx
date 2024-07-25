
import Link from "next/link"

export function Hero1() {
  return (
    <section className="bg-gradient-to-r from-primary to-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground">
                Unlock the Power of Stablebridge
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80">
                Stablebridge is the all-in-one platform for managing your web3 assets across different blockchains.
                Experience seamless transactions, secure storage, and advanced analytics.
              </p>
          
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary-foreground px-6 text-sm font-medium text-primary shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Get Started
              </Link>
            </div>
            <div className="hidden md:block">
              <img src="/placeholder.svg" width="600" height="400" alt="Hero Image" className="rounded-lg" />
            </div>
          </div>
        </div>
      </section>
  )
}
