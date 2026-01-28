import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  Check,
  ThumbsUp,
  ThumbsDown,
  Loader,
  ShieldCheck,
  Users,
  AlertTriangle,
  ShieldQuestion,
  Unlock,
  CheckCircle2,
  XCircle,
  Clock,
  Filter
} from 'lucide-react';
import { WalletContext } from '../context/WalletContext.jsx';
import { ReportsContext } from '../context/ReportsContext.jsx';

const API_BASE_URL = 'https://newsforge-u0s8.onrender.com/api/v1';
 
export default function Verification() {
  const { account, connectWallet } = useContext(WalletContext);
  const { reports, setReports } = useContext(ReportsContext);

  const [verificationQueue, setVerificationQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'pending', 'history'

  // Store vote type per report
  const [votedItems, setVotedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('votedItems');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch backend reports
  useEffect(() => {
    const fetchBackendReports = async () => {
      if (!account) return setIsLoading(false);
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}/reports`);
        if (!res.ok) throw new Error('Failed to fetch reports');
        const data = await res.json();
        const backendReports = data.items || [];

        const combined = [...backendReports, ...reports];
        // Deduplicate
        const unique = Array.from(new Map(combined.map(r => [r._id, r])).values());
        // Sort: Pending first, then by Date descending
        const sorted = unique.sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (a.status !== 'pending' && b.status === 'pending') return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setVerificationQueue(sorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBackendReports();
  }, [account, reports]);

  // Vote handler
  const handleVote = async (id, voteType) => {
    if (!account) return;
    if (votedItems[id]) return;

    try {
      const res = await fetch(`${API_BASE_URL}/reports/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType, userId: account }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Vote failed.');
      }

      const updatedReport = await res.json();

      // Save locally
      const newVotedItems = { ...votedItems, [id]: voteType };
      setVotedItems(newVotedItems);
      localStorage.setItem('votedItems', JSON.stringify(newVotedItems));

      // Update UI (Don't remove from list, just update status)
      setVerificationQueue(queue =>
        queue.map(item => (item._id === id ? updatedReport : item))
      );

    } catch (err) {
      setError(`Action failed: ${err.message}`);
    }
  };

  const filteredReports = useMemo(() => {
    if (filterMode === 'pending') return verificationQueue.filter(r => r.status === 'pending');
    if (filterMode === 'history') return verificationQueue.filter(r => r.status !== 'pending');
    return verificationQueue;
  }, [verificationQueue, filterMode]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 pt-24 relative overflow-hidden font-sans selection:bg-blue-500/30">

      {/* Background */}
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

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/5 pb-6 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
              <ShieldCheck className="h-10 w-10 text-emerald-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Consensus Ledger
              </span>
            </h1>
            <p className="text-slate-400 mt-2 pl-14 font-mono text-sm">
              Review pending intelligence and access the full verification history.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-xl border border-white/10">
            {['all', 'pending', 'history'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filterMode === mode
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {mode === 'all' ? 'All Intel' : mode}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 animate-pulse">
            <AlertTriangle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Locked State */}
        {!account && !isLoading && (
          <div className="bg-slate-900/40 backdrop-blur-xl border border-blue-500/30 rounded-2xl text-center p-16 relative overflow-hidden group max-w-3xl mx-auto mt-12">
            <div className="relative z-10">
              <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <ShieldQuestion className="h-10 w-10 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Connect your wallet to view the verification ledger and participate in voting.
              </p>
              <button
                onClick={connectWallet}
                className="group relative inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all"
              >
                <Unlock className="h-4 w-4" /> Connect Wallet
              </button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="h-10 w-10 text-blue-500 animate-spin mb-4" />
              <p className="text-slate-500 font-mono text-sm animate-pulse">Loading Ledger...</p>
            </div>
          ) : filteredReports.length === 0 && account ? (
            <div className="text-center py-20 text-slate-500">
              <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No reports found for this filter.</p>
            </div>
          ) : (
            filteredReports.map((item, index) => {
              const approveVotes = item.approveVotes || 0;
              const rejectVotes = item.rejectVotes || 0;
              const totalVotes = approveVotes + rejectVotes;
              const hasVoted = votedItems[item._id];

              // Status Flags
              const isPending = item.status === 'pending';
              const isApproved = item.status === 'approved';
              const isRejected = item.status === 'rejected';

              const progressPercent = Math.min((totalVotes / 5) * 100, 100); // Assuming 5 is threshold visual cap

              return (
                <div
                  key={item._id}
                  className={`relative bg-slate-900/60 backdrop-blur-lg rounded-2xl p-0 border transition-all duration-500 group
                    ${isPending ? 'border-white/10 hover:border-blue-500/30' :
                      isApproved ? 'border-emerald-500/20 bg-emerald-950/10' :
                        'border-red-500/20 bg-red-950/10'}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Status Strip */}
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-slate-800 rounded-l-2xl overflow-hidden">
                    <div className={`h-full w-full ${isApproved ? 'bg-emerald-500' : isRejected ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                  </div>

                  <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-stretch gap-8 pl-8">

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        {isPending && (
                          <span className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded text-[10px] font-bold uppercase border border-blue-500/20">
                            <Clock className="h-3 w-3" /> Active Vote
                          </span>
                        )}
                        {isApproved && (
                          <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded text-[10px] font-bold uppercase border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" /> Verified Real
                          </span>
                        )}
                        {isRejected && (
                          <span className="flex items-center gap-1.5 bg-red-500/10 text-red-400 px-2.5 py-1 rounded text-[10px] font-bold uppercase border border-red-500/20">
                            <XCircle className="h-3 w-3" /> Flagged Fake
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-500">ID: {item._id.slice(-6)}</span>
                      </div>

                      <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 font-mono text-sm text-slate-300 leading-relaxed">
                        "{item.source}"
                      </div>
                    </div>

                    {/* Voting / Status Box */}
                    <div className="lg:w-72 flex flex-col justify-between bg-slate-900/50 rounded-xl p-5 border border-white/5">

                      {/* Stats */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-slate-400 uppercase">Community Consensus</span>
                          <span className="text-xs font-mono text-white">{totalVotes} Votes</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                          <div style={{ width: `${(approveVotes / (totalVotes || 1)) * 100}%` }} className="bg-emerald-500 h-full"></div>
                          <div style={{ width: `${(rejectVotes / (totalVotes || 1)) * 100}%` }} className="bg-red-500 h-full"></div>
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] text-slate-500">
                          <span className="text-emerald-400/80">{approveVotes} Safe</span>
                          <span className="text-red-400/80">{rejectVotes} Fake</span>
                        </div>
                      </div>

                      {/* Controls */}
                      {!isPending ? (
                        <div className={`p-3 rounded-lg text-center border ${isApproved ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                          <p className={`text-sm font-bold ${isApproved ? 'text-emerald-400' : 'text-red-400'}`}>
                            CONSENSUS REACHED
                          </p>
                          <p className="text-[10px] text-slate-500 uppercase mt-1">
                            Marked as {isApproved ? 'Authentic' : 'Misinformation'}
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={(e) => { e.preventDefault(); handleVote(item._id, 'approve') }}
                            disabled={hasVoted}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all 
                              ${votedItems[item._id] === 'approve'
                                ? 'bg-emerald-600 border-emerald-400 text-white opacity-100'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400'
                              } disabled:opacity-50`}
                          >
                            <ThumbsUp className="h-5 w-5 mb-1" />
                            <span className="text-[10px] font-bold">VERIFY</span>
                          </button>

                          <button
                            onClick={(e) => { e.preventDefault(); handleVote(item._id, 'reject'); }}
                            disabled={hasVoted}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all 
                              ${votedItems[item._id] === 'reject'
                                ? 'bg-red-600 border-red-400 text-white opacity-100'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-red-500/50 hover:text-red-400'
                              } disabled:opacity-50`}
                          >
                            <ThumbsDown className="h-5 w-5 mb-1" />
                            <span className="text-[10px] font-bold">REJECT</span>
                          </button>
                        </div>
                      )}

                      {hasVoted && isPending && (
                        <div className="mt-3 text-center text-[10px] text-blue-400 flex items-center justify-center gap-1">
                          <Check className="h-3 w-3" /> You voted on this
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}