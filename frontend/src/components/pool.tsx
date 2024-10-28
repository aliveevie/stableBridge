"use client"

import { useContext, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserContext } from "./userContext"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { JSX, SVGProps } from "react"

interface Pool {
  id: string
  name: string
  apy: number
  tvl: number
  token1: string
  token2: string
}

export function Pool() {
  const { userData, tokens } = useContext(UserContext)
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null)
  const [stakeAmount, setStakeAmount] = useState("")

  const pools: Pool[] = [
    { id: "1", name: "USDC-USDT", apy: 12.5, tvl: 12300000, token1: "USDC", token2: "USDT" },
    { id: "2", name: "DAI-USDC", apy: 11.2, tvl: 8700000, token1: "DAI", token2: "USDC" },
    { id: "3", name: "BUSD-USDC", apy: 10.8, tvl: 6500000, token1: "BUSD", token2: "USDC" },
    { id: "4", name: "TUSD-USDC", apy: 9.7, tvl: 4200000, token1: "TUSD", token2: "USDC" },
  ]

  const handleStake = (pool: Pool) => {
    if (!userData) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to stake.",
        variant: "destructive",
      })
      return
    }

    if (!stakeAmount || isNaN(parseFloat(stakeAmount))) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid stake amount.",
        variant: "destructive",
      })
      return
    }

    // Implement staking logic here
    toast({
      title: "Staking successful",
      description: `You have staked ${stakeAmount} in the ${pool.name} pool.`,
    })
    setStakeAmount("")
    setSelectedPool(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <main className="flex-1 p-4 md:p-10 grid gap-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Available Pools</h2>
            <Button variant="outline">{userData ? "Connected" : "Connect Wallet"}</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pools.map((pool) => (
              <Card key={pool.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{pool.name}</span>
                    <div className="flex items-center gap-1 text-sm text-green-400">
                      <PercentIcon className="w-4 h-4" />
                      <span>{pool.apy}% APY</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Value Locked</span>
                    <span>${(pool.tvl / 1000000).toFixed(1)}M</span>
                  </div>
                  <Button size="sm" onClick={() => setSelectedPool(pool)}>
                    Stake
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        {selectedPool && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Stake in {selectedPool.name} Pool</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="stake-amount">Stake Amount</Label>
                  <Input
                    id="stake-amount"
                    placeholder="0.00"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <Button onClick={() => handleStake(selectedPool)}>Confirm Stake</Button>
              </div>
            </CardContent>
          </Card>
        )}
        <section>
          <h2 className="text-2xl font-bold mb-4">Your Staked Tokens</h2>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div className="grid gap-4 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Total Staked</span>
                      <span className="font-medium">$5,234.56</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Rewards Earned</span>
                      <span className="font-medium">$234.56</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Withdraw
                      </Button>
                      <Button size="sm">Claim Rewards</Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="details">
                  <div className="grid gap-4 mt-4">
                    {pools.map((pool) => (
                      <div key={pool.id} className="flex items-center justify-between">
                        <span>{pool.name}</span>
                        <span>$1,000.00</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </main>
      <footer className="bg-gray-900 border-t border-gray-800 px-4 md:px-6 py-4 flex items-center justify-between text-sm text-gray-400">
        <p>&copy; 2024 stableBridge. All rights reserved.</p>
        <nav className="flex gap-4">
          <Link href="#" className="hover:text-white transition-colors" prefetch={false}>
            Terms
          </Link>
          <Link href="#" className="hover:text-white transition-colors" prefetch={false}>
            Privacy
          </Link>
          <Link href="#" className="hover:text-white transition-colors" prefetch={false}>
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