/**
 * WalletConnect Context Provider
 * 
 * Manages wallet connection state and provides wallet operations
 * to the entire application through React Context.
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { WalletConnectionState, WalletAccount } from '@/types/wallet';
import { NETWORK_CONFIG, APP_METADATA } from '@/lib/walletconnect/config';

interface WalletContextType {
    connectionState: WalletConnectionState;
    account: WalletAccount | null;
    connect: () => Promise<void>;
    disconnect: () => void;
    isLoading: boolean;
    error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export function WalletConnectProvider({ children }: { children: React.ReactNode }) {
    const [connectionState, setConnectionState] = useState<WalletConnectionState>({
        isConnected: false,
        isConnecting: false,
        address: null,
        publicKey: null,
        network: NETWORK_CONFIG.name.includes('Mainnet') ? 'mainnet' : 'testnet',
    });

    const [account, setAccount] = useState<WalletAccount | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if user is already authenticated
    useEffect(() => {
        if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData();
            const address = userData.profile.stxAddress[NETWORK_CONFIG.name.includes('Mainnet') ? 'mainnet' : 'testnet'];

            setConnectionState({
                isConnected: true,
                isConnecting: false,
                address,
                publicKey: userData.profile.publicKey || null,
                network: NETWORK_CONFIG.name.includes('Mainnet') ? 'mainnet' : 'testnet',
            });

            // Fetch account details
            fetchAccountDetails(address);
        }
    }, []);

    const fetchAccountDetails = async (address: string) => {
        try {
            const response = await fetch(`${NETWORK_CONFIG.apiUrl}/extended/v1/address/${address}/balances`);
            const data = await response.json();

            setAccount({
                address,
                publicKey: connectionState.publicKey || '',
                balance: (parseInt(data.stx.balance) / 1000000).toString(),
                nonce: data.nonce || 0,
            });
        } catch (err) {
            console.error('Failed to fetch account details:', err);
        }
    };

    const connect = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            setConnectionState(prev => ({ ...prev, isConnecting: true }));

            showConnect({
                appDetails: {
                    name: APP_METADATA.name,
                    icon: APP_METADATA.icons[0],
                },
                redirectTo: '/',
                onFinish: () => {
                    const userData = userSession.loadUserData();
                    const address = userData.profile.stxAddress[NETWORK_CONFIG.name.includes('Mainnet') ? 'mainnet' : 'testnet'];

                    setConnectionState({
                        isConnected: true,
                        isConnecting: false,
                        address,
                        publicKey: userData.profile.publicKey || null,
                        network: NETWORK_CONFIG.name.includes('Mainnet') ? 'mainnet' : 'testnet',
                    });

                    fetchAccountDetails(address);
                    setIsLoading(false);
                },
                onCancel: () => {
                    setConnectionState(prev => ({ ...prev, isConnecting: false }));
                    setIsLoading(false);
                    setError('Connection cancelled by user');
                },
                userSession,
            });
        } catch (err: any) {
            setError(err.message || 'Failed to connect wallet');
            setConnectionState(prev => ({ ...prev, isConnecting: false }));
            setIsLoading(false);
        }
    }, []);

    const disconnect = useCallback(() => {
        userSession.signUserOut();
        setConnectionState({
            isConnected: false,
            isConnecting: false,
            address: null,
            publicKey: null,
            network: NETWORK_CONFIG.name.includes('Mainnet') ? 'mainnet' : 'testnet',
        });
        setAccount(null);
        setError(null);
    }, []);

    const value: WalletContextType = {
        connectionState,
        account,
        connect,
        disconnect,
        isLoading,
        error,
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWalletContext() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWalletContext must be used within a WalletConnectProvider');
    }
    return context;
}
