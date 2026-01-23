/**
 * Stacks Transaction Utilities
 * 
 * Provides functions for creating and signing Stacks transactions
 */

import { StacksTransactionPayload, TransactionOptions } from '@/types/stacks';
import { NETWORK_CONFIG } from '@/lib/walletconnect/config';
import { openContractCall, openSTXTransfer } from '@stacks/connect';

/**
 * Transfer STX tokens
 */
export async function transferSTX(
    recipient: string,
    amount: string,
    memo?: string,
    options?: TransactionOptions
) {
    return new Promise((resolve, reject) => {
        openSTXTransfer({
            recipient,
            amount: (parseFloat(amount) * 1000000).toString(), // Convert to microSTX
            memo: memo || '',
            network: NETWORK_CONFIG.network,
            onFinish: (data) => {
                resolve(data);
            },
            onCancel: () => {
                reject(new Error('Transaction cancelled by user'));
            },
        });
    });
}

/**
 * Call a smart contract function
 */
export async function callContract(
    contractAddress: string,
    contractName: string,
    functionName: string,
    functionArgs: any[],
    options?: TransactionOptions
) {
    return new Promise((resolve, reject) => {
        openContractCall({
            contractAddress,
            contractName,
            functionName,
            functionArgs,
            network: NETWORK_CONFIG.network,
            postConditions: options?.postConditions || [],
            onFinish: (data) => {
                resolve(data);
            },
            onCancel: () => {
                reject(new Error('Transaction cancelled by user'));
            },
        });
    });
}

/**
 * Get transaction status
 */
export async function getTransactionStatus(txId: string) {
    try {
        const response = await fetch(
            `${NETWORK_CONFIG.apiUrl}/extended/v1/tx/${txId}`
        );
        const data = await response.json();

        return {
            txId,
            status: data.tx_status === 'success' ? 'success' :
                data.tx_status === 'pending' ? 'pending' : 'failed',
            blockHeight: data.block_height,
            timestamp: data.burn_block_time,
            error: data.tx_status === 'abort_by_response' ? 'Transaction failed' : undefined,
        };
    } catch (error) {
        throw new Error('Failed to fetch transaction status');
    }
}

/**
 * Estimate transaction fee
 */
export async function estimateFee(payload: StacksTransactionPayload): Promise<string> {
    try {
        const response = await fetch(`${NETWORK_CONFIG.apiUrl}/v2/fees/transaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                transaction_payload: payload,
            }),
        });

        const data = await response.json();
        return (data.estimated_cost / 1000000).toString(); // Convert to STX
    } catch (error) {
        return '0.001'; // Default fee
    }
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
    txId: string,
    maxAttempts: number = 30,
    interval: number = 2000
): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
        const status = await getTransactionStatus(txId);

        if (status.status === 'success') {
            return status;
        }

        if (status.status === 'failed') {
            throw new Error(status.error || 'Transaction failed');
        }

        await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error('Transaction confirmation timeout');
}
