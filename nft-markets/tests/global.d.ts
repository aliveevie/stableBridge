// Type definitions for Clarinet SDK
declare module '@hirosystems/clarinet-sdk' {
  export interface Simnet {
    getAccounts(): Map<string, string>;
    getStxBalance(account: string): { amount: number };
    mineEmptyBlock(): void;
    blockHeight: number;
    callPublicFn(contract: string, method: string, args: ClarityValue[], sender: string): { result: any };
    callReadOnlyFn(contract: string, method: string, args: ClarityValue[], sender: string): { result: any };
  }
}

// Declare global variables
declare global {
  var simnet: import('@hirosystems/clarinet-sdk').Simnet;
}

// Declare custom matchers for Vitest
declare global {
  namespace Vi {
    interface AsymmetricMatchersContaining {
      toBeOk(): { withUint(value: number): any };
      toBeErr(): { withUint(value: number): any };
      toBeTruthy(): any;
      toBeNone(): any;
      not: AsymmetricMatchersContaining;
    }
    
    interface Assertion {
      toBeOk(): { withUint(value: number): any };
      toBeErr(): { withUint(value: number): any };
      toBeTruthy(): any;
      toBeNone(): any;
      not: Assertion;
    }
  }
}

// Make this a module
export {};
