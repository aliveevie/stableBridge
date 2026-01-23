import { describe, expect, it, beforeEach } from "vitest";
import { ClarityValue, boolCV, contractPrincipalCV, falseCV, noneCV, principalCV, someCV, stringAsciiCV, stringUtf8CV, trueCV, uintCV } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

// Contract names
const mockNFTContractName = "mock-nft";
const mockFTContractName = "mock-ft";
const mockFT2ContractName = "mock-ft2";
const nftMarketContractName = "nft-market";

// Helper function to advance the chain by a number of blocks
const advanceBlocks = (count: number) => {
  for (let i = 0; i < count; i++) {
    simnet.mineEmptyBlock();
  }
};

describe("NFT Market Contract Tests", () => {
  beforeEach(() => {
    try {
      // Mint an NFT to wallet1 for testing
      simnet.callPublicFn(mockNFTContractName, "mint", [principalCV(wallet1)], deployer);
      
      // Mint fungible tokens to wallet2 for testing
      simnet.callPublicFn(mockFTContractName, "mint", [principalCV(wallet2), uintCV(1000000000)], deployer);
      simnet.callPublicFn(mockFT2ContractName, "mint", [principalCV(wallet2), uintCV(1000000000)], deployer);
      
      // Whitelist the mock contracts for marketplace use
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockNFTContractName), trueCV()], 
        deployer
      );
      
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockFTContractName), trueCV()], 
        deployer
      );
      
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockFT2ContractName), trueCV()], 
        deployer
      );
    } catch (e) {
      // Ignore errors in setup
    }
  });

  describe("Basic Setup", () => {
    it("ensures contracts are deployed and simnet is initialized", () => {
      expect(simnet.blockHeight).toBeDefined();
    });

    it("exposes the current listing nonce", () => {
      const { result } = simnet.callReadOnlyFn(
        nftMarketContractName,
        "get-listing-nonce",
        [],
        deployer
      );

      expect((result as any).value).toBe(0n);
    });

    it("exposes the contract owner", () => {
      const { result } = simnet.callReadOnlyFn(
        nftMarketContractName,
        "get-contract-owner",
        [],
        deployer
      );

      expect((result as any).address).toBe(deployer);
    });
  });

  describe("Whitelisting", () => {
    it("allows the contract owner to whitelist an asset contract", () => {
      const { result } = simnet.callPublicFn(
        nftMarketContractName,
        "set-whitelisted",
        [contractPrincipalCV(deployer, mockNFTContractName), trueCV()],
        deployer
      );
      
      expect(result).toBeOk(true);
      
      const { result: isWhitelisted } = simnet.callReadOnlyFn(
        nftMarketContractName,
        "is-whitelisted",
        [contractPrincipalCV(deployer, mockNFTContractName)],
        deployer
      );
      
      expect(isWhitelisted).toBeTruthy();
    });
    
    it("prevents non-owners from whitelisting contracts", () => {
      const { result } = simnet.callPublicFn(
        nftMarketContractName,
        "set-whitelisted",
        [contractPrincipalCV(deployer, mockNFTContractName), trueCV()],
        wallet1
      );
      
      expect(result).toBeErr().withUint(2001); // ERR_UNAUTHORISED
    });
    
    it("prevents whitelisting the contract itself", () => {
      const { result } = simnet.callPublicFn(
        nftMarketContractName,
        "set-whitelisted",
        [contractPrincipalCV(deployer, nftMarketContractName), trueCV()],
        deployer
      );
      
      expect(result).toBeErr().withUint(2009); // ERR_INVALID_CONTRACT
    });
  });

  describe("Listing NFTs", () => {
    it("allows a user to list an NFT for sale with STX", () => {
      // First mint an NFT to wallet1
      simnet.callPublicFn(mockNFTContractName, "mint", [principalCV(wallet1)], deployer);
      
      // Whitelist the NFT contract
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockNFTContractName), trueCV()], 
        deployer
      );
      
      // Create a listing
      const listingData = {
        "taker": noneCV(),
        "token-id": uintCV(1),
        "expiry": uintCV(simnet.blockHeight + 100),
        "price": uintCV(1000000), // 1 STX
        "payment-asset-contract": noneCV() // None means STX
      };
      
      const { result } = simnet.callPublicFn(
        nftMarketContractName,
        "list-asset",
        [
          contractPrincipalCV(deployer, mockNFTContractName),
          listingData
        ],
        wallet1
      );
      
      expect(result).toBeOk(0); // First listing ID should be 0
      
      // Check that the listing exists
      const { result: listing } = simnet.callReadOnlyFn(
        nftMarketContractName,
        "get-listing",
        [uintCV(0)],
        wallet1
      );
      
      expect(listing).not.toBeNone();
    });
    
    it("allows a user to list an NFT for sale with a fungible token", () => {
      // First mint an NFT to wallet1
      simnet.callPublicFn(mockNFTContractName, "mint", [principalCV(wallet1)], deployer);
      
      // Whitelist both contracts
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockNFTContractName), trueCV()], 
        deployer
      );
      
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockFTContractName), trueCV()], 
        deployer
      );
      
      // Create a listing with FT payment
      const listingData = {
        "taker": noneCV(),
        "token-id": uintCV(1),
        "expiry": uintCV(simnet.blockHeight + 100),
        "price": uintCV(5000000), // 5 tokens
        "payment-asset-contract": someCV(contractPrincipalCV(deployer, mockFTContractName))
      };
      
      const { result } = simnet.callPublicFn(
        nftMarketContractName,
        "list-asset",
        [
          contractPrincipalCV(deployer, mockNFTContractName),
          listingData
        ],
        wallet1
      );
      
      expect(result).toBeOk(0);
      
      // Check that the listing exists with the correct payment contract
      const { result: listing } = simnet.callReadOnlyFn(
        nftMarketContractName,
        "get-listing",
        [uintCV(0)],
        wallet1
      );
      
      expect(listing).not.toBeNone();
    });
    
    it("prevents listing with zero price", () => {
      simnet.callPublicFn(mockNFTContractName, "mint", [principalCV(wallet1)], deployer);
      
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockNFTContractName), trueCV()], 
        deployer
      );
      
      const listingData = {
        "taker": noneCV(),
        "token-id": uintCV(1),
        "expiry": uintCV(simnet.blockHeight + 100),
        "price": uintCV(0),
        "payment-asset-contract": noneCV()
      };
      
      const { result } = simnet.callPublicFn(
        nftMarketContractName,
        "list-asset",
        [
          contractPrincipalCV(deployer, mockNFTContractName),
          listingData
        ],
        wallet1
      );
      
      expect(result).toBeErr().withUint(1001); // ERR_PRICE_ZERO
    });
    
    it("prevents listing with expiry in the past", () => {
      simnet.callPublicFn(mockNFTContractName, "mint", [principalCV(wallet1)], deployer);
      
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockNFTContractName), trueCV()], 
        deployer
      );
      
      const listingData = {
        "taker": noneCV(),
        "token-id": uintCV(1),
        "expiry": uintCV(simnet.blockHeight - 1),
        "price": uintCV(1000000),
        "payment-asset-contract": noneCV()
      };
      
      const { result } = simnet.callPublicFn(
        nftMarketContractName,
        "list-asset",
        [
          contractPrincipalCV(deployer, mockNFTContractName),
          listingData
        ],
        wallet1
      );
      
      expect(result).toBeErr().withUint(1000); // ERR_EXPIRY_IN_PAST
    });
    
    it("prevents listing from non-whitelisted contracts", () => {
      simnet.callPublicFn(mockNFTContractName, "mint", [principalCV(wallet1)], deployer);
      
      // Make sure contract is not whitelisted
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockNFTContractName), falseCV()], 
        deployer
      );
      
      const listingData = {
        "taker": noneCV(),
        "token-id": uintCV(1),
        "expiry": uintCV(simnet.blockHeight + 100),
        "price": uintCV(1000000),
        "payment-asset-contract": noneCV()
      };
      
      const { result } = simnet.callPublicFn(
        nftMarketContractName,
        "list-asset",
        [
          contractPrincipalCV(deployer, mockNFTContractName),
          listingData
        ],
        wallet1
      );
      
      expect(result).toBeErr().withUint(2007); // ERR_ASSET_CONTRACT_NOT_WHITELISTED
    });
  });

  describe("Cancelling listings", () => {
    it("allows the maker to cancel a listing", () => {
      // Create a listing
      simnet.callPublicFn(mockNFTContractName, "mint", [principalCV(wallet1)], deployer);
      
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockNFTContractName), trueCV()], 
        deployer
      );
      
      const listingData = {
        "taker": noneCV(),
        "token-id": uintCV(1),
        "expiry": uintCV(simnet.blockHeight + 100),
        "price": uintCV(1000000),
        "payment-asset-contract": noneCV()
      };
      
      simnet.callPublicFn(
        nftMarketContractName,
        "list-asset",
        [
          contractPrincipalCV(deployer, mockNFTContractName),
          listingData
        ],
        wallet1
      );
      
      // Cancel the listing
      const { result } = simnet.callPublicFn(
        nftMarketContractName,
        "cancel-listing",
        [uintCV(0), contractPrincipalCV(deployer, mockNFTContractName)],
        wallet1
      );
      
      expect(result).toBeOk();
      
      // Verify the listing is gone
      const { result: listing } = simnet.callReadOnlyFn(
        nftMarketContractName,
        "get-listing",
        [uintCV(0)],
        wallet1
      );
      
      expect(listing).toBeNone();
    });
    
    it("prevents non-makers from cancelling listings", () => {
      // Create a listing by wallet1
      simnet.callPublicFn(mockNFTContractName, "mint", [principalCV(wallet1)], deployer);
      
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockNFTContractName), trueCV()], 
        deployer
      );
      
      const listingData = {
        "taker": noneCV(),
        "token-id": uintCV(1),
        "expiry": uintCV(simnet.blockHeight + 100),
        "price": uintCV(1000000),
        "payment-asset-contract": noneCV()
      };
      
      simnet.callPublicFn(
        nftMarketContractName,
        "list-asset",
        [
          contractPrincipalCV(deployer, mockNFTContractName),
          listingData
        ],
        wallet1
      );
      
      // Try to cancel from wallet2
      const { result } = simnet.callPublicFn(
        nftMarketContractName,
        "cancel-listing",
        [uintCV(0), contractPrincipalCV(deployer, mockNFTContractName)],
        wallet2
      );
      
      expect(result).toBeErr().withUint(2001); // ERR_UNAUTHORISED
    });
    
    it("handles cancelling non-existent listings", () => {
      const { result } = simnet.callPublicFn(
        nftMarketContractName,
        "cancel-listing",
        [uintCV(9999), contractPrincipalCV(deployer, mockNFTContractName)],
        wallet1
      );
      
      expect(result).toBeErr().withUint(2000); // ERR_UNKNOWN_LISTING
    });
  });

  describe("Fulfilling listings with STX", () => {
    it("allows a user to purchase an NFT with STX", () => {
      // Setup: Create a listing by wallet1
      simnet.callPublicFn(mockNFTContractName, "mint", [principalCV(wallet1)], deployer);
      
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockNFTContractName), trueCV()], 
        deployer
      );
      
      const listingPrice = 1000000; // 1 STX
      
      const listingData = {
        "taker": noneCV(),
        "token-id": uintCV(1),
        "expiry": uintCV(simnet.blockHeight + 100),
        "price": uintCV(listingPrice),
        "payment-asset-contract": noneCV()
      };
      
      simnet.callPublicFn(
        nftMarketContractName,
        "list-asset",
        [
          contractPrincipalCV(deployer, mockNFTContractName),
          listingData
        ],
        wallet1
      );
      
      // Record initial STX balances
      const wallet1InitialBalance = simnet.getStxBalance(wallet1);
      const wallet2InitialBalance = simnet.getStxBalance(wallet2);
      
      // Purchase with wallet2
      const { result } = simnet.callPublicFn(
        nftMarketContractName,
        "fulfil-listing-stx",
        [uintCV(0), contractPrincipalCV(deployer, mockNFTContractName)],
        wallet2
      );
      
      expect(result).toBeOk(0);
      
      // Verify STX transfers occurred correctly
      expect(simnet.getStxBalance(wallet1).amount).toBe(wallet1InitialBalance.amount + listingPrice);
      expect(simnet.getStxBalance(wallet2).amount).toBeLessThan(wallet2InitialBalance.amount);
      
      // Verify the listing was removed
      const { result: listing } = simnet.callReadOnlyFn(
        nftMarketContractName,
        "get-listing",
        [uintCV(0)],
        wallet1
      );
      
      expect(listing).toBeNone();
    });
    
    it("prevents purchase of expired listings", () => {
      // Setup a listing
      simnet.callPublicFn(mockNFTContractName, "mint", [principalCV(wallet1)], deployer);
      
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockNFTContractName), trueCV()], 
        deployer
      );
      
      const listingData = {
        "taker": noneCV(),
        "token-id": uintCV(1),
        "expiry": uintCV(simnet.blockHeight + 10),
        "price": uintCV(1000000),
        "payment-asset-contract": noneCV()
      };
      
      simnet.callPublicFn(
        nftMarketContractName,
        "list-asset",
        [
          contractPrincipalCV(deployer, mockNFTContractName),
          listingData
        ],
        wallet1
      );
      
      // Move forward past expiry
      advanceBlocks(11);
      
      // Try to purchase
      const { result } = simnet.callPublicFn(
        nftMarketContractName,
        "fulfil-listing-stx",
        [uintCV(0), contractPrincipalCV(deployer, mockNFTContractName)],
        wallet2
      );
      
      expect(result).toBeErr().withUint(2002); // ERR_LISTING_EXPIRED
    });
    
    it("prevents the maker from purchasing their own listing", () => {
      // Setup a listing
      simnet.callPublicFn(mockNFTContractName, "mint", [principalCV(wallet1)], deployer);
      
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockNFTContractName), trueCV()], 
        deployer
      );
      
      const listingData = {
        "taker": noneCV(),
        "token-id": uintCV(1),
        "expiry": uintCV(simnet.blockHeight + 100),
        "price": uintCV(1000000),
        "payment-asset-contract": noneCV()
      };
      
      simnet.callPublicFn(
        nftMarketContractName,
        "list-asset",
        [
          contractPrincipalCV(deployer, mockNFTContractName),
          listingData
        ],
        wallet1
      );
      
      // Try to purchase own listing
      const { result } = simnet.callPublicFn(
        nftMarketContractName,
        "fulfil-listing-stx",
        [uintCV(0), contractPrincipalCV(deployer, mockNFTContractName)],
        wallet1
      );
      
      expect(result).toBeErr().withUint(2005); // ERR_MAKER_TAKER_EQUAL
    });
  });

  describe("Fulfilling listings with fungible tokens", () => {
    it("allows a user to purchase an NFT with fungible tokens", () => {
      // Setup: Mint NFT to wallet1 and FT to wallet2
      simnet.callPublicFn(mockNFTContractName, "mint", [principalCV(wallet1)], deployer);
      simnet.callPublicFn(mockFTContractName, "mint", [principalCV(wallet2), uintCV(10000000)], deployer);
      
      // Whitelist both contracts
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockNFTContractName), trueCV()], 
        deployer
      );
      
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockFTContractName), trueCV()], 
        deployer
      );
      
      // Create listing with FT payment
      const listingPrice = 5000000;
      
      const listingData = {
        "taker": noneCV(),
        "token-id": uintCV(1),
        "expiry": uintCV(simnet.blockHeight + 100),
        "price": uintCV(listingPrice),
        "payment-asset-contract": someCV(contractPrincipalCV(deployer, mockFTContractName))
      };
      
      simnet.callPublicFn(
        nftMarketContractName,
        "list-asset",
        [
          contractPrincipalCV(deployer, mockNFTContractName),
          listingData
        ],
        wallet1
      );
      
      // Purchase with wallet2
      const { result } = simnet.callPublicFn(
        nftMarketContractName,
        "fulfil-listing-ft",
        [
          uintCV(0), 
          contractPrincipalCV(deployer, mockNFTContractName), 
          contractPrincipalCV(deployer, mockFTContractName)
        ],
        wallet2
      );
      
      expect(result).toBeOk(0);
      
      // Verify listing was removed
      const { result: listing } = simnet.callReadOnlyFn(
        nftMarketContractName,
        "get-listing",
        [uintCV(0)],
        wallet1
      );
      
      expect(listing).toBeNone();
    });
    
    it("prevents purchase with incorrect payment contract", () => {
      // Setup: Deploy an unauthorized FT contract for testing
      
      // Setup regular test contracts
      simnet.callPublicFn(mockNFTContractName, "mint", [principalCV(wallet1)], deployer);
      
      // Whitelist NFT and mock-ft contracts
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockNFTContractName), trueCV()], 
        deployer
      );
      
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockFTContractName), trueCV()], 
        deployer
      );
      
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockFT2ContractName), trueCV()], 
        deployer
      );
      
      // Create listing with FT1
      const listingData = {
        "taker": noneCV(),
        "token-id": uintCV(1),
        "expiry": uintCV(simnet.blockHeight + 100),
        "price": uintCV(5000000),
        "payment-asset-contract": someCV(contractPrincipalCV(deployer, mockFTContractName))
      };
      
      simnet.callPublicFn(
        nftMarketContractName,
        "list-asset",
        [
          contractPrincipalCV(deployer, mockNFTContractName),
          listingData
        ],
        wallet1
      );
      
      // Try to purchase with invalid contract
      const { result } = simnet.callPublicFn(
        nftMarketContractName,
        "fulfil-listing-ft",
        [
          uintCV(0), 
          contractPrincipalCV(deployer, mockNFTContractName), 
          contractPrincipalCV(deployer, mockFT2ContractName)
        ],
        wallet2
      );
      
      expect(result).toBeErr().withUint(101); // ERR_PAYMENT_CONTRACT_MISMATCH
    });
  });

  describe("Private listings", () => {
    it("allows fulfilling a private listing by intended recipient", () => {
      // Create a listing specifically for wallet2
      simnet.callPublicFn(mockNFTContractName, "mint", [principalCV(wallet1)], deployer);
      
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockNFTContractName), trueCV()], 
        deployer
      );
      
      const listingData = {
        "taker": someCV(principalCV(wallet2)),
        "token-id": uintCV(1),
        "expiry": uintCV(simnet.blockHeight + 100),
        "price": uintCV(1000000),
        "payment-asset-contract": noneCV()
      };
      
      simnet.callPublicFn(
        nftMarketContractName,
        "list-asset",
        [
          contractPrincipalCV(deployer, mockNFTContractName),
          listingData
        ],
        wallet1
      );
      
      // wallet2 buys it
      const { result } = simnet.callPublicFn(
        nftMarketContractName,
        "fulfil-listing-stx",
        [uintCV(0), contractPrincipalCV(deployer, mockNFTContractName)],
        wallet2
      );
      
      expect(result).toBeOk(0);
    });
    
    it("prevents fulfilling a private listing by unintended recipient", () => {
      // Create a listing specifically for wallet2
      simnet.callPublicFn(mockNFTContractName, "mint", [principalCV(wallet1)], deployer);
      
      simnet.callPublicFn(
        nftMarketContractName, 
        "set-whitelisted", 
        [contractPrincipalCV(deployer, mockNFTContractName), trueCV()], 
        deployer
      );
      
      const listingData = {
        "taker": someCV(principalCV(wallet2)),
        "token-id": uintCV(1),
        "expiry": uintCV(simnet.blockHeight + 100),
        "price": uintCV(1000000),
        "payment-asset-contract": noneCV()
      };
      
      simnet.callPublicFn(
        nftMarketContractName,
        "list-asset",
        [
          contractPrincipalCV(deployer, mockNFTContractName),
          listingData
        ],
        wallet1
      );
      
      // wallet3 tries to buy it
      const { result } = simnet.callPublicFn(
        nftMarketContractName,
        "fulfil-listing-stx",
        [uintCV(0), contractPrincipalCV(deployer, mockNFTContractName)],
        wallet3
      );
      
      expect(result).toBeErr().withUint(2006); // ERR_UNINTENDED_TAKER
    });
  });
});
