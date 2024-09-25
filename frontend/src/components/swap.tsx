import { ClientProvider } from "@micro-stacks/react";

export function Swap() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0F0F0F] text-white">
      <main className="w-full max-w-5xl p-6 md:p-10 bg-[#171717] rounded-2xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div className="bg-[#1E1E1E] p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
              <p className="text-gray-400 mb-4">
                Synapse is the most widely used, extensible, and secure cross-chain communications network.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-[#1E1E1E] p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Bridge</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="from-network" className="text-sm text-gray-400">
                    From Network
                  </label>
                  <select id="from-network" className="bg-[#2D2D2D] text-white rounded-lg p-2">
                    <option>Network 1</option>
                  </select>
                  <input
                    type="number"
                    placeholder="0.0000"
                    className="bg-[#2D2D2D] text-white rounded-lg p-2 mt-2"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="to-network" className="text-sm text-gray-400">
                    To Network
                  </label>
                  <select id="to-network" className="bg-[#2D2D2D] text-white rounded-lg p-2">
                    <option>Network 2</option>
                  </select>
                  <input
                    type="number"
                    placeholder="0.0000"
                    className="bg-[#2D2D2D] text-white rounded-lg p-2 mt-2"
                  />
                </div>
              </div>
              <button className="bg-[#9B51E0] text-white font-medium py-2 px-4 rounded-lg mt-6 w-full">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
