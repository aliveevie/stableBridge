// components/NFTCard.tsx
import { FC } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NFT } from '@/types/index';

interface NFTCardProps {
  nft: NFT;
  onPurchase: (nft: NFT) => void;
}

export const NFTCard: FC<NFTCardProps> = ({ nft, onPurchase }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="w-full h-48 rounded-lg mb-4">
          <img 
            src={nft.image} 
            alt={nft.name} 
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <CardTitle>{nft.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{nft.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">{nft.price} STX</span>
          <Button onClick={() => onPurchase(nft)} variant="default">
            Purchase NFT
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};