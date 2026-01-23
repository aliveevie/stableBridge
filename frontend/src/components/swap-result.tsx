"use client"

import React, { useState } from 'react'
import { SwapType, VelarSDK, Tokens, ISwapService, SwapResponse, AmountOutResponse } from '@velarprotocol/velar-sdk'
import { openContractCall } from '@stacks/connect'
import { AnchorMode } from '@stacks/transactions'
import { NETWORK_CONFIG, APP_METADATA } from '@/lib/walletconnect/config'
import { useWalletConnect } from '@/hooks/useWalletConnect'

const SwapResult = () => {
  const { isConnected, address, connect } = useWalletConnect()
  const [inToken, setInToken] = useState(Tokens.VELAR)
  const [outToken, setOutToken] = useState(Tokens.STX)
  const [amount, setAmount] = useState(10)
  const [amountOut, setAmountOut] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSwap = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!isConnected || !address) {
        setError('Connect your wallet to swap.')
        await connect()
        return
      }

      const sdk = new VelarSDK()
      const account = address

      const swapInstance: ISwapService = await sdk.getSwapInstance({
        account: account,
        inToken: inToken,
        outToken: outToken,
      })

      const amountOutResponse: AmountOutResponse = await swapInstance.getComputedAmount({
        type: SwapType.ONE,
        amount: amount,
      })

      setAmountOut(Number(amountOutResponse.value))

      const swapOptions: SwapResponse = await swapInstance.swap({
        amount: amount,
        type: SwapType.ONE,
      })

      const options = {
        ...swapOptions,
        network: NETWORK_CONFIG.network,
        appDetails: {
          name: APP_METADATA.name,
          icon: APP_METADATA.icons[0],
        },
        anchorMode: AnchorMode.Any,
        onFinish: (data: any) => {
          console.log('Swap finished', data)
        },
        onCancel: (ex: any) => {
          console.log('Swap cancelled', ex)
        },
      }

      await openContractCall(options as any)
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
