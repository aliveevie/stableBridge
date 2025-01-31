// pages/index.tsx
import { useCallback } from 'react';
import { NFTGrid } from '@/components/nftgrid';
import { NFT } from '@/types/index';
import { useConnect } from '@stacks/connect-react';

export default function Home() {
  const { doContractCall } = useConnect();

  // Sample NFT data - replace with your actual NFTs
  const sampleNFTs: NFT[] = [
    {
      id: '1',
      name: 'Cosmic Dreamer #1',
      description: 'A mesmerizing abstract digital artwork',
      image: '/nfts/cosmic-dreamer.svg',
      price: 100,
      owner: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    },
    // Add more NFTs here
  ];

  const handlePurchase = useCallback(async (nft: NFT) => {
    try {
      const options = {
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-trait',
        contractName: 'nft-marketplace',
        functionName: 'purchase-nft',
        functionArgs: [nft.id],
        postConditions: [],
      };
      await doContractCall(options);
    } catch (error) {
      console.error('Error purchasing NFT:', error);
    }
  }, [doContractCall]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            NFT Marketplace
          </h1>
        </div>
      </header>
      <main>
        <NFTGrid nfts={sampleNFTs} onPurchase={handlePurchase} />
      </main>
    </div>
  );
}