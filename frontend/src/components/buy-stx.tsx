"use client"

import React, { useContext, useState } from 'react'
import { UserContext } from './userContext'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

interface Currency {
  code: string
  name: string
  symbol: string
}

const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
]

export function BuySTX() {
  const { userData, tokens } = useContext(UserContext)
  const [stxAmount, setStxAmount] = useState<string>('')
  const [currency, setCurrency] = useState<string>('USD')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const isConnected = !!userData && !!tokens && tokens.length > 0

  const handleConnectWallet = () => {
    // Implement wallet connection logic here
    toast({
      title: "Wallet Connection",
      description: "Please implement wallet connection logic.",
    })
  }

  const handleBuySTX = async () => {
    if (!stxAmount || parseFloat(stxAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid STX amount.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Implement STX purchase logic here
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating API call
      toast({
        title: "Purchase Successful",
        description: `You have successfully purchased ${stxAmount} STX.`,
      })
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "An error occurred while processing your purchase. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Buy STX with Card</CardTitle>
          <CardDescription>Purchase STX tokens using your preferred currency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <Alert>
              <AlertTitle>Wallet not connected</AlertTitle>
              <AlertDescription>
                Please connect your wallet to purchase STX tokens.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="stxAmount">STX Amount</Label>
                <Input
                  type="number"
                  id="stxAmount"
                  placeholder="0.00"
                  value={stxAmount}
                  onChange={(e) => setStxAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.name} ({curr.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          {!isConnected ? (
            <Button className="w-full" onClick={handleConnectWallet}>
              Connect Wallet
            </Button>
          ) : (
            <Button className="w-full" onClick={handleBuySTX} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                `Buy STX with ${currencies.find(c => c.code === currency)?.symbol}`
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default BuySTX