"use client"

import * as React from "react"
import { ChevronDown, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface Token {
  symbol: string;
  name: string;
  image_uri: string;
}

export function SwapComponent() {
  const [tokens, setTokens] = React.useState<Token[]>([])
  const [selectedFromToken, setSelectedFromToken] = React.useState<Token | null>(null)
  const [selectedToToken, setSelectedToToken] = React.useState<Token | null>(null)

  React.useEffect(() => {
    // Fetch tokens from API
    fetch("https://api.hiro.so/metadata/v1/ft?address=SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9&offset=0&limit=20&order_by=name&order=asc")
      .then(response => response.json())
      .then(data => setTokens(data.results))
      .catch(error => console.error('Error fetching tokens:', error))
  }, [])

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <main className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Swap</h2>
          <p className="text-gray-400">Exchange assets on Stacks.</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-400">From</span>
            <span className="text-sm font-medium text-green-400">Connected</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-gray-800 hover:bg-gray-700 text-white border-gray-700">
                {selectedFromToken ? (
                  <div className="flex items-center">
                    <img src={selectedFromToken.image_uri} alt={selectedFromToken.name} className="w-6 h-6 mr-2 rounded-full" />
                    <span>{selectedFromToken.name}</span>
                  </div>
                ) : (
                  <span>Select a token</span>
                )}
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full max-h-[300px] overflow-y-auto bg-gray-800 border border-gray-700">
              {tokens.map((token) => (
                <DropdownMenuItem
                  key={token.symbol}
                  onSelect={() => setSelectedFromToken(token)}
                  className="flex items-center p-2 hover:bg-gray-700 cursor-pointer"
                >
                  <img src={token.image_uri} alt={token.name} className="w-6 h-6 mr-2 rounded-full" />
                  <span>{token.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            type="number"
            placeholder="0.0000"
            className="bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-center">
            <div className="bg-gray-700 p-2 rounded-full">
              <ArrowDown className="h-6 w-6 text-gray-400" />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-400">To</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-gray-800 hover:bg-gray-700 text-white border-gray-700">
                {selectedToToken ? (
                  <div className="flex items-center">
                    <img src={selectedToToken.image_uri} alt={selectedToToken.name} className="w-6 h-6 mr-2 rounded-full" />
                    <span>{selectedToToken.name}</span>
                  </div>
                ) : (
                  <span>Select a token</span>
                )}
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full max-h-[300px] overflow-y-auto bg-gray-800 border border-gray-700">
              {tokens.map((token) => (
                <DropdownMenuItem
                  key={token.symbol}
                  onSelect={() => setSelectedToToken(token)}
                  className="flex items-center p-2 hover:bg-gray-700 cursor-pointer"
                >
                  <img src={token.image_uri} alt={token.name} className="w-6 h-6 mr-2 rounded-full" />
                  <span>{token.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            type="number"
            placeholder="0.0000"
            className="bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500"
          />

          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-200">
            {selectedFromToken && selectedToToken
              ? `Swap ${selectedFromToken.symbol} to ${selectedToToken.symbol}`
              : 'Select tokens to swap'}
          </Button>
        </div>
      </main>
    </div>
  )
}