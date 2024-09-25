import { useState } from "react";
import { Button } from "./ui/button"; // Assume you have a Button component

export function Swap() {
  const [connected, setConnected] = useState(false);

  const handleConnectWallet = () => {
    // Mock wallet connection function
    setConnected(true);
  };




  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0F0F0F] text-white">
      <main className="w-full max-w-md p-6 bg-[#171717] rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Swap</h2>
        <p className="text-gray-400 mb-4">Exchange assets on Stacks.</p>
        
        <div className="bg-[#1E1E1E] p-4 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-400">From</div>
            <div className={`text-sm ${connected ? 'text-green-500' : 'text-red-500'}`}>
              {connected ? 'Connected' : 'Not Connected'}
            </div>
          </div>
          <div className="bg-[#2D2D2D] p-3 rounded-lg mb-4">
            <select className="bg-transparent text-white w-full mb-2">
              <option>Stacks</option>
              <option>ALEX</option> {/* Example of tokens in Stacks ecosystem */}
              <option>STX</option>
            </select>
            <input
              type="number"
              placeholder="0.0000"
              className="bg-transparent text-white w-full"
            />
          </div>

          <div className="bg-[#2D2D2D] p-3 rounded-lg mb-4">
            <select className="bg-transparent text-white w-full mb-2">
              <option>xUSD</option>
              <option>ALEX</option>
              <option>STX</option>
            </select>
            <input
              type="number"
              placeholder="0.0000"
              className="bg-transparent text-white w-full"
            />
          </div>

          <div className="bg-[#2D2D2D] p-3 rounded-lg mb-4 text-gray-400">
            <p>Expected price on Stacks</p>
            <p>Slippage -</p>
          </div>

          <Button 
            className="w-full bg-[#9B51E0] text-white font-medium py-2 px-4 rounded-lg" 
            onClick={handleConnectWallet}
          >
            {connected ? 'Swap STX for xUSD' : 'Connect Wallet'}
          </Button>
        </div>
      </main>
    </div>
  );
}
