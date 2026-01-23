/**
 * Stacks contract configuration helpers
 */

import { parseContractId, validateStacksAddress } from '@stacks/transactions';

export type ContractParts = {
  address: string;
  name: string;
  id: string;
};

export function getContractParts(contractId: string): ContractParts {
  const trimmed = contractId.trim();
  const [address, name] = parseContractId(trimmed as any);

  if (!validateStacksAddress(address)) {
    throw new Error(`Invalid contract address in contract ID: ${trimmed}`);
  }
  if (!name) {
    throw new Error(`Invalid contract name in contract ID: ${trimmed}`);
  }

  return { address, name, id: `${address}.${name}` };
}

export const NFT_MARKET_CONTRACT_ID =
  process.env.NEXT_PUBLIC_NFT_MARKET_CONTRACT_ID ||
  'ST21J9CN7FH2DT1MKN24DX60AXT6XC1P5SS13SYFN.nft-market';

export const DEFAULT_NFT_ASSET_CONTRACT_ID =
  process.env.NEXT_PUBLIC_DEFAULT_NFT_ASSET_CONTRACT_ID || '';

export const DEFAULT_FT_ASSET_CONTRACT_ID =
  process.env.NEXT_PUBLIC_DEFAULT_FT_ASSET_CONTRACT_ID || '';

