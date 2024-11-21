// File: components/BuySTX.js

import React, { useState } from 'react';

const BuySTX = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [stxAmount, setStxAmount] = useState('');
  const [currency, setCurrency] = useState('USD');

  const handleConnectWallet = () => {
    // Logic to connect wallet
    setIsConnected(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-bold mb-4">Buy STX with Card</h1>
      {!isConnected ? (
        <button
          onClick={handleConnectWallet}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="stxAmount" className="block text-sm font-medium">
              STX Amount:
            </label>
            <input
              type="number"
              id="stxAmount"
              value={stxAmount}
              onChange={(e) => setStxAmount(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium">
              Currency:
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="USD">USD</option>
              <option value="NGN">Naira</option>
              {/* Add more currencies as needed */}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuySTX;