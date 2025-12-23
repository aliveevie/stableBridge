/**
 * Custom hook for WalletConnect operations
 * 
 * Provides easy access to wallet connection state and operations
 */

'use client';

import { useWalletContext } from '@/contexts/WalletConnectContext';

export function useWalletConnect() {
    const context = useWalletContext();

    return {
        // Connection state
        isConnected: context.connectionState.isConnected,
        isConnecting: context.connectionState.isConnecting,
        address: context.connectionState.address,
        publicKey: context.connectionState.publicKey,
        network: context.connectionState.network,

        // Account info
        account: context.account,
        balance: context.account?.balance || '0',

        // Operations
        connect: context.connect,
        disconnect: context.disconnect,

        // Status
        isLoading: context.isLoading,
        error: context.error,
    };
}
