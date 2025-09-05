import React, { useState, useEffect, useContext } from 'react';
import { Check, X, Loader, ShieldQuestion } from 'lucide-react';
import { WalletContext } from '../context/WalletContext.jsx';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export default function Dashboard() {
  const { account, connectWallet } = useContext(WalletContext);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reports from backend
  const fetchReports = async () => {
    if (!account) return setIsLoading(false);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/reports`);
      if (!res.ok) throw new Error('Failed to fetch reports');
      const data = await res.json();
      setReports(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // Optional: refresh every 15s
    const interval = setInterval(fetchReports, 15000);
    return () => clearInterval(interval);
  }, [account]);

  if (!account) {
    return (
      <div className="text-center p-12 bg-slate-900 rounded-lg">
        <ShieldQuestion className="mx-auto h-12 w-12 text-blue-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Connect Wallet</h2>
        <p className="text-slate-400 mb-6">Connect your wallet to view the verification dashboard.</p>
        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const approvedReports = reports.filter(r => r.status === 'approved').length;
  const rejectedReports = reports.filter(r => r.status === 'rejected').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Verification Dashboard</h1>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 text-center">
              <p className="text-slate-400">Total Reports</p>
              <p className="text-white font-bold text-2xl">{totalReports}</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 text-center">
              <p className="text-slate-400">Pending</p>
              <p className="text-white font-bold text-2xl">{pendingReports}</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 text-center">
              <p className="text-slate-400">Approved</p>
              <p className="text-white font-bold text-2xl">{approvedReports}</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 text-center">
              <p className="text-slate-400">Rejected</p>
              <p className="text-white font-bold text-2xl">{rejectedReports}</p>
            </div>
          </div>

          <div className="space-y-6">
            {reports.map(report => {
              const approveVotes = report.approveVotes?.length || 0;
              const rejectVotes = report.rejectVotes?.length || 0;
              const totalVotes = approveVotes + rejectVotes;
              const majority =
                approveVotes > rejectVotes
                  ? 'Approved'
                  : rejectVotes > approveVotes
                  ? 'Rejected'
                  : 'Pending';

              return (
                <div key={report._id} className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-white font-semibold break-words">{report.source}</p>
                    <p
                      className={`font-bold ${
                        majority === 'Approved'
                          ? 'text-green-400'
                          : majority === 'Rejected'
                          ? 'text-red-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {majority}
                    </p>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">ML Confidence: {report.score.toFixed(1)}%</p>
                  <div className="flex gap-4 items-center">
                    <div className="flex gap-2">
                      <Check className="text-green-400" />
                      <span>{approveVotes}</span>
                    </div>
                    <div className="flex gap-2">
                      <X className="text-red-400" />
                      <span>{rejectVotes}</span>
                    </div>
                    <span className="text-slate-400 text-sm">Total Votes: {totalVotes}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
