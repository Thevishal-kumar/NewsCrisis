import React, { useState, useEffect, useContext } from 'react';
import { 
  Heart, 
  Users, 
  Zap, 
  Globe, 
  Award, 
  Sparkles, 
  Wallet, 
  ArrowRight,
  ShieldCheck,
  Activity,
  History,
  TrendingUp,
  Lock
} from 'lucide-react';
import { WalletContext } from '../context/WalletContext.jsx'; 

// --- Mock Data ---
const INITIAL_POOLS = [
  { 
    id: 1, 
    title: 'Emergency Relief Protocol', 
    description: 'Rapid response liquidity layer for immediate disaster mitigation.', 
    raised: 75000, 
    target: 100000, 
    icon: Zap, 
    color: 'text-red-400', 
    bg: 'bg-red-400/10',
    border: 'border-red-400/20'
  },
  { 
    id: 2, 
    title: 'Resilience Node Uplink', 
    description: 'Infrastructure hardening and community education networks.', 
    raised: 45000, 
    target: 80000, 
    icon: Users, 
    color: 'text-emerald-400', 
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20'
  },
  { 
    id: 3, 
    title: 'Truth Integrity Grid', 
    description: 'Funding independent verification nodes to combat misinformation.', 
    raised: 32000, 
    target: 60000, 
    icon: Globe, 
    color: 'text-blue-400', 
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20'
  },
];

// --- Sub-Component: Donation Card ---
const DonationCard = ({ pool, onDonate, userDonationStatus }) => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const Icon = pool.icon;
  const progress = Math.min((pool.raised / pool.target) * 100, 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) return;
    
    setIsProcessing(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 2000));
    onDonate(pool.id, parseFloat(amount));
    setIsProcessing(false);
    setAmount('');
  };

  return (
    <div className={`group relative bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(30,58,138,0.2)]`}>
      {/* Glow Effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-transparent via-transparent to-${pool.color.split('-')[1]}/5 rounded-2xl pointer-events-none`}></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${pool.bg} border ${pool.border}`}>
              <Icon className={`h-6 w-6 ${pool.color}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">{pool.title}</h3>
              <p className="text-xs text-slate-400 font-mono mt-1">OP_CODE: {pool.id.toString().padStart(4, '0')}</p>
            </div>
          </div>
          {userDonationStatus && (
            <div className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-full flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" />
              <span className="text-[10px] font-bold text-amber-200 uppercase tracking-wider">Backer</span>
            </div>
          )}
        </div>

        <p className="text-slate-400 text-sm mb-6 leading-relaxed border-l-2 border-slate-700 pl-3">
          {pool.description}
        </p>

        {/* Progress Section */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">FUNDING STATUS</span>
            <span className="text-white font-bold">
              ${pool.raised.toLocaleString()} / ${pool.target.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/5">
            <div 
              className={`h-full rounded-full ${pool.color.replace('text', 'bg')} shadow-[0_0_10px_currentColor] transition-all duration-1000 ease-out`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Action Area */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1 group/input">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
            <input 
              type="number" 
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isProcessing}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-7 pr-4 text-white font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
            />
          </div>
          <button 
            type="submit" 
            disabled={isProcessing || !amount}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 shadow-lg
              ${isProcessing 
                ? 'bg-slate-800 text-slate-500 cursor-wait' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/20 hover:shadow-blue-900/40'
              }`}
          >
            {isProcessing ? (
              <span className="animate-pulse">TX...</span>
            ) : (
              <>
                DEPLOY <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Sub-Component: Live Feed Item ---
const FeedItem = ({ tx }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-white/5 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="bg-slate-800 p-2 rounded-full">
      <Sparkles className="h-3 w-3 text-yellow-400" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-xs font-mono text-blue-400 truncate max-w-[100px]">{tx.donor}</span>
        <span className="text-[10px] text-slate-500">{tx.time}</span>
      </div>
      <p className="text-xs text-slate-300">
        Deployed <span className="font-bold text-white">${tx.amount}</span> to <span className="text-slate-400">{tx.fund}</span>
      </p>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
export default function Donation() {
  const { account, connectWallet } = useContext(WalletContext);
  const [pools, setPools] = useState(INITIAL_POOLS);
  const [userDonations, setUserDonations] = useState({});
  const [recentTx, setRecentTx] = useState([
    { donor: '0x12...3A4', amount: '150', fund: 'Emergency Relief Protocol', time: '2m ago' },
    { donor: '0x8B...9C2', amount: '500', fund: 'Resilience Node Uplink', time: '5m ago' },
  ]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Logic
  const handleDonate = (poolId, amount) => {
    // 1. Update Pool Progress locally
    setPools(current => current.map(p => 
      p.id === poolId ? { ...p, raised: p.raised + amount } : p
    ));

    // 2. Mark user as donor for that pool
    setUserDonations(prev => ({ ...prev, [poolId]: true }));

    // 3. Add to live feed
    const newTx = {
      donor: account ? `${account.slice(0,4)}...${account.slice(-3)}` : '0xAn...on',
      amount: amount.toString(),
      fund: pools.find(p => p.id === poolId)?.title || 'Unknown Fund',
      time: 'Just now'
    };
    setRecentTx(prev => [newTx, ...prev.slice(0, 4)]); // Keep last 5
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 relative overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
               backgroundSize: '40px 40px',
               maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
             }}>
        </div>
      </div>

      <div className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
              <Heart className="h-10 w-10 text-pink-500 fill-pink-500/20" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Aid Protocol Gateway
              </span>
            </h1>
            <p className="text-slate-400 mt-2 pl-14 font-mono text-sm">
              Deploy liquidity to verified humanitarian nodes via smart contracts.
            </p>
          </div>
          
          <div className="mt-6 md:mt-0 flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-lg border border-white/10">
             <TrendingUp className="h-5 w-5 text-emerald-400" />
             <div className="flex flex-col text-right">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Global Liquidity Deployed</span>
                <span className="text-xl font-mono font-bold text-white leading-none">$152,000</span>
             </div>
          </div>
        </div>

        {/* --- Locked State --- */}
        {!account ? (
          <div className="bg-slate-900/40 backdrop-blur-xl border border-blue-500/30 rounded-2xl text-center p-16 relative overflow-hidden group max-w-3xl mx-auto mt-12">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <Lock className="h-10 w-10 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Secure Gateway Locked</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Connect your wallet to execute humanitarian transactions and mint Proof-of-Help assets.
              </p>
              <button 
                onClick={connectWallet} 
                className="group relative inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
              >
                <Wallet className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Initialize Connection
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Active Funds */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck className="h-5 w-5 text-blue-400" />
                 <h2 className="text-xl font-bold text-white">Active Funding Nodes</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {pools.map(pool => (
                  <DonationCard 
                    key={pool.id} 
                    pool={pool} 
                    onDonate={handleDonate} 
                    userDonationStatus={userDonations[pool.id]}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Live Feed & Wallet Stats */}
            <div className="space-y-6">
              
              {/* Wallet Overview Panel */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800/80 rounded-2xl p-6 border border-white/10 shadow-xl">
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Wallet className="h-4 w-4" /> Operator Wallet
                 </h3>
                 <div className="mb-6">
                    <p className="text-xs text-slate-500 font-mono mb-1">CONNECTED ADDRESS</p>
                    <p className="text-emerald-400 font-mono text-sm bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 truncate">
                       {account}
                    </p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                       <p className="text-[10px] text-slate-500 mb-1">BALANCE (ETH)</p>
                       <p className="text-white font-mono font-bold">1.45 ETH</p>
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                       <p className="text-[10px] text-slate-500 mb-1">IMPACT SCORE</p>
                       <p className="text-purple-400 font-mono font-bold">850 XP</p>
                    </div>
                 </div>
              </div>

              {/* Live Feed Panel */}
              <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-400" /> Network Activity
                  </h3>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                </div>
                
                <div className="space-y-3 relative">
                   {/* Timeline Line */}
                   <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-800 -z-10"></div>
                   
                   {recentTx.map((tx, idx) => (
                      <FeedItem key={idx} tx={tx} />
                   ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}