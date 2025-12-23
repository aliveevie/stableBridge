/**
 * Transaction Status Component
 * 
 * Displays transaction status with loading, success, and error states
 */

'use client';

import React from 'react';
import { TransactionStatus as TxStatus } from '@/types/stacks';
import { formatRelativeTime } from '@/lib/utils/formatting';
import { Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface TransactionStatusProps {
    status: TxStatus;
    network?: 'mainnet' | 'testnet';
}

export function TransactionStatus({ status, network = 'mainnet' }: TransactionStatusProps) {
    const explorerUrl = network === 'mainnet'
        ? `https://explorer.hiro.so/txid/${status.txId}`
        : `https://explorer.hiro.so/txid/${status.txId}?chain=testnet`;

    return (
        <div className={`
      p-4 rounded-xl border
      ${status.status === 'success' ? 'bg-green-500/10 border-green-500/30' : ''}
      ${status.status === 'pending' ? 'bg-blue-500/10 border-blue-500/30' : ''}
      ${status.status === 'failed' ? 'bg-red-500/10 border-red-500/30' : ''}
    `}>
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                    {status.status === 'pending' && (
                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    )}
                    {status.status === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                    {status.status === 'failed' && (
                        <XCircle className="w-5 h-5 text-red-400" />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className={`
              font-semibold
              ${status.status === 'success' ? 'text-green-400' : ''}
              ${status.status === 'pending' ? 'text-blue-400' : ''}
              ${status.status === 'failed' ? 'text-red-400' : ''}
            `}>
                            {status.status === 'pending' && 'Transaction Pending'}
                            {status.status === 'success' && 'Transaction Confirmed'}
                            {status.status === 'failed' && 'Transaction Failed'}
                        </h4>
                    </div>

                    <p className="text-sm text-gray-400 mb-2">
                        {status.status === 'pending' && 'Your transaction is being processed...'}
                        {status.status === 'success' && 'Your transaction was successful!'}
                        {status.status === 'failed' && (status.error || 'Transaction failed to process')}
                    </p>

                    {/* Transaction ID */}
                    <div className="flex items-center gap-2">
                        <code className="text-xs text-gray-500 truncate">
                            {status.txId.slice(0, 8)}...{status.txId.slice(-8)}
                        </code>
                        <a
                            href={explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                            View <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>

                    {/* Timestamp */}
                    {status.timestamp && (
                        <p className="text-xs text-gray-500 mt-1">
                            {formatRelativeTime(status.timestamp)}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
