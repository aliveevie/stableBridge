/**
 * Type definitions for WalletConnect integration
 */

export interface WalletInfo {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface WalletConnectionState {
    isConnected: boolean;
    isConnecting: boolean;
    address: string | null;
    publicKey: string | null;
    network: 'mainnet' | 'testnet';
}

export interface WalletAccount {
    address: string;
    publicKey: string;
    balance: string;
    nonce: number;
}

export interface WalletError {
    code: string;
    message: string;
    details?: any;
}

export type WalletEventType =
    | 'connect'
    | 'disconnect'
    | 'accountsChanged'
    | 'networkChanged'
    | 'error';

export interface WalletEvent {
    type: WalletEventType;
    payload?: any;
}
