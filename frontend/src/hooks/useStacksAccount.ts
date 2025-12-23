/**
 * Custom hook for Stacks account operations
 * 
 * Provides utilities for fetching and managing Stacks account data
 */

'use client';

import { useState, useEffect } from 'react';
import { useWalletConnect } from './useWalletConnect';
import { NETWORK_CONFIG } from '@/lib/walletconnect/config';
import { StacksAccountInfo, TokenInfo } from '@/types/stacks';

export function useStacksAccount() {
    const { address, isConnected } = useWalletConnect();
    const [accountInfo, setAccountInfo] = useState<StacksAccountInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isConnected && address) {
            fetchAccountInfo();
        } else {
            setAccountInfo(null);
        }
    }, [address, isConnected]);

    const fetchAccountInfo = async () => {
        if (!address) return;

        setIsLoading(true);
        setError(null);

        try {
            // Fetch account balances
            const balanceResponse = await fetch(
                `${NETWORK_CONFIG.apiUrl}/extended/v1/address/${address}/balances`
            );
            const balanceData = await balanceResponse.json();

            // Fetch account transactions for nonce
            const txResponse = await fetch(
                `${NETWORK_CONFIG.apiUrl}/extended/v1/address/${address}/transactions?limit=1`
            );
            const txData = await txResponse.json();

            // Parse token balances
            const tokens: TokenInfo[] = Object.entries(balanceData.fungible_tokens || {}).map(
                ([key, value]: [string, any]) => {
                    const [contractAddress, contractName, symbol] = key.split('::');
                    return {
                        contractAddress,
                        contractName: contractName || '',
                        symbol: symbol || key,
                        decimals: value.decimals || 6,
                        balance: value.balance || '0',
                    };
                }
            );

            setAccountInfo({
                address,
                balance: (parseInt(balanceData.stx.balance) / 1000000).toString(),
                nonce: balanceData.nonce || 0,
                tokens,
            });
        } catch (err: any) {
            setError(err.message || 'Failed to fetch account info');
            console.error('Error fetching account info:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshAccount = () => {
        fetchAccountInfo();
    };

    return {
        accountInfo,
        isLoading,
        error,
        refreshAccount,
        stxBalance: accountInfo?.balance || '0',
        tokens: accountInfo?.tokens || [],
        nonce: accountInfo?.nonce || 0,
    };
}
