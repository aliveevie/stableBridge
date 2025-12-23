/**
 * Wallet Session Storage
 */
export const saveWalletSession = (address: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sb_last_wallet', address);
  }
};

export const getLastWallet = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sb_last_wallet');
  }
  return null;
};
