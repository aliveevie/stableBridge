/**
 * Address formatting utilities
 */

/**
 * Truncate a Stacks address for display
 */
export function truncateAddress(address: string, startChars: number = 6, endChars: number = 4): string {
    if (!address) return '';
    if (address.length <= startChars + endChars) return address;

    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Validate Stacks address format
 */
export function isValidStacksAddress(address: string): boolean {
    // Stacks addresses start with SP (mainnet) or ST (testnet)
    const stacksAddressRegex = /^S[PT][0-9A-Z]{38,40}$/;
    return stacksAddressRegex.test(address);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        return false;
    }
}

/**
 * Format address for display with copy functionality
 */
export function formatAddressWithCopy(address: string): {
    formatted: string;
    full: string;
    copy: () => Promise<boolean>;
} {
    return {
        formatted: truncateAddress(address),
        full: address,
        copy: () => copyToClipboard(address),
    };
}
