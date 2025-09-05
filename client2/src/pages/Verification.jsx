import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Check, ThumbsUp, ThumbsDown, Loader, ShieldQuestion } from 'lucide-react';
import { WalletContext } from '../context/WalletContext.jsx'; 
import { ReportsContext } from '../context/ReportsContext.jsx';

const API_BASE_URL = 'http://localhost:8000/api/v1';
const VOTE_THRESHOLD = 1;

export default function Verification() {
  const { account, connectWallet } = useContext(WalletContext);
  const { reports, setReports } = useContext(ReportsContext);

  const [verificationQueue, setVerificationQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Store vote type per report: { [reportId]: 'approve' | 'reject' }
  const [votedItems, setVotedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('votedItems');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

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
        const unique = Array.from(new Map(combined.map(r => [r._id, r])).values());
        const pending = unique.filter(r => r.status === 'pending');

        setVerificationQueue(pending);
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
    if (!account) return alert("Connect wallet to vote.");
    if (votedItems[id]) return alert("Already voted on this item.");

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

      // Save vote type locally
      const newVotedItems = { ...votedItems, [id]: voteType };
      setVotedItems(newVotedItems);
      localStorage.setItem('votedItems', JSON.stringify(newVotedItems));

      // Update queue and global context
      setVerificationQueue(queue =>
        queue.map(item => (item._id === id ? updatedReport : item))
      );

      setReports(current =>
        current.map(r => (r._id === id ? updatedReport : r))
      );

      // Remove from queue if finalized
      if (updatedReport.status !== 'pending') {
        setTimeout(() => {
          setVerificationQueue(queue => queue.filter(item => item._id !== id));
        }, 1500);
      }
    } catch (err) {
      setError(`Action failed: ${err.message}`);
    }
  };

  const pendingReports = useMemo(() => verificationQueue, [verificationQueue]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Community Verification Queue</h1>
        <p className="text-slate-400 mt-2">
          Help moderate content by voting. Each item requires {VOTE_THRESHOLD} vote(s) to finalize.
        </p>
        <div className="mt-4">
          <span className="text-slate-400">Items Review:</span>
          <span className="text-white font-semibold ml-2">
            {isLoading ? '-' : pendingReports.length}
          </span>
        </div>
        {error && <p className="text-red-500 mt-4 text-center bg-red-900/50 p-3 rounded-lg">{error}</p>}
      </div>

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
          <div className="flex justify-center py-20">
            <Loader className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : pendingReports.length === 0 && account ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
            <Check className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white">Queue is Empty</h3>
            <p className="text-slate-400">No items currently require verification.</p>
          </div>
        ) : (
          pendingReports.map(item => {
            const approveVotes = item.approveVotes || 0;
            const rejectVotes = item.rejectVotes || 0;
            const totalVotes = approveVotes + rejectVotes;
            const hasVoted = votedItems[item._id];
            const isFinalized = item.status !== 'pending';

            // Determine current majority
            const currentMajority = approveVotes > rejectVotes ? 'Approved' : rejectVotes > approveVotes ? 'Rejected' : null;

            // Your vote type stored in localStorage
            const yourVote = votedItems[item._id]; // 'approve' or 'reject'

            // Display status
            const displayStatus = isFinalized ? (item.status === 'approved' ? 'Approved' : 'Rejected') : currentMajority;

            return (
              <div
                key={item._id}
                className={`bg-slate-800 rounded-lg p-6 border border-slate-700 transition-opacity duration-500 ${isFinalized ? 'opacity-50' : 'hover:border-blue-500/50'}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 lg:mr-6">
                    <p className="text-white mb-4 leading-relaxed break-words">{item.source}</p>
                    <div className="flex items-center gap-x-6">
                      <span className="text-xs font-bold text-slate-500">ML Confidence Score: ({item.score.toFixed(1)}%)</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 mt-4 lg:mt-0 lg:w-48 flex-shrink-0">
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${isFinalized ? 'bg-blue-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min((totalVotes / VOTE_THRESHOLD) * 100, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <button
                      type='button'
                        onClick={(e) => {
                          e.preventDefault();
                          handleVote(item._id, 'approve')}}
                        disabled={hasVoted || isFinalized || !account}
                        className={`flex items-center gap-2 ${yourVote === 'approve' ? 'text-green-500' : 'text-green-400'} disabled:text-slate-500 disabled:cursor-not-allowed`}
                      >
                        <ThumbsUp className="h-5 w-5" />
                        <span>{approveVotes}</span>
                      </button>

                      <span className="text-slate-400">{totalVotes} / {VOTE_THRESHOLD} vote(s)</span>

                      <button
                      type="button"
                      onClick={(e) => {
                      e.preventDefault();  // prevent reload/navigation
                      handleVote(item._id, 'reject');
                      }}
                        disabled={hasVoted || isFinalized || !account}
                        className={`flex items-center gap-2 ${yourVote === 'reject' ? 'text-red-500' : 'text-red-400'} disabled:text-slate-500 disabled:cursor-not-allowed`}
                      >
                        <ThumbsDown className="h-5 w-5" />
                        <span>{rejectVotes}</span>
                      </button>
                    </div>

                    <div className="text-center text-xs h-4">
                      {displayStatus && <p className={`font-semibold ${displayStatus === 'Approved' ? 'text-green-400' : 'text-red-400'}`}>{displayStatus}</p>}
                      {!displayStatus && hasVoted && <p className="text-blue-400">You voted {yourVote === 'approve' ? '👍' : yourVote === 'reject' ? '👎' : ''}</p>}
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
