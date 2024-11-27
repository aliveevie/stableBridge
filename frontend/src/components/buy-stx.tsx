"use client"

import React, { useContext, useEffect, useState } from 'react'
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

interface Currency {
  code: string
  name: string
  symbol: string
  rate?: number
}

interface Crypto {
  id: string
  symbol: string
  name: string
  image?: string
}

export function BuySTX() {
  const { userData, tokens } = useContext(UserContext)
  const [cryptos, setCryptos] = useState<Crypto[]>([])
  const [selectedCrypto, setSelectedCrypto] = useState<string>('')
  const [cryptoAmount, setCryptoAmount] = useState<string>('')
  const [currency, setCurrency] = useState<string>('USD')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [convertedAmount, setConvertedAmount] = useState<string>('')

  const isConnected = !!userData && !!tokens && tokens.length > 0

  // Fetch currencies and exchange rates
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        // Fetch all countries and their currencies
        const countriesResponse = await fetch('https://restcountries.com/v3.1/all')
        const countriesData = await countriesResponse.json()
        
        // Get unique currencies
        const uniqueCurrencies = new Map()
        countriesData.forEach((country: any) => {
          if (country.currencies) {
            Object.entries(country.currencies).forEach(([code, details]: [string, any]) => {
              if (!uniqueCurrencies.has(code)) {
                uniqueCurrencies.set(code, {
                  code,
                  name: details.name,
                  symbol: details.symbol || code
                })
              }
            })
          }
        })

        // Fetch exchange rates
        const ratesResponse = await fetch('https://open.er-api.com/v6/latest/USD')
        const ratesData = await ratesResponse.json()

        // Combine currency info with rates
        const currenciesWithRates = Array.from(uniqueCurrencies.values()).map((curr: Currency) => ({
          ...curr,
          rate: ratesData.rates[curr.code] || null
        })).filter(curr => curr.rate !== null)

        setCurrencies(currenciesWithRates)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch currency data",
          variant: "destructive",
        })
      }
    }

    fetchCurrencies()
  }, [])

  // Add new useEffect to fetch cryptos
  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1'
        )
        const data = await response.json()
        const formattedCryptos = data.map((crypto: any) => ({
          id: crypto.id,
          symbol: crypto.symbol.toUpperCase(),
          name: crypto.name,
          image: crypto.image
        }))
        setCryptos(formattedCryptos)
        setSelectedCrypto(formattedCryptos[0]?.id || '') // Set default crypto
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch cryptocurrencies",
          variant: "destructive",
        })
      }
    }

    fetchCryptos()
  }, [])

  // Update converted amount when crypto amount or currency changes
  useEffect(() => {
    if (cryptoAmount && currency && selectedCrypto) {
      const selectedCurrency = currencies.find(c => c.code === currency)
      if (selectedCurrency && selectedCurrency.rate) {
        const fetchCryptoPrice = async () => {
          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCrypto}&vs_currencies=usd`
          )
          const data = await response.json()
          const cryptoPriceInUSD = data[selectedCrypto]?.usd || 0
          const cryptoInUSD = parseFloat(cryptoAmount) * cryptoPriceInUSD
          const converted = cryptoInUSD * (selectedCurrency?.rate || 0)
          setConvertedAmount(converted.toFixed(2))
        }

        fetchCryptoPrice().catch(() => setConvertedAmount(''))
      }
    } else {
      setConvertedAmount('')
    }
  }, [cryptoAmount, currency, selectedCrypto, currencies])

  const handleConnectWallet = () => {
    // Implement wallet connection logic here
    toast({
      title: "Wallet Connection",
      description: "Please implement wallet connection logic.",
    })
  }

  const handleBuySTX = async () => {
    if (!cryptoAmount || parseFloat(cryptoAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Implement purchase logic here
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating API call
      toast({
        title: "Purchase Successful",
        description: `You have successfully purchased ${cryptoAmount} ${cryptos.find(c => c.id === selectedCrypto)?.symbol}.`,
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
          <CardTitle className="text-2xl font-bold">Buy Crypto with Card</CardTitle>
          <CardDescription>Purchase cryptocurrency using your preferred currency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <Alert>
              <AlertTitle>Wallet not connected</AlertTitle>
              <AlertDescription>
                Please connect your wallet to purchase crypto.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="crypto">Select Cryptocurrency</Label>
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger id="crypto">
                    <SelectValue placeholder="Select cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptos.map((crypto) => (
                      <SelectItem key={crypto.id} value={crypto.id}>
                        {crypto.name} ({crypto.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cryptoAmount">Amount</Label>
                <Input
                  type="number"
                  id="cryptoAmount"
                  placeholder="0.00"
                  value={cryptoAmount}
                  onChange={(e) => setCryptoAmount(e.target.value)}
                />
                {convertedAmount && (
                  <p className="text-sm text-gray-500">
                    ≈ {currencies.find(c => c.code === currency)?.symbol}{convertedAmount} {currency}
                  </p>
                )}
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
                `Buy ${cryptos.find(c => c.id === selectedCrypto)?.symbol} with ${currencies.find(c => c.code === currency)?.symbol}`
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default BuySTX