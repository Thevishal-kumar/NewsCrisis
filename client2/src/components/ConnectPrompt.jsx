import React, { useContext } from 'react';
import { WalletContext } from '../context/WalletContext.jsx';
import { ShieldCheck } from 'lucide-react';

const ConnectPrompt = () => {
  const { connectWallet } = useContext(WalletContext);

  return (
    <div className="bg-slate-800 border border-blue-500/50 rounded-lg text-center p-8 max-w-lg mx-auto">
      <ShieldCheck className="h-16 w-16 text-blue-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">Join the Aegis Protocol</h2>
      <p className="text-slate-400 mb-6">
        Connect your secure digital wallet to verify information, participate in community voting,
        and help defend against misinformation during this critical time.
      </p>
      <button
        onClick={connectWallet}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
      >
        Establish Secure Identity
      </button>
    </div>
  );
};

export default ConnectPrompt;
