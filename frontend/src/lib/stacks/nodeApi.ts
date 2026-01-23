/**
 * Stacks node API configuration.
 *
 * Note: The Hiro API (api.*.hiro.so) is great for indexer endpoints, but
 * contract `call-read` lives on the Stacks node API (/v2/...).
 */

export const STACKS_NODE_API_URL =
  process.env.NEXT_PUBLIC_STACKS_NODE_API_URL ||
  (process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet'
    ? 'https://stacks-node-api.mainnet.stacks.co'
    : 'https://stacks-node-api.testnet.stacks.co');

export const READ_ONLY_SENDER_ADDRESS =
  process.env.NEXT_PUBLIC_READ_ONLY_SENDER_ADDRESS ||
  'ST000000000000000000002AMW42H';

