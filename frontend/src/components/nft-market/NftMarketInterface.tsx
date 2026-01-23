'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useWalletConnect } from '@/hooks/useWalletConnect';
import { callContract } from '@/lib/stacks/transactions';
import {
  DEFAULT_FT_ASSET_CONTRACT_ID,
  DEFAULT_NFT_ASSET_CONTRACT_ID,
  NFT_MARKET_CONTRACT_ID,
  getContractParts,
} from '@/lib/stacks/contracts';
import {
  contractPrincipalCV,
  falseCV,
  noneCV,
  someCV,
  standardPrincipalCV,
  trueCV,
  tupleCV,
  uintCV,
  validateStacksAddress,
} from '@stacks/transactions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ListingDto = {
  id: number;
  maker: string;
  taker: string | null;
  tokenId: string;
  nftAssetContract: string;
  expiry: string;
  price: string;
  paymentAssetContract: string | null;
};

type OverviewDto = {
  contract: string;
  blockHeight: number | null;
  contractOwner: string;
  listingNonce: string;
  offset: number;
  limit: number;
  listings: ListingDto[];
};

function formatMicroStx(micro: string) {
  const n = Number.parseInt(micro, 10);
  if (!Number.isFinite(n)) return micro;
  return (n / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 6 });
}

function contractPrincipalFromId(contractId: string) {
  const { address, name } = getContractParts(contractId);
  return contractPrincipalCV(address, name);
}

async function fetchOverview(): Promise<OverviewDto> {
  const res = await fetch('/api/nft-market/overview?offset=0&limit=50', { cache: 'no-store' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Failed to load overview (${res.status})`);
  }
  return res.json();
}

export default function NftMarketInterface() {
  const { isConnected, address, network, connect } = useWalletConnect();

  const market = useMemo(() => getContractParts(NFT_MARKET_CONTRACT_ID), []);

  const [activeTab, setActiveTab] = useState<'browse' | 'list' | 'fulfil' | 'cancel' | 'whitelist'>(
    'browse'
  );

  const [overview, setOverview] = useState<OverviewDto | null>(null);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [txMessage, setTxMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [listForm, setListForm] = useState({
    nftAssetContract: DEFAULT_NFT_ASSET_CONTRACT_ID,
    tokenId: '',
    price: '',
    expiry: '',
    paymentType: 'stx' as 'stx' | 'ft',
    paymentAssetContract: DEFAULT_FT_ASSET_CONTRACT_ID,
    taker: '',
  });

  const [fulfilForm, setFulfilForm] = useState({
    listingId: '',
    nftAssetContract: DEFAULT_NFT_ASSET_CONTRACT_ID,
    paymentType: 'stx' as 'stx' | 'ft',
    paymentAssetContract: DEFAULT_FT_ASSET_CONTRACT_ID,
  });

  const [cancelForm, setCancelForm] = useState({
    listingId: '',
    nftAssetContract: DEFAULT_NFT_ASSET_CONTRACT_ID,
  });

  const [whitelistForm, setWhitelistForm] = useState({
    assetContract: '',
    status: 'true' as 'true' | 'false',
  });

  const refresh = async () => {
    setIsRefreshing(true);
    setOverviewError(null);
    try {
      const data = await fetchOverview();
      setOverview(data);
    } catch (e: any) {
      setOverviewError(e?.message || 'Failed to load marketplace');
      setOverview(null);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const requireWallet = async () => {
    if (isConnected && address) return true;
    setErrorMessage('Connect your wallet to continue.');
    await connect();
    return false;
  };

  const listAsset = async () => {
    setErrorMessage(null);
    setTxMessage(null);
    if (!(await requireWallet())) return;

    const tokenId = Number.parseInt(listForm.tokenId, 10);
    const price = Number.parseInt(listForm.price, 10);
    const expiry = Number.parseInt(listForm.expiry, 10);
    if (!Number.isFinite(tokenId) || !Number.isFinite(price) || !Number.isFinite(expiry)) {
      setErrorMessage('Token ID, price, and expiry must be numbers.');
      return;
    }
    if (overview?.blockHeight != null && expiry <= overview.blockHeight) {
      setErrorMessage(`Expiry must be greater than current block height (${overview.blockHeight}).`);
      return;
    }

    if (listForm.taker && !validateStacksAddress(listForm.taker.trim())) {
      setErrorMessage('Taker must be a valid Stacks address.');
      return;
    }

    if (!listForm.nftAssetContract.trim()) {
      setErrorMessage('NFT asset contract is required.');
      return;
    }

    if (listForm.paymentType === 'ft' && !listForm.paymentAssetContract.trim()) {
      setErrorMessage('Payment FT contract is required when using FT.');
      return;
    }

    try {
      const functionArgs = [
        contractPrincipalFromId(listForm.nftAssetContract),
        tupleCV({
          taker: listForm.taker ? someCV(standardPrincipalCV(listForm.taker.trim())) : noneCV(),
          'token-id': uintCV(tokenId),
          expiry: uintCV(expiry),
          price: uintCV(price),
          'payment-asset-contract':
            listForm.paymentType === 'stx'
              ? noneCV()
              : someCV(contractPrincipalFromId(listForm.paymentAssetContract)),
        }),
      ];
      const result: any = await callContract(market.address, market.name, 'list-asset', functionArgs);
      setTxMessage(result?.txId ? `Submitted: ${result.txId}` : 'Submitted transaction.');
      await refresh();
    } catch (e: any) {
      setErrorMessage(e?.message || 'Listing failed.');
    }
  };

  const fulfilListing = async () => {
    setErrorMessage(null);
    setTxMessage(null);
    if (!(await requireWallet())) return;

    const listingId = Number.parseInt(fulfilForm.listingId, 10);
    if (!Number.isFinite(listingId)) {
      setErrorMessage('Listing ID must be a number.');
      return;
    }
    if (!fulfilForm.nftAssetContract.trim()) {
      setErrorMessage('NFT asset contract is required.');
      return;
    }

    const isFt = fulfilForm.paymentType === 'ft';
    if (isFt && !fulfilForm.paymentAssetContract.trim()) {
      setErrorMessage('Payment FT contract is required when using FT.');
      return;
    }

    try {
      const functionName = isFt ? 'fulfil-listing-ft' : 'fulfil-listing-stx';
      const functionArgs = [
        uintCV(listingId),
        contractPrincipalFromId(fulfilForm.nftAssetContract),
        ...(isFt ? [contractPrincipalFromId(fulfilForm.paymentAssetContract)] : []),
      ];
      const result: any = await callContract(market.address, market.name, functionName, functionArgs);
      setTxMessage(result?.txId ? `Submitted: ${result.txId}` : 'Submitted transaction.');
      await refresh();
    } catch (e: any) {
      setErrorMessage(e?.message || 'Fulfil failed.');
    }
  };

  const cancelListing = async () => {
    setErrorMessage(null);
    setTxMessage(null);
    if (!(await requireWallet())) return;

    const listingId = Number.parseInt(cancelForm.listingId, 10);
    if (!Number.isFinite(listingId)) {
      setErrorMessage('Listing ID must be a number.');
      return;
    }
    if (!cancelForm.nftAssetContract.trim()) {
      setErrorMessage('NFT asset contract is required.');
      return;
    }

    try {
      const result: any = await callContract(market.address, market.name, 'cancel-listing', [
        uintCV(listingId),
        contractPrincipalFromId(cancelForm.nftAssetContract),
      ]);
      setTxMessage(result?.txId ? `Submitted: ${result.txId}` : 'Submitted transaction.');
      await refresh();
    } catch (e: any) {
      setErrorMessage(e?.message || 'Cancel failed.');
    }
  };

  const setWhitelisted = async () => {
    setErrorMessage(null);
    setTxMessage(null);
    if (!(await requireWallet())) return;

    const assetContract = whitelistForm.assetContract.trim();
    if (!assetContract) {
      setErrorMessage('Asset contract is required.');
      return;
    }

    try {
      const result: any = await callContract(market.address, market.name, 'set-whitelisted', [
        contractPrincipalFromId(assetContract),
        whitelistForm.status === 'true' ? trueCV() : falseCV(),
      ]);
      setTxMessage(result?.txId ? `Submitted: ${result.txId}` : 'Submitted transaction.');
      await refresh();
    } catch (e: any) {
      setErrorMessage(e?.message || 'Whitelisting failed.');
    }
  };

  const isOwner = !!overview?.contractOwner && !!address && overview.contractOwner === address;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold mb-2">NFT Market</h1>
          <p className="text-muted-foreground">
            Contract: <span className="font-mono">{market.id}</span>
          </p>
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            <Badge variant="outline">{network.toUpperCase()}</Badge>
            {overview?.blockHeight != null && <Badge variant="secondary">Block {overview.blockHeight}</Badge>}
            <Badge variant="outline">{isConnected ? `Wallet: ${address}` : 'Wallet: Not connected'}</Badge>
          </div>
        </header>

        {(overviewError || errorMessage) && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{overviewError || errorMessage}</AlertDescription>
          </Alert>
        )}

        {txMessage && (
          <Alert>
            <AlertTitle>Transaction</AlertTitle>
            <AlertDescription>{txMessage}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Marketplace Overview</CardTitle>
            <CardDescription>Browse listings and interact with the contract.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm text-muted-foreground">
              <div>
                Owner: <span className="font-mono">{overview?.contractOwner || '—'}</span>
                {isOwner && <Badge className="ml-2">You</Badge>}
              </div>
              <div>
                Listing nonce: <span className="font-mono">{overview?.listingNonce || '—'}</span>
              </div>
            </div>
            <Button onClick={refresh} disabled={isRefreshing} variant="secondary">
              {isRefreshing ? 'Refreshing…' : 'Refresh'}
            </Button>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="fulfil">Fulfil</TabsTrigger>
            <TabsTrigger value="cancel">Cancel</TabsTrigger>
            <TabsTrigger value="whitelist">Whitelist</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <Card>
              <CardHeader>
                <CardTitle>Listings</CardTitle>
                <CardDescription>
                  {overview?.listings?.length ? 'Click a listing to prefill fulfil form.' : 'No listings loaded.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {(overview?.listings || []).map(l => (
                    <button
                      key={l.id}
                      className="w-full text-left rounded-lg border p-4 hover:bg-accent transition-colors"
                      onClick={() => {
                        setFulfilForm({
                          listingId: String(l.id),
                          nftAssetContract: l.nftAssetContract,
                          paymentType: l.paymentAssetContract ? 'ft' : 'stx',
                          paymentAssetContract: l.paymentAssetContract || DEFAULT_FT_ASSET_CONTRACT_ID,
                        });
                        setActiveTab('fulfil');
                      }}
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="font-semibold">Listing #{l.id}</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          Token {l.tokenId} • Expires {l.expiry}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3 flex-wrap">
                        <div className="text-sm">
                          Maker: <span className="font-mono">{l.maker}</span>
                          {l.taker && (
                            <>
                              {' '}
                              • Taker: <span className="font-mono">{l.taker}</span>
                            </>
                          )}
                        </div>
                        <div className="text-sm">
                          {l.paymentAssetContract ? (
                            <>
                              Price: <span className="font-mono">{l.price}</span>{' '}
                              <span className="text-muted-foreground">(FT)</span>
                            </>
                          ) : (
                            <>
                              Price: <span className="font-mono">{formatMicroStx(l.price)}</span>{' '}
                              <span className="text-muted-foreground">STX</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground font-mono truncate">
                        NFT: {l.nftAssetContract} {l.paymentAssetContract ? `• Pay: ${l.paymentAssetContract}` : ''}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>List an NFT</CardTitle>
                <CardDescription>
                  Price is a raw uint. For STX listings, use microSTX (1 STX = 1,000,000).
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nftAssetContract">NFT asset contract (ST… .contract)</Label>
                  <Input
                    id="nftAssetContract"
                    value={listForm.nftAssetContract}
                    onChange={e => setListForm(p => ({ ...p, nftAssetContract: e.target.value }))}
                    placeholder="ST….your-nft"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="tokenId">Token ID</Label>
                    <Input
                      id="tokenId"
                      value={listForm.tokenId}
                      onChange={e => setListForm(p => ({ ...p, tokenId: e.target.value }))}
                      placeholder="1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      value={listForm.price}
                      onChange={e => setListForm(p => ({ ...p, price: e.target.value }))}
                      placeholder="1000000"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expiry">Expiry (block height)</Label>
                    <Input
                      id="expiry"
                      value={listForm.expiry}
                      onChange={e => setListForm(p => ({ ...p, expiry: e.target.value }))}
                      placeholder={overview?.blockHeight != null ? String(overview.blockHeight + 100) : '50000'}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Payment type</Label>
                  <Select
                    value={listForm.paymentType}
                    onValueChange={v => setListForm(p => ({ ...p, paymentType: v as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stx">STX</SelectItem>
                      <SelectItem value="ft">Fungible token (FT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {listForm.paymentType === 'ft' && (
                  <div className="grid gap-2">
                    <Label htmlFor="paymentAssetContract">Payment FT contract (ST… .contract)</Label>
                    <Input
                      id="paymentAssetContract"
                      value={listForm.paymentAssetContract}
                      onChange={e => setListForm(p => ({ ...p, paymentAssetContract: e.target.value }))}
                      placeholder="ST….token"
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="taker">Private taker (optional ST… address)</Label>
                  <Input
                    id="taker"
                    value={listForm.taker}
                    onChange={e => setListForm(p => ({ ...p, taker: e.target.value }))}
                    placeholder="ST…"
                  />
                </div>

                <Button onClick={listAsset}>Submit listing</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fulfil">
            <Card>
              <CardHeader>
                <CardTitle>Fulfil a listing</CardTitle>
                <CardDescription>Buy an active listing.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fulfilListingId">Listing ID</Label>
                  <Input
                    id="fulfilListingId"
                    value={fulfilForm.listingId}
                    onChange={e => setFulfilForm(p => ({ ...p, listingId: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fulfilNftAssetContract">NFT asset contract</Label>
                  <Input
                    id="fulfilNftAssetContract"
                    value={fulfilForm.nftAssetContract}
                    onChange={e => setFulfilForm(p => ({ ...p, nftAssetContract: e.target.value }))}
                    placeholder="ST….your-nft"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Payment type</Label>
                  <Select
                    value={fulfilForm.paymentType}
                    onValueChange={v => setFulfilForm(p => ({ ...p, paymentType: v as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stx">STX</SelectItem>
                      <SelectItem value="ft">Fungible token (FT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {fulfilForm.paymentType === 'ft' && (
                  <div className="grid gap-2">
                    <Label htmlFor="fulfilPaymentAssetContract">Payment FT contract</Label>
                    <Input
                      id="fulfilPaymentAssetContract"
                      value={fulfilForm.paymentAssetContract}
                      onChange={e => setFulfilForm(p => ({ ...p, paymentAssetContract: e.target.value }))}
                      placeholder="ST….token"
                    />
                  </div>
                )}
                <Button onClick={fulfilListing}>Fulfil</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cancel">
            <Card>
              <CardHeader>
                <CardTitle>Cancel a listing</CardTitle>
                <CardDescription>Only the maker can cancel their listing.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cancelListingId">Listing ID</Label>
                  <Input
                    id="cancelListingId"
                    value={cancelForm.listingId}
                    onChange={e => setCancelForm(p => ({ ...p, listingId: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cancelNftAssetContract">NFT asset contract</Label>
                  <Input
                    id="cancelNftAssetContract"
                    value={cancelForm.nftAssetContract}
                    onChange={e => setCancelForm(p => ({ ...p, nftAssetContract: e.target.value }))}
                    placeholder="ST….your-nft"
                  />
                </div>
                <Button onClick={cancelListing} variant="destructive">
                  Cancel listing
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="whitelist">
            <Card>
              <CardHeader>
                <CardTitle>Whitelisting</CardTitle>
                <CardDescription>
                  Only the contract owner can whitelist asset contracts. Your wallet must match the owner.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {!isOwner && (
                  <Alert variant="destructive">
                    <AlertTitle>Not authorized</AlertTitle>
                    <AlertDescription>
                      Connect with the owner wallet to whitelist contracts.
                    </AlertDescription>
                  </Alert>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="assetContract">Asset contract to whitelist</Label>
                  <Input
                    id="assetContract"
                    value={whitelistForm.assetContract}
                    onChange={e => setWhitelistForm(p => ({ ...p, assetContract: e.target.value }))}
                    placeholder="ST….contract"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={whitelistForm.status}
                    onValueChange={v => setWhitelistForm(p => ({ ...p, status: v as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Whitelisted</SelectItem>
                      <SelectItem value="false">Unwhitelisted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={setWhitelisted} disabled={!isOwner}>
                  Update whitelist
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
