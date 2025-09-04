import React, { useState, useEffect, useContext } from 'react';
import { Check, X, ThumbsUp, ThumbsDown, Loader, ShieldQuestion } from 'lucide-react';
import { WalletContext } from '../context/WalletContext.jsx'; 

// --- Configuration ---
const API_BASE_URL = 'http://localhost:8000/api/v1'; // Your backend URL
const VOTE_THRESHOLD = 1; // The number of votes needed to finalize an item

export default function Verification() {
  const [verificationQueue, setVerificationQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State to track which items the user has already voted on, stored in localStorage
  const [votedItems, setVotedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('votedItems');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Get wallet state from the global context
  const { account, connectWallet } = useContext(WalletContext);

  // Effect to fetch the queue items when the component loads
  useEffect(() => {
    const fetchQueueItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("📡 Fetching reports from:", `${API_BASE_URL}/reports`);
        const res = await fetch(`${API_BASE_URL}/reports`);
        console.log("📡 Response status:", res.status);

        if (!res.ok) {
          throw new Error('Failed to fetch data from the server. Ensure the backend is running.');
        }

        const data = await res.json();
        console.log("📡 Data received:", data);

        const allReports = data.items || [];

        // --- CRUCIAL FIX ---
        // Filter the fetched reports to only include those with a 'pending' status.
        // This ensures the queue only shows items that actually need verification.
        const pendingReports = allReports.filter(report => report.status === 'pending');
        
        console.log(`✅ Found ${pendingReports.length} items pending verification.`);
        setVerificationQueue(pendingReports);

      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (account) {
        fetchQueueItems();
    } else {
        // If no account is connected, don't try to fetch. Show the connect prompt instead.
        setIsLoading(false);
    }
  }, [account]); // Re-fetch when the user connects their wallet

  // Handler for casting a vote on an item
  const handleVote = async (id, voteType) => {
    if (!account) {
      alert("Please connect your wallet to participate in voting.");
      return;
    }
    if (votedItems[id]) {
      alert("You have already voted on this item.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/reports/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType, userId: account }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Failed to cast vote.`);
      }
      
      const updatedReport = await res.json();

      // Mark this item as voted in local state and localStorage
      const newVotedItems = { ...votedItems, [id]: true };
      setVotedItems(newVotedItems);
      localStorage.setItem('votedItems', JSON.stringify(newVotedItems));

      // Update the specific item in the queue with the new vote counts
      setVerificationQueue(currentQueue =>
        currentQueue.map(item => (item._id === id ? updatedReport : item))
      );

      // If the vote finalized the item's status, remove it from the queue after a delay
      if (updatedReport.status !== 'pending') {
        setTimeout(() => {
          setVerificationQueue(currentQueue => currentQueue.filter(item => item._id !== id));
        }, 2000); // 2-second delay to show the final status
      }
    } catch (err) {
      setError(`Action failed: ${err.message}. Please try again.`);
    }
  };

  // --- JSX Rendering ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Community Verification Queue</h1>
        <p className="text-slate-400 mt-2">Help moderate content by voting. Each item requires {VOTE_THRESHOLD} vote(s) to be finalized.</p>
        <div className="mt-4">
          <span className="text-slate-400">Items Pending Review:</span>
          <span className="text-white font-semibold ml-2">{isLoading ? '-' : verificationQueue.length}</span>
        </div>
        {error && <p className="text-red-500 mt-4 text-center bg-red-900/50 p-3 rounded-lg">{error}</p>}
      </div>

      {/* Show connect prompt if wallet is not connected */}
      {!account && !isLoading && (
        <div className="bg-slate-800 border border-blue-500/50 rounded-lg text-center p-8">
          <ShieldQuestion className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet to Participate</h2>
          <p className="text-slate-400 mb-6">Establish your secure identity to vote on pending items.</p>
          <button onClick={connectWallet} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
            Connect Wallet
          </button>
        </div>
      )}

      <div className="space-y-6 mt-6">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader className="h-8 w-8 text-blue-500 animate-spin" /></div>
        ) : verificationQueue.length === 0 && account ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
            <Check className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white">Queue is Empty</h3>
            <p className="text-slate-400">No items currently require verification.</p>
          </div>
        ) : (
          verificationQueue.map((item) => {
            const approveVotes = item.approveVotes?.length || 0;
            const rejectVotes = item.rejectVotes?.length || 0;
            const totalVotes = approveVotes + rejectVotes;
            const hasVoted = votedItems[item._id];
            const isFinalized = item.status !== 'pending';
            const finalStatus = isFinalized ? (item.status === 'approved' ? 'Approved' : 'Rejected') : null;

            return (
              <div key={item._id} className={`bg-slate-800 rounded-lg p-6 border border-slate-700 transition-opacity duration-500 ${isFinalized ? 'opacity-50' : 'hover:border-blue-500/50'}`}>
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 lg:mr-6">
                    <p className="text-white mb-4 leading-relaxed break-words">{item.source}</p>
                    <div className="flex items-center gap-x-6">
                      <span className="text-xs font-bold text-slate-500">ML Confidence Score: ({item.score.toFixed(1)}%)</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 mt-4 lg:mt-0 lg:w-48 flex-shrink-0">
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full ${isFinalized ? 'bg-blue-500' : 'bg-green-500'}`} style={{ width: `${Math.min((totalVotes / VOTE_THRESHOLD) * 100, 100)}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <button onClick={() => handleVote(item._id, 'approve')} disabled={hasVoted || isFinalized || !account} className="flex items-center gap-2 text-green-400 disabled:text-slate-500 disabled:cursor-not-allowed">
                        <ThumbsUp className="h-5 w-5" />
                        <span>{approveVotes}</span>
                      </button>
                      <span className="text-slate-400">{totalVotes} / {VOTE_THRESHOLD} vote(s)</span>
                      <button onClick={() => handleVote(item._id, 'reject')} disabled={hasVoted || isFinalized || !account} className="flex items-center gap-2 text-red-400 disabled:text-slate-500 disabled:cursor-not-allowed">
                        <span>{rejectVotes}</span>
                        <ThumbsDown className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="text-center text-xs h-4">
                      {finalStatus ? (
                        <p className={`font-semibold ${finalStatus === 'Approved' ? 'text-green-400' : 'text-red-400'}`}>{finalStatus}</p>
                      ) : (
                        hasVoted && <p className="text-blue-400">You have voted.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
