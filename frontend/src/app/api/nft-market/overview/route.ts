import { NextRequest, NextResponse } from 'next/server';
import { uintCV } from '@stacks/transactions';
import { getContractParts, NFT_MARKET_CONTRACT_ID } from '@/lib/stacks/contracts';
import { READ_ONLY_SENDER_ADDRESS, STACKS_NODE_API_URL } from '@/lib/stacks/nodeApi';
import { callReadOnlyFunction } from '@/lib/stacks/readOnly';

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

function clampInt(value: string | null, def: number, min: number, max: number) {
  const n = value ? Number.parseInt(value, 10) : def;
  if (!Number.isFinite(n)) return def;
  return Math.min(max, Math.max(min, n));
}

function cvToString(cv: any): string {
  if (!cv || typeof cv !== 'object') throw new Error('Invalid ClarityValue');
  if (cv.type === 'address') return String(cv.value);
  if (cv.type === 'contract') return String(cv.value);
  throw new Error(`Unsupported principal type: ${cv.type}`);
}

function cvToUintString(cv: any): string {
  if (!cv || typeof cv !== 'object' || cv.type !== 'uint') {
    throw new Error('Expected uint ClarityValue');
  }
  return (cv.value as bigint).toString();
}

function cvToOptionalPrincipal(cv: any): string | null {
  if (!cv || typeof cv !== 'object') throw new Error('Invalid ClarityValue');
  if (cv.type === 'none') return null;
  if (cv.type !== 'some') throw new Error(`Expected optional, got: ${cv.type}`);
  return cvToString(cv.value);
}

function cvToOptionalTuple(cv: any): any | null {
  if (!cv || typeof cv !== 'object') throw new Error('Invalid ClarityValue');
  if (cv.type === 'none') return null;
  if (cv.type !== 'some') throw new Error(`Expected optional, got: ${cv.type}`);
  if (cv.value?.type !== 'tuple') throw new Error('Expected tuple in (some ...)');
  return cv.value.value;
}

function tupleToListing(id: number, tuple: Record<string, any>): ListingDto {
  return {
    id,
    maker: cvToString(tuple.maker),
    taker: cvToOptionalPrincipal(tuple.taker),
    tokenId: cvToUintString(tuple['token-id']),
    nftAssetContract: cvToString(tuple['nft-asset-contract']),
    expiry: cvToUintString(tuple.expiry),
    price: cvToUintString(tuple.price),
    paymentAssetContract: cvToOptionalPrincipal(tuple['payment-asset-contract']),
  };
}

async function fetchBlockHeight(): Promise<number | null> {
  try {
    const res = await fetch(`${STACKS_NODE_API_URL}/v2/info`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json: any = await res.json();
    const height = json.stacks_tip_height ?? json.stacks_tip ?? json.tip_height;
    return typeof height === 'number' ? height : null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const offset = clampInt(url.searchParams.get('offset'), 0, 0, 10_000);
    const limit = clampInt(url.searchParams.get('limit'), 20, 1, 50);

    const { address, name } = getContractParts(NFT_MARKET_CONTRACT_ID);

    const [blockHeight, contractOwnerCv, listingNonceCv] = await Promise.all([
      fetchBlockHeight(),
      callReadOnlyFunction({
        nodeApiUrl: STACKS_NODE_API_URL,
        contractAddress: address,
        contractName: name,
        functionName: 'get-contract-owner',
        functionArgs: [],
        sender: READ_ONLY_SENDER_ADDRESS,
      }),
      callReadOnlyFunction({
        nodeApiUrl: STACKS_NODE_API_URL,
        contractAddress: address,
        contractName: name,
        functionName: 'get-listing-nonce',
        functionArgs: [],
        sender: READ_ONLY_SENDER_ADDRESS,
      }),
    ]);

    const listingNonce = cvToUintString(listingNonceCv as any);
    const listingNonceNumber = Number.parseInt(listingNonce, 10);
    const maxIdExclusive = Number.isFinite(listingNonceNumber) ? listingNonceNumber : 0;
    const start = Math.min(offset, Math.max(0, maxIdExclusive));
    const end = Math.min(start + limit, Math.max(0, maxIdExclusive));

    const listingIds = Array.from({ length: Math.max(0, end - start) }, (_, i) => start + i);
    const listingCvs = await Promise.all(
      listingIds.map(id =>
        callReadOnlyFunction({
          nodeApiUrl: STACKS_NODE_API_URL,
          contractAddress: address,
          contractName: name,
          functionName: 'get-listing',
          functionArgs: [uintCV(id)],
          sender: READ_ONLY_SENDER_ADDRESS,
        }).then(cv => ({ id, cv }))
      )
    );

    const listings: ListingDto[] = listingCvs
      .map(({ id, cv }) => {
        const tuple = cvToOptionalTuple(cv as any);
        return tuple ? tupleToListing(id, tuple) : null;
      })
      .filter(Boolean) as ListingDto[];

    const contractOwner = cvToString(contractOwnerCv as any);

    return NextResponse.json({
      contract: `${address}.${name}`,
      blockHeight,
      contractOwner,
      listingNonce,
      offset: start,
      limit,
      listings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to load marketplace overview' },
      { status: 500 }
    );
  }
}
