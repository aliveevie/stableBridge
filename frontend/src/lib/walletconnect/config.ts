/**
 * WalletConnect Configuration for Stacks Blockchain
 * 
 * This file configures the Reown AppKit (WalletConnect) for use with Stacks blockchain.
 * It defines the project metadata, network settings, and wallet options.
 */

import { StacksMainnet, StacksTestnet } from '@stacks/network';

// Get environment variables
export const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';
export const STACKS_NETWORK = process.env.NEXT_PUBLIC_STACKS_NETWORK || 'mainnet';
export const STACKS_API_URL = process.env.NEXT_PUBLIC_STACKS_API_URL || 'https://api.mainnet.hiro.so';

// Application metadata for wallet display
export const APP_METADATA = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'StableBridge',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Seamless cross-chain asset transfers',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://stablebridge.app',
  icons: [process.env.NEXT_PUBLIC_APP_ICON || 'https://stablebridge.app/icon.png'],
};

// Network configuration
export const getStacksNetwork = () => {
  return STACKS_NETWORK === 'mainnet' 
    ? new StacksMainnet({ url: STACKS_API_URL })
    : new StacksTestnet();
};

// Supported Stacks wallets
export const SUPPORTED_WALLETS = [
  {
    id: 'leather',
    name: 'Leather Wallet',
    description: 'The most popular Stacks wallet',
    icon: '/wallets/leather.svg',
  },
  {
    id: 'xverse',
    name: 'Xverse',
    description: 'Bitcoin & Stacks wallet',
    icon: '/wallets/xverse.svg',
  },
  {
    id: 'asigna',
    name: 'Asigna',
    description: 'Multi-signature wallet for Stacks',
    icon: '/wallets/asigna.svg',
  },
];

// WalletConnect configuration options
export const WALLETCONNECT_CONFIG = {
  projectId: WALLETCONNECT_PROJECT_ID,
  metadata: APP_METADATA,
  themeMode: 'dark' as const,
  themeVariables: {
    '--w3m-accent': '#5546FF',
    '--w3m-border-radius-master': '8px',
  },
};

// Network chain IDs
export const STACKS_CHAIN_ID = STACKS_NETWORK === 'mainnet' ? 1 : 2147483648;

// Export network info
export const NETWORK_CONFIG = {
  chainId: STACKS_CHAIN_ID,
  name: STACKS_NETWORK === 'mainnet' ? 'Stacks Mainnet' : 'Stacks Testnet',
  network: getStacksNetwork(),
  apiUrl: STACKS_API_URL,
};
