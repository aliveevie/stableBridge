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
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-white">
      <main className="flex-1 p-6 space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-6">Available Pools</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pools.map((pool) => (
              <Card key={pool.id} className="bg-[#1e293b] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">{pool.name}</CardTitle>
                  <div className="flex items-center text-green-400">
                    <PercentIcon className="w-4 h-4 mr-1" />
                    <span>{pool.apy}% APY</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Value Locked</span>
                    <span className="font-medium text-white">${(pool.tvl / 1000000).toFixed(1)}M</span>
                  </div>
                  <Button 
                    className="w-full bg-blue-500 hover:bg-blue-600" 
                    onClick={() => setSelectedPool(pool)}
                  >
                    Stake
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        {selectedPool && (
          <Card className="bg-[#1e293b] border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Stake in {selectedPool.name} Pool</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stake-amount">Stake Amount</Label>
                  <Input
                    id="stake-amount"
                    placeholder="0.00"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="bg-[#2d3748] border-gray-600 text-white"
                  />
                </div>
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={() => handleStake(selectedPool)}
                >
                  Confirm Stake
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        <section>
          <h2 className="text-3xl font-bold mb-6">Your Staked Tokens</h2>
          <Card className="bg-[#1e293b] border-gray-700">
            <CardContent className="p-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-[#2d3748]">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div className="space-y-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Staked</span>
                      <span className="font-medium">$5,234.56</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Rewards Earned</span>
                      <span className="font-medium">$234.56</span>
                    </div>
                    <div className="flex space-x-4">
                      <Button variant="outline" className="flex-1">Withdraw</Button>
                      <Button className="flex-1 bg-blue-500 hover:bg-blue-600">Claim Rewards</Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="details">
                  <div className="space-y-4 mt-4">
                    {pools.map((pool) => (
                      <div key={pool.id} className="flex justify-between items-center">
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
      <footer className="bg-[#1e293b] py-4 px-6 text-center text-sm text-gray-400">
        <p>&copy; 2024 StableBridge. All rights reserved.</p>
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