/**
 * Wallet Error Handling Utilities
 * 
 * Provides custom error classes and formatting for wallet-related errors
 */

export enum WalletErrorCode {
    CONNECTION_REJECTED = 'CONNECTION_REJECTED',
    TRANSACTION_REJECTED = 'TRANSACTION_REJECTED',
    INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
    NETWORK_MISMATCH = 'NETWORK_MISMATCH',
    UNAUTHORIZED = 'UNAUTHORIZED',
    TIMEOUT = 'TIMEOUT',
    UNKNOWN = 'UNKNOWN',
}

export class WalletError extends Error {
    code: WalletErrorCode;
    details?: any;

    constructor(message: string, code: WalletErrorCode = WalletErrorCode.UNKNOWN, details?: any) {
        super(message);
        this.name = 'WalletError';
        this.code = code;
        this.details = details;
    }
}

/**
 * Format wallet errors into user-friendly messages
 */
export function formatWalletError(error: any): string {
    if (error instanceof WalletError) {
        return error.message;
    }

    // Handle common Stacks/WalletConnect error patterns
    const errorMessage = error.message || error.toString();

    if (errorMessage.includes('User rejected') || errorMessage.includes('User denied')) {
        return 'The request was rejected in your wallet.';
    }

    if (errorMessage.includes('insufficient funds') || errorMessage.includes('Insufficient balance')) {
        return 'You do not have enough STX to complete this transaction.';
    }

    if (errorMessage.includes('Network mismatch')) {
        return 'Your wallet is connected to the wrong network.';
    }

    if (errorMessage.includes('expired')) {
        return 'The connection request has expired. Please try again.';
    }

    return 'An unexpected error occurred with your wallet. Please try again.';
}

/**
 * Handle connection errors
 */
export function handleConnectionError(error: any): WalletError {
    console.error('Wallet connection error:', error);

    if (error.message?.includes('User rejected')) {
        return new WalletError('Connection rejected by user', WalletErrorCode.CONNECTION_REJECTED);
    }

    return new WalletError(formatWalletError(error), WalletErrorCode.UNKNOWN, error);
}

/**
 * Handle transaction errors
 */
export function handleTransactionError(error: any): WalletError {
    console.error('Wallet transaction error:', error);

    if (error.message?.includes('User rejected')) {
        return new WalletError('Transaction rejected by user', WalletErrorCode.TRANSACTION_REJECTED);
    }

    return new WalletError(formatWalletError(error), WalletErrorCode.UNKNOWN, error);
}
