"use client"

import React, { useState, useEffect } from 'react'
import { SwapType, VelarSDK, getTokens, ISwapService, SwapResponse, AmountOutResponse } from '@velarprotocol/velar-sdk'
import { openContractCall } from '@stacks/connect'
import { AnchorMode } from '@stacks/transactions'

const SwapResult = () => {
  const [inToken, setInToken] = useState('')
  const [outToken, setOutToken] = useState('')
  const [amount, setAmount] = useState(10)
  const [amountOut, setAmountOut] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeTokens = async () => {
      try {
        const { VELAR, STX } = await getTokens()
        setInToken(VELAR)
        setOutToken(STX)
      } catch (err) {
        setError('Failed to initialize tokens')
        console.error(err)
      }
    }

    initializeTokens()
  }, [])

  const handleSwap = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const sdk = new VelarSDK()
      const account = '' // You should replace this with the actual account

      const swapInstance: ISwapService = await sdk.getSwapInstance({
        account: account,
        inToken: inToken,
        outToken: outToken,
      })

      const amountOutResponse: AmountOutResponse = await swapInstance.getComputedAmount({
        type: SwapType.ONE,
        amount: amount,
      })

      setAmountOut(amountOutResponse.amount)

      const swapOptions: SwapResponse = await swapInstance.swap({
        amount: amount,
        type: SwapType.ONE,
      })

      const options = {
        ...swapOptions,
        network: 'mainnet', // Replace with actual network
        appDetails: {
          name: 'My Swap App',
          icon: 'https://example.com/icon.png',
        },
        anchorMode: AnchorMode.Any,
        onFinish: (data: any) => {
          console.log('Swap finished', data)
        },
        onCancel: (ex: any) => {
          console.log('Swap cancelled', ex)
        },
      }

      await openContractCall(options)
    } catch (err) {
      setError('Failed to perform swap')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Velar Swap</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">From:</span>
            <span>{inToken || 'Loading...'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">To:</span>
            <span>{outToken || 'Loading...'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Amount:</span>
            <span>{amount}</span>
          </div>
          {amountOut !== null && (
            <div className="flex justify-between">
              <span className="font-medium">You will receive:</span>
              <span>{amountOut}</span>
            </div>
          )}
          <button
            onClick={handleSwap}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Swap'}
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default SwapResult