/**
 * Hook for Stacks transactions
 */
'use client';
import { useState } from 'react';
import { transferSTX, callContract } from '@/lib/stacks/transactions';

export function useStacksTransaction() {
  const [isPending, setIsPending] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);

  const sendSTX = async (recipient: string, amount: string) => {
    setIsPending(true);
    try {
      const result: any = await transferSTX(recipient, amount);
      setTxId(result.txId);
      return result;
    } finally {
      setIsPending(false);
    }
  };

  return { sendSTX, isPending, txId };
}
