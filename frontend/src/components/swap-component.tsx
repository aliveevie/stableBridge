"use client"

import * as React from "react"
import { ChevronDown, ArrowDown, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UserContext } from "./userContext"

interface Token {
  symbol: string;
  name: string;
  imageUrl: string;
  price: string;
  percent_change_24h: string;
  contractAddress: string;
  socialLinks: {
    website: string;
    twitter: string;
    discord: string;
    telegram: string;
  };
}

export function SwapComponent() {
  const [selectedFromToken, setSelectedFromToken] = React.useState<Token | null>(null)
  const [selectedToToken, setSelectedToToken] = React.useState<Token | null>(null)
  const { userData, tokens } = React.useContext(UserContext)

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <main className="w-full max-w-4xl bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Token Swap</h2>
          <p className="text-gray-400">Exchange assets on Stacks</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-400">From</span>
              <span className={`text-sm font-medium ${userData ? 'text-green-400' : 'text-red-400'}`}>
                {userData ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-gray-800 hover:bg-gray-700 text-white border-gray-700" disabled={!userData}>
                  {selectedFromToken ? (
                    <div className="flex items-center">
                      <img src={selectedFromToken.imageUrl} alt={selectedFromToken.name} className="w-6 h-6 mr-2 rounded-full" />
                      <span>{selectedFromToken.name}</span>
                    </div>
                  ) : (
                    <span>Select a token</span>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[300px] max-h-[300px] overflow-y-auto bg-gray-800 border border-gray-700">
                {tokens && tokens.length > 0 ? (
                  tokens.map((token: Token) => (
                    <DropdownMenuItem
                      key={token.symbol}
                      onSelect={() => setSelectedFromToken(token)}
                      className="flex items-center p-2 hover:bg-gray-700 cursor-pointer"
                    >
                      <img src={token.imageUrl} alt={token.name} className="w-6 h-6 mr-2 rounded-full" />
                      <span>{token.name}</span>
                      <span className="ml-auto text-sm text-gray-400">{token.symbol}</span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No tokens available</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Input
              type="number"
              placeholder="0.0000"
              className="bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500"
              disabled={!userData}
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
                <Button variant="outline" className="w-full justify-between bg-gray-800 hover:bg-gray-700 text-white border-gray-700" disabled={!userData}>
                  {selectedToToken ? (
                    <div className="flex items-center">
                      <img src={selectedToToken.imageUrl} alt={selectedToToken.name} className="w-6 h-6 mr-2 rounded-full" />
                      <span>{selectedToToken.name}</span>
                    </div>
                  ) : (
                    <span>Select a token</span>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[300px] max-h-[300px] overflow-y-auto bg-gray-800 border border-gray-700">
                {tokens && tokens.length > 0 ? (
                  tokens.map((token: Token) => (
                    <DropdownMenuItem
                      key={token.symbol}
                      onSelect={() => setSelectedToToken(token)}
                      className="flex items-center p-2 hover:bg-gray-700 cursor-pointer"
                    >
                      <img src={token.imageUrl} alt={token.name} className="w-6 h-6 mr-2 rounded-full" />
                      <span>{token.name}</span>
                      <span className="ml-auto text-sm text-gray-400">{token.symbol}</span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No tokens available</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Input
              type="number"
              placeholder="0.0000"
              className="bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500"
              disabled={!userData}
            />

            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-200"
              disabled={!userData}
            >
              {!userData
                ? 'Connect Wallet to Swap'
                : selectedFromToken && selectedToToken
                  ? `Swap ${selectedFromToken.symbol} to ${selectedToToken.symbol}`
                  : 'Select tokens to swap'}
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Token Information</h3>
            {selectedFromToken && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-lg font-medium mb-2">{selectedFromToken.name} ({selectedFromToken.symbol})</h4>
                <p>Price: ${parseFloat(selectedFromToken.price).toFixed(6)}</p>
                <p>24h Change: {parseFloat(selectedFromToken.percent_change_24h).toFixed(2)}%</p>
                <p className="text-sm text-gray-400 break-all">Contract: {selectedFromToken.contractAddress}</p>
                <div className="flex space-x-2 mt-2">
                  {Object.entries(selectedFromToken.socialLinks).map(([key, value]) => (
                    value && (
                      <a key={key} href={value} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Available Tokens</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>24h Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens && tokens.length > 0 ? (
                  tokens.map((token: Token) => (
                    <TableRow key={token.symbol}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <img src={token.imageUrl} alt={token.name} className="w-6 h-6 mr-2 rounded-full" />
                          {token.name}
                        </div>
                      </TableCell>
                      <TableCell>{token.symbol}</TableCell>
                      <TableCell>${parseFloat(token.price).toFixed(6)}</TableCell>
                      <TableCell className={parseFloat(token.percent_change_24h) >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {parseFloat(token.percent_change_24h).toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No tokens available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  )
}
// Connected to WalletConnect
