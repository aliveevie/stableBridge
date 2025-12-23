/**
 * Wallet Balance Display Component
 * 
 * Compact balance display for header or sidebar
 */

'use client';

import React from 'react';
import { useWalletConnect } from '@/hooks/useWalletConnect';
import { formatSTX, formatCompactNumber } from '@/lib/utils/formatting';
import { Coins } from 'lucide-react';

export function WalletBalance() {
    const { isConnected, balance } = useWalletConnect();

    if (!isConnected) return null;

    const balanceNum = parseFloat(balance);

    return (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl backdrop-blur-sm">
            <Coins className="w-4 h-4 text-purple-400" />
            <div className="flex flex-col">
                <span className="text-xs text-gray-400">Balance</span>
                <span className="text-sm font-semibold text-white">
                    {balanceNum > 1000 ? formatCompactNumber(balanceNum) : formatSTX(balance, 2)} STX
                </span>
            </div>
        </div>
    );
}
