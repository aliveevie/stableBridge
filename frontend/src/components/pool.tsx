import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { JSX, SVGProps } from "react"

export function Pool() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-muted/40 p-4 md:p-10 grid gap-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Available Pools</h2>
            <Button>Connect Wallet</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>USDC-USDT</CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <PercentIcon className="w-4 h-4" />
                  <span>12.5% APY</span>
                </div>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Value Locked</span>
                  <span>$12.3M</span>
                </div>
                <Button size="sm">Stake</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>DAI-USDC</CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <PercentIcon className="w-4 h-4" />
                  <span>11.2% APY</span>
                </div>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Value Locked</span>
                  <span>$8.7M</span>
                </div>
                <Button size="sm">Stake</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>BUSD-USDC</CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <PercentIcon className="w-4 h-4" />
                  <span>10.8% APY</span>
                </div>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Value Locked</span>
                  <span>$6.5M</span>
                </div>
                <Button size="sm">Stake</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>TUSD-USDC</CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <PercentIcon className="w-4 h-4" />
                  <span>9.7% APY</span>
                </div>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Value Locked</span>
                  <span>$4.2M</span>
                </div>
                <Button size="sm">Stake</Button>
              </CardContent>
            </Card>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Your Staked Tokens</h2>
          <Card>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Staked</span>
                <span className="font-medium">$5,234.56</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rewards Earned</span>
                <span className="font-medium">$234.56</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Withdraw
                </Button>
                <Button size="sm">Claim Rewards</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <footer className="bg-background border-t px-4 md:px-6 py-4 flex items-center justify-between text-sm text-muted-foreground">
        <p>&copy; 2024 stableBridge. All rights reserved.</p>
        <nav className="flex gap-4">
          <Link href="#" className="hover:underline underline-offset-4" prefetch={false}>
            Terms
          </Link>
          <Link href="#" className="hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
          <Link href="#" className="hover:underline underline-offset-4" prefetch={false}>
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function PercentIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <line x1="19" x2="5" y1="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  )
}
