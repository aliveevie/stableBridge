/**
 * Wallet Modal Component
 */
'use client';
export function WalletModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Select Wallet</h2>
        <div className="space-y-4">
          <button className="w-full p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors">Leather</button>
          <button className="w-full p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors">Xverse</button>
        </div>
        <button onClick={onClose} className="mt-6 w-full text-gray-400 hover:text-white">Close</button>
      </div>
    </div>
  );
}
