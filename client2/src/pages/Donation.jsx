import React, { useState, useEffect, useContext } from 'react';
import { Heart, Users, Zap, Globe, ExternalLink, Award, Sparkles } from 'lucide-react';
import { ethers } from 'ethers';
import { WalletContext } from '../context/WalletContext.jsx'; // Ensure path is correct


const mockDonationPools = [
  { id: 1, title: 'Emergency Relief Fund', description: 'Rapid response for disasters and crises.', raised: 75000, target: 100000, icon: Zap, color: 'text-red-400' },
  { id: 2, title: 'Community Resilience Program', description: 'Building stronger, more informed communities.', raised: 45000, target: 80000, icon: Users, color: 'text-green-400' },
  { id: 3, title: 'Global Information Integrity', description: 'Fighting misinformation and promoting truth.', raised: 32000, target: 60000, icon: Globe, color: 'text-blue-400' },
];

const mockRecentDonations = [
    { donor: '0x123...abc', amount: '10 USDC', fund: 'Emergency Relief Fund', time: '2m ago' },
    { donor: '0x456...def', amount: '50 USDC', fund: 'Community Resilience Program', time: '5m ago' },
    { donor: '0x789...ghi', amount: '25 USDC', fund: 'Global Information Integrity', time: '12m ago' },
];

// --- MAIN DONATION COMPONENT ---
export default function Donation() {
  const { account, signer, connectWallet } = useContext(WalletContext);
  const [donationPools, setDonationPools] = useState([]);
  const [userDonations, setUserDonations] = useState({}); // Tracks which funds the user has donated to

  // Fetch initial data (mocked for this example)
  useEffect(() => {
    if (account) {
      // In a real app: fetchDonationPoolsFromContract();
      setDonationPools(mockDonationPools);
    }
  }, [account]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };

  const getProgressPercentage = (raised, target) => {
    return Math.min((raised / target) * 100, 100);
  };

  const handleDonate = async (poolId, amountToDonate) => {
    if (!signer) {
      alert("Please ensure your wallet is connected.");
      return;
    }
    // This is a placeholder for the actual transaction
    console.log(`Initiating donation of ${amountToDonate} from ${account} to pool ${poolId}`);
    alert(`Thank you for your donation to pool ${poolId}! In a real app, your wallet would now open to confirm the transaction.`);
    
    // Simulate successful donation for UI update
    setUserDonations(prev => ({ ...prev, [poolId]: true }));
  };

  const handleMintNFT = (poolId, poolTitle) => {
    alert(`You are now minting your "Proof-of-Help" NFT for the ${poolTitle} fund!`);
    // In a real app: call a smart contract function like `mintProofOfHelpNFT(poolId)`
  };

  // Render a prompt if the wallet is not connected
  if (!account) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Humanitarian Aid Portal</h1>
        <div className="bg-slate-800 border-2 border-dashed border-blue-500 rounded-lg p-12">
          <Heart className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Join the Movement</h2>
          <p className="text-slate-400 mb-6">Connect your wallet to support verified global relief efforts.</p>
          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  // Main component render for connected users
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Humanitarian Aid Portal</h1>
        <p className="text-slate-400 mt-2">Supporting global relief efforts through transparent, verified donations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Donation Pools Section */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-6">Active Donation Funds</h2>
          <div className="space-y-6">
            {donationPools.map((pool) => {
              const Icon = pool.icon;
              const progressPercentage = getProgressPercentage(pool.raised, pool.target);
              const hasDonated = userDonations[pool.id];

              return (
                <div key={pool.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700 transition-all duration-200">
                  <div className="flex items-center mb-4">
                    <Icon className={`h-8 w-8 ${pool.color}`} />
                    <h3 className="text-lg font-semibold text-white ml-3">{pool.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{pool.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white">{formatCurrency(pool.raised)} of {formatCurrency(pool.target)}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                  </div>
                  
                  {/* --- INTERACTIVE BUTTON LOGIC --- */}
                  {hasDonated ? (
                    <button 
                      onClick={() => handleMintNFT(pool.id, pool.title)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Award className="h-4 w-4 inline mr-2" />
                      Mint Your "Proof-of-Help" NFT
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleDonate(pool.id, '10 USDC')} // Example donation amount
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Heart className="h-4 w-4 inline mr-2" />
                      Donate Now
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Activity Feed Sidebar */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold text-white mb-6">Live Donations</h2>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 space-y-4">
            {mockRecentDonations.map((donation, index) => (
              <div key={index} className="flex items-center text-sm">
                <div className="bg-slate-700 p-2 rounded-full mr-3">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white">
                    <span className="font-mono">{donation.donor}</span> donated <span className="font-semibold">{donation.amount}</span>
                  </p>
                  <p className="text-slate-400 text-xs">to {donation.fund} • {donation.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
