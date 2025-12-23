/**
 * Network Selector Component
 * 
 * Allows switching between mainnet and testnet
 */

'use client';

import React from 'react';
import { useWalletConnect } from '@/hooks/useWalletConnect';
import { Globe } from 'lucide-react';

export function NetworkSelector() {
    const { network, isConnected } = useWalletConnect();

    if (!isConnected) return null;

    return (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300 capitalize">{network}</span>
            <div className={`
        w-2 h-2 rounded-full
        ${network === 'mainnet' ? 'bg-green-400' : 'bg-yellow-400'}
      `} />
        </div>
    );
}
