"use client"

import React, { useState, useContext } from "react"
import { UserContext } from "./userContext"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { ArrowRightIcon, ChevronDownIcon } from "lucide-react"

interface Network {
  id: string
  name: string
  icon: React.ReactNode
}

interface Token {
  symbol: string
  name: string
  imageUrl: string
  price: string
  percent_change_24h: string
  contractAddress: string
}

const networks: Network[] = [
  { id: "stacks", name: "Stacks", icon: <StacksIcon className="h-5 w-5" /> },
  { id: "bitcoin", name: "Bitcoin", icon: <BitcoinIcon className="h-5 w-5" /> },
]

export function Bridge() {
  const { userData, tokens } = useContext(UserContext)
  const [fromNetwork, setFromNetwork] = useState<Network>(networks[0])
  const [toNetwork, setToNetwork] = useState<Network>(networks[1])
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [amount, setAmount] = useState<string>("")
  const [slippage, setSlippage] = useState<number>(0.5)
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false)

  const handleNetworkSwap = () => {
    setFromNetwork(toNetwork)
    setToNetwork(fromNetwork)
  }

  const handleBridge = () => {
    if (!userData) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to proceed with the bridge.",
        variant: "destructive",
      })
      return
    }

    if (!selectedToken || !amount) {
      toast({
        title: "Invalid input",
        description: "Please select a token and enter an amount to bridge.",
        variant: "destructive",
      })
      return
    }

    // Implement actual bridging logic here
    toast({
      title: "Bridge initiated",
      description: `Bridging ${amount} ${selectedToken.symbol} from ${fromNetwork.name} to ${toNetwork.name}`,
    })
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-[#1E293B] to-[#0F172A] px-4 py-12 md:px-6 lg:py-24">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Stacks Bridge</CardTitle>
          <CardDescription>Transfer assets across networks in the Stacks ecosystem</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[200px]">
                  {fromNetwork.icon}
                  <span className="ml-2">{fromNetwork.name}</span>
                  <ChevronDownIcon className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuLabel>Select Network</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {networks.map((network) => (
                  <DropdownMenuItem key={network.id} onSelect={() => setFromNetwork(network)}>
                    <div className="flex items-center">
                      {network.icon}
                      <span className="ml-2">{network.name}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" onClick={handleNetworkSwap}>
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[200px]">
                  {toNetwork.icon}
                  <span className="ml-2">{toNetwork.name}</span>
                  <ChevronDownIcon className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Select Network</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {networks.map((network) => (
                  <DropdownMenuItem key={network.id} onSelect={() => setToNetwork(network)}>
                    <div className="flex items-center">
                      {network.icon}
                      <span className="ml-2">{network.name}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-2">
            <Label htmlFor="token">Select Token</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {selectedToken ? (
                    <>
                      <img src={selectedToken.imageUrl} alt={selectedToken.name} className="w-6 h-6 mr-2 rounded-full" />
                      <span>{selectedToken.name}</span>
                      <span className="ml-auto">{selectedToken.symbol}</span>
                    </>
                  ) : (
                    <span>Select a token</span>
                  )}
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px]">
                <DropdownMenuLabel>Select Token</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {tokens && tokens.length > 0 ? (
                  tokens.map((token: Token) => (
                    <DropdownMenuItem key={token.symbol} onSelect={() => setSelectedToken(token)}>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                          <img src={token.imageUrl} alt={token.name} className="w-6 h-6 mr-2 rounded-full" />
                          <span>{token.name}</span>
                        </div>
                        <span>{token.symbol}</span>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No tokens available</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="advanced-mode"
              checked={isAdvancedMode}
              onCheckedChange={setIsAdvancedMode}
            />
            <Label htmlFor="advanced-mode">Advanced Mode</Label>
          </div>
          {isAdvancedMode && (
            <div className="space-y-2">
              <Label htmlFor="slippage">Slippage Tolerance: {slippage}%</Label>
              <Slider
                id="slippage"
                min={0.1}
                max={5}
                step={0.1}
                value={[slippage]}
                onValueChange={(value) => setSlippage(value[0])}
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleBridge}>
            Bridge Assets
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function StacksIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  )
}

function BitcoinIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
    </svg>
  )
}