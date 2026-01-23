/**
 * Stacks-specific type definitions
 */

export interface StacksTransactionPayload {
    txType: 'contract_call' | 'token_transfer' | 'smart_contract';
    contractAddress?: string;
    contractName?: string;
    functionName?: string;
    functionArgs?: any[];
    amount?: string;
    recipient?: string;
    memo?: string;
}

export interface TransactionOptions {
    fee?: string;
    nonce?: number;
    postConditions?: any[];
    sponsored?: boolean;
}

export interface TransactionStatus {
    txId: string;
    status: 'pending' | 'success' | 'failed';
    blockHeight?: number;
    timestamp?: number;
    error?: string;
}

export interface TokenInfo {
    contractAddress: string;
    contractName: string;
    symbol: string;
    decimals: number;
    balance: string;
}

export interface StacksAccountInfo {
    address: string;
    balance: string;
    nonce: number;
    tokens: TokenInfo[];
}

export interface ContractCallParams {
    contractAddress: string;
    contractName: string;
    functionName: string;
    functionArgs: any[];
    postConditions?: any[];
}
