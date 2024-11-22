// File: components/BuySTX.js

import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './userContext';

const BuySTX = () => {
  const { userData, tokens } = useContext(UserContext)
  const isConnected = !!userData && !!tokens && tokens.length > 0
  const [stxAmount, setStxAmount] = useState('');
  const [currency, setCurrency] = useState('USD');

  

  const handleConnectWallet = () => {
    // Logic to connect wallet
    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Buy STX with Card</h1>
      {!isConnected ? (
        <button
          onClick={handleConnectWallet}
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-8 space-y-6 w-full max-w-md">
          <div>
            <label htmlFor="stxAmount" className="block text-sm font-medium text-gray-700">
              STX Amount
            </label>
            <input
              type="number"
              id="stxAmount"
              value={stxAmount}
              onChange={(e) => setStxAmount(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="USD">USD</option>
              <option value="NGN">Naira</option>
              {/* Add more currencies as needed */}
            </select>
          </div>
          <button
            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Buy STX
          </button>
        </div>
      )}
    </div>
  );
}

export default BuySTX;