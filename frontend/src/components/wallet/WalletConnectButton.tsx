/**
 * WalletConnect Button Component
 * 
 * Primary button for connecting/disconnecting wallet
 */

'use client';

import React, { useState } from 'react';
import { useWalletConnect } from '@/hooks/useWalletConnect';
import { truncateAddress } from '@/lib/utils/address';
import { Wallet, LogOut, Loader2 } from 'lucide-react';

export function WalletConnectButton() {
    const { isConnected, isConnecting, address, connect, disconnect, isLoading } = useWalletConnect();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleClick = () => {
        if (isConnected) {
            setShowDropdown(!showDropdown);
        } else {
            connect();
        }
    };

    const handleDisconnect = () => {
        disconnect();
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            <button
                onClick={handleClick}
                disabled={isConnecting || isLoading}
                className={`
          flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
          transition-all duration-300 transform hover:scale-105
          ${isConnected
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                    }
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          hover:shadow-xl
        `}
            >
                {(isConnecting || isLoading) ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Connecting...</span>
                    </>
                ) : isConnected ? (
                    <>
                        <Wallet className="w-5 h-5" />
                        <span>{truncateAddress(address || '')}</span>
                    </>
                ) : (
                    <>
                        <Wallet className="w-5 h-5" />
                        <span>Connect Wallet</span>
                    </>
                )}
            </button>

            {/* Dropdown menu */}
            {showDropdown && isConnected && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
                    <button
                        onClick={handleDisconnect}
                        className="w-full flex items-center gap-2 px-4 py-3 text-left text-white hover:bg-gray-800 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Disconnect</span>
                    </button>
                </div>
            )}

            {/* Click outside to close dropdown */}
            {showDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </div>
    );
}
