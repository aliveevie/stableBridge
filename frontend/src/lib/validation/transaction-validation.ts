/**
 * Transaction Validation Utilities
 */
import { isValidStacksAddress } from '../utils/address';

export function validateSTXTransfer(amount: string, recipient: string, balance: string) {
  if (!isValidStacksAddress(recipient)) return { valid: false, error: 'Invalid recipient address' };
  if (parseFloat(amount) <= 0) return { valid: false, error: 'Amount must be greater than 0' };
  if (parseFloat(amount) > parseFloat(balance)) return { valid: false, error: 'Insufficient balance' };
  return { valid: true };
}
