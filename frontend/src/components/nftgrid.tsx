// components/NFTGrid.tsx
import { FC } from 'react';
import { NFTCard } from './nftcard';
import { NFT } from '../types';

interface NFTGridProps {
  nfts: NFT[];
  onPurchase: (nft: NFT) => void;
}

export const NFTGrid: FC<NFTGridProps> = ({ nfts, onPurchase }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {nfts.map((nft) => (
        <NFTCard key={nft.id} nft={nft} onPurchase={onPurchase} />
      ))}
    </div>
  );
};