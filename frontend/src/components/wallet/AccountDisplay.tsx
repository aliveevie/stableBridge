/**
 * Account Display Component
 * 
 * Shows detailed account information including balance and address
 */

'use client';

import React, { useState } from 'react';
import { useWalletConnect } from '@/hooks/useWalletConnect';
import { useStacksAccount } from '@/hooks/useStacksAccount';
import { truncateAddress, copyToClipboard } from '@/lib/utils/address';
import { formatSTX } from '@/lib/utils/formatting';
import { Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';

export function AccountDisplay() {
    const { address, network } = useWalletConnect();
    const { stxBalance, tokens, refreshAccount, isLoading } = useStacksAccount();
    const [copied, setCopied] = useState(false);

    if (!address) return null;

    const handleCopy = async () => {
        const success = await copyToClipboard(address);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const explorerUrl = network === 'mainnet'
        ? `https://explorer.hiro.so/address/${address}`
        : `https://explorer.hiro.so/address/${address}?chain=testnet`;

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Account</h3>
                <button
                    onClick={refreshAccount}
                    disabled={isLoading}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    title="Refresh balance"
                >
                    <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Balance */}
            <div className="mb-4">
                <p className="text-sm text-gray-400 mb-1">STX Balance</p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    {formatSTX(stxBalance)} STX
                </p>
            </div>

            {/* Address */}
            <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Address</p>
                <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm text-white bg-gray-800 px-3 py-2 rounded-lg">
                        {truncateAddress(address, 8, 8)}
                    </code>
                    <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Copy address"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-400" />
                        ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                        )}
                    </button>
                    <a
                        href={explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        title="View in explorer"
                    >
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                </div>
            </div>

            {/* Network Badge */}
            <div className="flex items-center gap-2">
                <div className={`
          px-3 py-1 rounded-full text-xs font-medium
          ${network === 'mainnet'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }
        `}>
                    {network === 'mainnet' ? '● Mainnet' : '● Testnet'}
                </div>
            </div>

            {/* Tokens */}
            {tokens.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">Tokens</p>
                    <div className="space-y-2">
                        {tokens.slice(0, 3).map((token, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-gray-300">{token.symbol}</span>
                                <span className="text-white font-medium">
                                    {formatSTX(token.balance, token.decimals)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
