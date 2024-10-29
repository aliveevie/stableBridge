"use client"

import { useState, useContext } from "react"
import { UserContext } from "./userContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"

export function Stake() {
  const { userData } = useContext(UserContext)
  const [stakeAmount, setStakeAmount] = useState("")
  const [unstakeAmount, setUnstakeAmount] = useState("")

  const isConnected = !!userData

  const handleStake = () => {
    if (!isConnected) {
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

    // Implement actual staking logic here
    toast({
      title: "Staking successful",
      description: `You have staked ${stakeAmount} STX.`,
    })
    setStakeAmount("")
  }

  const handleUnstake = () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to unstake.",
        variant: "destructive",
      })
      return
    }

    if (!unstakeAmount || isNaN(parseFloat(unstakeAmount))) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid unstake amount.",
        variant: "destructive",
      })
      return
    }

    // Implement actual unstaking logic here
    toast({
      title: "Unstaking successful",
      description: `You have unstaked ${unstakeAmount} STX.`,
    })
    setUnstakeAmount("")
  }

  const handleClaimRewards = () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to claim rewards.",
        variant: "destructive",
      })
      return
    }

    // Implement actual reward claiming logic here
    toast({
      title: "Rewards claimed",
      description: "Your rewards have been successfully claimed.",
    })
  }

  return (
    <div className="w-full bg-[#0f172a] min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Stacks Ecosystem</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-[#1e293b] text-white border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Stake STX</CardTitle>
              <CardDescription className="text-gray-400">
                Earn rewards by staking your Stacks (STX) tokens and contributing to the network.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="stake" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-[#2d3748]">
                  <TabsTrigger value="stake" disabled={!isConnected}>Stake</TabsTrigger>
                  <TabsTrigger value="unstake" disabled={!isConnected}>Unstake</TabsTrigger>
                </TabsList>
                <TabsContent value="stake">
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="stake-amount">Stake Amount</Label>
                      <Input
                        id="stake-amount"
                        placeholder="0.00"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="bg-[#2d3748] border-gray-600 text-white"
                        disabled={!isConnected}
                      />
                    </div>
                    <Button 
                      className="w-full bg-blue-500 hover:bg-blue-600" 
                      onClick={handleStake}
                      disabled={!isConnected}
                    >
                      {isConnected ? "Stake STX" : "Connect Wallet to Stake"}
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="unstake">
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="unstake-amount">Unstake Amount</Label>
                      <Input
                        id="unstake-amount"
                        placeholder="0.00"
                        value={unstakeAmount}
                        onChange={(e) => setUnstakeAmount(e.target.value)}
                        className="bg-[#2d3748] border-gray-600 text-white"
                        disabled={!isConnected}
                      />
                    </div>
                    <Button 
                      className="w-full bg-blue-500 hover:bg-blue-600"
                      onClick={handleUnstake}
                      disabled={!isConnected}
                    >
                      {isConnected ? "Unstake STX" : "Connect Wallet to Unstake"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <Card className="bg-[#1e293b] text-white border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Staking Overview</CardTitle>
              <CardDescription className="text-gray-400">
                View your current staking balance and rewards.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Staking Balance</span>
                <span className="font-medium">{isConnected ? "12,345 STX" : "-- STX"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Rewards Earned</span>
                <span className="font-medium">{isConnected ? "1,234 STX" : "-- STX"}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleClaimRewards}
                disabled={!isConnected}
              >
                {isConnected ? "Claim Rewards" : "Connect Wallet to Claim"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}