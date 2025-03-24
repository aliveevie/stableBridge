"use client"

import React, { useState, useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserContext } from "@/components/userContext"
import { Badge } from '@/components/ui/badge';
import { 
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  uintCV,
  contractPrincipalCV,
  standardPrincipalCV,
  trueCV,
  falseCV
} from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';

type Listing = {
  id: number;
  seller: string;
  tokenId: number;
  price: number;
  expiry: number;
  paymentAssetContract: string | null;
  taker: string | null;
};

// Add contract constants
const NFT_MARKET_CONTRACT = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-marketplace';
const TESTNET = STACKS_TESTNET;

export default function NFTMarketInterface() {
  const { userData } = useContext(UserContext);
  // State for form inputs
  const [activeTab, setActiveTab] = useState('list');
  const [listingResult, setListingResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [networkType, setNetworkType] = useState<string>('testnet');
  const [currentBlockHeight, setCurrentBlockHeight] = useState<number>(0);

  // Form states
  const [listForm, setListForm] = useState({
    nftContract: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-trait',
    tokenId: '',
    price: '',
    expiry: '',
    paymentContract: '',
    taker: '',
  });

  const [fulfillForm, setFulfillForm] = useState({
    listingId: '',
    nftContract: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-trait',
    paymentType: 'stx',
    paymentContract: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sip-010-trait-ft-standard',
  });

  const [cancelForm, setCancelForm] = useState({
    listingId: '',
    nftContract: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-trait',
  });

  const [whitelistForm, setWhitelistForm] = useState({
    assetContract: '',
    status: 'true',
  });

  // Simulate fetching the current block height from the testnet
  useEffect(() => {
    // In a real implementation, this would make an API call to the Stacks testnet
    const mockBlockHeight = Math.floor(Math.random() * 10000) + 40000;
    setCurrentBlockHeight(mockBlockHeight);
  }, []);

  // Check if user is connected to testnet
  useEffect(() => {
    if (userData) {
      // Verify that they're using a testnet address
      if (!userData.profile?.stxAddress?.testnet) {
        setErrorMessage('Please connect using a testnet wallet address');
      } else {
        setErrorMessage(null);
      }
    }
  }, [userData]);

  // Handle list asset form changes
  const handleListFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setListForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle fulfill form changes
  const handleFulfillFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFulfillForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle cancel form changes
  const handleCancelFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCancelForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle whitelist form changes
  const handleWhitelistFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWhitelistForm((prev) => ({ ...prev, [name]: value }));
  };

  // Connect wallet function
  const connectWallet = async () => {
    setErrorMessage('Please use the main connect button in the navigation bar');
  };

  // Helper function to check network
  const checkTestnetConnection = () => {
    if (!userData) {
      setErrorMessage('Please connect your wallet first');
      return false;
    }
    
    if (!userData.profile?.stxAddress?.testnet) {
      setErrorMessage('This interface only works with testnet wallets');
      return false;
    }
    
    return true;
  };

  // Replace mock listing function with actual contract call
  const listAsset = async () => {
    try {
      setErrorMessage(null);
      setListingResult(null);
      
      if (!checkTestnetConnection()) return;
      
      if (!listForm.tokenId || !listForm.price || !listForm.expiry) {
        setErrorMessage('Please fill in all required fields');
        return;
      }

      const expiry = parseInt(listForm.expiry);
      if (expiry <= currentBlockHeight) {
        setErrorMessage(`Expiry block height must be greater than current block height (${currentBlockHeight})`);
        return;
      }

      const txOptions = {
        contractAddress: NFT_MARKET_CONTRACT.split('.')[0],
        contractName: NFT_MARKET_CONTRACT.split('.')[1],
        functionName: 'list-asset',
        functionArgs: [
          contractPrincipalCV(listForm.nftContract.split('.')[0], listForm.nftContract.split('.')[1]),
          uintCV(parseInt(listForm.tokenId)),
          uintCV(parseInt(listForm.price)),
          uintCV(parseInt(listForm.expiry)),
          listForm.paymentContract ? 
            contractPrincipalCV(listForm.paymentContract.split('.')[0], listForm.paymentContract.split('.')[1]) : 
            null,
          listForm.taker ? standardPrincipalCV(listForm.taker) : null
        ],
        network: TESTNET,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        senderAddress: userData.profile.stxAddress.testnet,
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResponse = await broadcastTransaction(transaction);
      
      setListingResult(`Transaction submitted: ${broadcastResponse.txid}`);
      
      // Reset form after successful submission
      setListForm({
        nftContract: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-trait',
        tokenId: '',
        price: '',
        expiry: '',
        paymentContract: '',
        taker: '',
      });
    } catch (error) {
      setErrorMessage(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Replace mock fulfill function with actual contract call
  const fulfillListing = async () => {
    try {
      setErrorMessage(null);
      setListingResult(null);
      
      if (!checkTestnetConnection()) return;
      
      if (!fulfillForm.listingId) {
        setErrorMessage('Please enter a listing ID');
        return;
      }

      const functionName = fulfillForm.paymentType === 'stx' ? 
        'fulfill-listing-stx' : 
        'fulfill-listing-ft';

      const txOptions = {
        contractAddress: NFT_MARKET_CONTRACT.split('.')[0],
        contractName: NFT_MARKET_CONTRACT.split('.')[1],
        functionName: functionName,
        functionArgs: [
          uintCV(parseInt(fulfillForm.listingId)),
          contractPrincipalCV(fulfillForm.nftContract.split('.')[0], fulfillForm.nftContract.split('.')[1])
        ],
        network: TESTNET,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        senderAddress: userData.profile.stxAddress.testnet,
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResponse = await broadcastTransaction(transaction);
      
      setListingResult(`Transaction submitted: ${broadcastResponse.txid}`);
      
      // Reset form
      setFulfillForm({
        listingId: '',
        nftContract: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-trait',
        paymentType: 'stx',
        paymentContract: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sip-010-trait-ft-standard',
      });
    } catch (error) {
      setErrorMessage(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Replace mock cancel function with actual contract call
  const cancelListingFn = async () => {
    try {
      setErrorMessage(null);
      setListingResult(null);
      
      if (!checkTestnetConnection()) return;
      
      if (!cancelForm.listingId) {
        setErrorMessage('Please enter a listing ID');
        return;
      }

      const txOptions = {
        contractAddress: NFT_MARKET_CONTRACT.split('.')[0],
        contractName: NFT_MARKET_CONTRACT.split('.')[1],
        functionName: 'cancel-listing',
        functionArgs: [
          uintCV(parseInt(cancelForm.listingId)),
          contractPrincipalCV(cancelForm.nftContract.split('.')[0], cancelForm.nftContract.split('.')[1])
        ],
        network: TESTNET,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        senderAddress: userData.profile.stxAddress.testnet,
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResponse = await broadcastTransaction(transaction);
      
      setListingResult(`Transaction submitted: ${broadcastResponse.txid}`);
      
      // Reset form
      setCancelForm({
        listingId: '',
        nftContract: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-trait',
      });
    } catch (error) {
      setErrorMessage(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Replace mock whitelist function with actual contract call
  const setWhitelisted = async () => {
    try {
      setErrorMessage(null);
      setListingResult(null);
      
      if (!checkTestnetConnection()) return;
      
      if (!whitelistForm.assetContract) {
        setErrorMessage('Please enter an asset contract');
        return;
      }

      const txOptions = {
        contractAddress: NFT_MARKET_CONTRACT.split('.')[0],
        contractName: NFT_MARKET_CONTRACT.split('.')[1],
        functionName: 'set-whitelisted',
        functionArgs: [
          contractPrincipalCV(
            whitelistForm.assetContract.split('.')[0], 
            whitelistForm.assetContract.split('.')[1]
          ),
          whitelistForm.status === 'true' ? trueCV() : falseCV()
        ],
        network: TESTNET,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        senderAddress: userData.profile.stxAddress.testnet,
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResponse = await broadcastTransaction(transaction);
      
      setListingResult(`Transaction submitted: ${broadcastResponse.txid}`);
      
      // Reset form
      setWhitelistForm({
        assetContract: '',
        status: 'true',
      });
    } catch (error) {
      setErrorMessage(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Add function to fetch current listings from the contract
  const fetchListings = async () => {
    try {
      const response = await fetch(
        `https://stacks-node-api.testnet.stacks.co/extended/v1/contract/${NFT_MARKET_CONTRACT}/read/get-listings`
      );
      const data = await response.json();
      // Transform contract data into Listing[] format
      const fetchedListings = data.map((item: any) => ({
        id: item.value.id.value,
        seller: item.value.seller.value,
        tokenId: item.value['token-id'].value,
        price: item.value.price.value,
        expiry: item.value.expiry.value,
        paymentAssetContract: item.value['payment-asset-contract']?.value || null,
        taker: item.value.taker?.value || null,
      }));
      setListings(fetchedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  // Fetch listings on component mount and after successful transactions
  useEffect(() => {
    fetchListings();
  }, []);

  // Get the user's testnet address from context
  const userTestnetAddress = userData?.profile?.stxAddress?.testnet || 'Not connected';

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <header className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2">NFT Market Interface</h1>
          <div className="flex justify-center items-center gap-2">
            <Badge variant="outline" className="bg-yellow-100">Testnet Only</Badge>
            <p className="text-gray-500">
              Interact with the Clarity NFT Market contract on Stacks Testnet
            </p>
          </div>
        </header>

        {/* Network and Wallet Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Network Status</CardTitle>
            <CardDescription>
              Connected to Stacks Testnet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-sm text-gray-500">Current Network:</span>
                  <span className="ml-2 font-medium text-yellow-600">Testnet</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Block Height:</span>
                  <span className="ml-2 font-medium">{currentBlockHeight}</span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Wallet Address:</span>
                <span className="ml-2 font-medium overflow-hidden text-ellipsis">{userTestnetAddress}</span>
              </div>
              {userData && !userData.profile?.stxAddress?.testnet && (
                <Alert variant="destructive" className="mt-2">
                  <AlertTitle>Wrong Network</AlertTitle>
                  <AlertDescription>Please switch to a testnet wallet to interact with this interface</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {errorMessage && (
          <Alert variant="destructive" className="my-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {listingResult && (
          <Alert className="my-4 bg-green-50 border-green-200">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{listingResult}</AlertDescription>
          </Alert>
        )}

        {/* Main Interface Tabs */}
        <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="list">List NFT</TabsTrigger>
            <TabsTrigger value="buy">Buy NFT</TabsTrigger>
            <TabsTrigger value="cancel">Cancel Listing</TabsTrigger>
            <TabsTrigger value="whitelist">Whitelist</TabsTrigger>
          </TabsList>

          {/* List NFT Tab */}
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>List NFT for Sale</CardTitle>
                <CardDescription>
                  Put your NFT up for sale on the testnet marketplace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nftContract">NFT Contract</Label>
                    <Input
                      id="nftContract"
                      name="nftContract"
                      placeholder="Enter NFT contract principal"
                      value={listForm.nftContract}
                      onChange={handleListFormChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tokenId">Token ID</Label>
                    <Input
                      id="tokenId"
                      name="tokenId"
                      type="number"
                      placeholder="Enter token ID"
                      value={listForm.tokenId}
                      onChange={handleListFormChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (uSTX)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="Enter price"
                      value={listForm.price}
                      onChange={handleListFormChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry (block height)</Label>
                    <div className="flex flex-col space-y-1">
                      <Input
                        id="expiry"
                        name="expiry"
                        type="number"
                        placeholder={`Enter block height (current: ${currentBlockHeight})`}
                        value={listForm.expiry}
                        onChange={handleListFormChange}
                      />
                      <span className="text-xs text-gray-500">Current block height: {currentBlockHeight}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentContract">
                      Payment Asset Contract <span className="text-gray-400">(Optional)</span>
                    </Label>
                    <Input
                      id="paymentContract"
                      name="paymentContract"
                      placeholder="Leave empty for STX payment"
                      value={listForm.paymentContract}
                      onChange={handleListFormChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taker">
                      Taker Address <span className="text-gray-400">(Optional)</span>
                    </Label>
                    <Input
                      id="taker"
                      name="taker"
                      placeholder="Leave empty for public listing"
                      value={listForm.taker}
                      onChange={handleListFormChange}
                    />
                  </div>
                </div>

                <Button 
                  onClick={listAsset} 
                  className="w-full mt-4" 
                  disabled={!userData || !userData.profile?.stxAddress?.testnet}
                >
                  List NFT on Testnet
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Buy NFT Tab */}
          <TabsContent value="buy">
            <Card>
              <CardHeader>
                <CardTitle>Buy NFT</CardTitle>
                <CardDescription>
                  Purchase an NFT from an existing testnet listing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="listingId">Listing ID</Label>
                    <Input
                      id="listingId"
                      name="listingId"
                      type="number"
                      placeholder="Enter listing ID"
                      value={fulfillForm.listingId}
                      onChange={handleFulfillFormChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nftContract">NFT Contract</Label>
                    <Input
                      id="nftContract"
                      name="nftContract"
                      placeholder="Enter NFT contract principal"
                      value={fulfillForm.nftContract}
                      onChange={handleFulfillFormChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentType">Payment Type</Label>
                    <Select
                      value={fulfillForm.paymentType}
                      onValueChange={(value) => setFulfillForm({...fulfillForm, paymentType: value})}
                    >
                      <SelectTrigger id="paymentType">
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stx">STX (Stacks)</SelectItem>
                        <SelectItem value="ft">Fungible Token</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {fulfillForm.paymentType === 'ft' && (
                    <div className="space-y-2">
                      <Label htmlFor="paymentContract">FT Contract</Label>
                      <Input
                        id="paymentContract"
                        name="paymentContract"
                        placeholder="Enter FT contract principal"
                        value={fulfillForm.paymentContract}
                        onChange={handleFulfillFormChange}
                      />
                    </div>
                  )}
                </div>

                <Button 
                  onClick={fulfillListing} 
                  className="w-full mt-4" 
                  disabled={!userData || !userData.profile?.stxAddress?.testnet}
                >
                  Purchase NFT on Testnet
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cancel Listing Tab */}
          <TabsContent value="cancel">
            <Card>
              <CardHeader>
                <CardTitle>Cancel Listing</CardTitle>
                <CardDescription>
                  Remove your NFT listing from the testnet marketplace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cancelListingId">Listing ID</Label>
                    <Input
                      id="cancelListingId"
                      name="listingId"
                      type="number"
                      placeholder="Enter listing ID"
                      value={cancelForm.listingId}
                      onChange={handleCancelFormChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cancelNftContract">NFT Contract</Label>
                    <Input
                      id="cancelNftContract"
                      name="nftContract"
                      placeholder="Enter NFT contract principal"
                      value={cancelForm.nftContract}
                      onChange={handleCancelFormChange}
                    />
                  </div>
                </div>

                <Button 
                  onClick={cancelListingFn} 
                  className="w-full mt-4" 
                  disabled={!userData || !userData.profile?.stxAddress?.testnet}
                >
                  Cancel Listing on Testnet
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Whitelist Tab */}
          <TabsContent value="whitelist">
            <Card>
              <CardHeader>
                <CardTitle>Manage Whitelist</CardTitle>
                <CardDescription>
                  Control which asset contracts can be listed on the testnet marketplace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assetContract">Asset Contract</Label>
                    <Input
                      id="assetContract"
                      name="assetContract"
                      placeholder="Enter asset contract principal"
                      value={whitelistForm.assetContract}
                      onChange={handleWhitelistFormChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whitelistStatus">Status</Label>
                    <Select
                      value={whitelistForm.status}
                      onValueChange={(value) => setWhitelistForm({...whitelistForm, status: value})}
                    >
                      <SelectTrigger id="whitelistStatus">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Whitelist</SelectItem>
                        <SelectItem value="false">Remove from whitelist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={setWhitelisted} 
                  className="w-full mt-4" 
                  disabled={!userData || !userData.profile?.stxAddress?.testnet}
                >
                  Update Whitelist on Testnet
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Active Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Active Testnet Listings</CardTitle>
            <CardDescription>
              Currently active NFT listings on the testnet marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            {listings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No active testnet listings found</p>
            ) : (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div key={listing.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">Listing #{listing.id}</h3>
                          <Badge variant="outline" className="bg-yellow-50">Testnet</Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          Token ID: {listing.tokenId}
                        </p>
                        <p className="text-sm text-gray-500">
                          Price: {listing.price} {listing.paymentAssetContract ? 'FT' : 'uSTX'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Expires at block: {listing.expiry}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-md">
                          Seller: {listing.seller}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setFulfillForm({
                            ...fulfillForm,
                            listingId: listing.id.toString(),
                          });
                          setActiveTab('buy');
                        }}
                        disabled={!userData || !userData.profile?.stxAddress?.testnet}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}