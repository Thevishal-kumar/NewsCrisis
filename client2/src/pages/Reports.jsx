import React, { useState, useEffect, useMemo, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WalletContext } from '../context/WalletContext.jsx'; 
import { ReportsContext } from '../context/ReportsContext.jsx';
import { ShieldAlert, Loader } from 'lucide-react';

// --- Reports Form ---
function ReportsForm({ onSubmit, isAnalyzing }) {
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!urlInput.trim() && !textInput.trim()) {
      alert('Please provide a URL or text to analyze.');
      return;
    }
    onSubmit({ url: urlInput.trim(), text: textInput.trim() });
    setUrlInput('');
    setTextInput('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Paste a URL to analyze..."
        className="w-full bg-slate-700 border border-slate-600 rounded-lg text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        disabled={isAnalyzing || !!textInput} 
      />
      <div className="text-center text-slate-400 font-semibold">OR</div>
      <textarea
        placeholder="Or paste text to analyze..."
        className="w-full bg-slate-700 border border-slate-600 rounded-lg text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        disabled={isAnalyzing || !!urlInput}
      />
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:bg-slate-500"
        disabled={isAnalyzing}
      >
        {isAnalyzing ? <span className="flex items-center justify-center"><Loader className="animate-spin h-5 w-5 mr-3" />Analyzing...</span> : 'Analyze Authenticity'}
      </button>
    </form>
  );
}

// --- Reports Table ---
function ReportsTable({ data }) {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div className="px-6 py-4"><h3 className="text-lg font-semibold text-white">Verification History</h3></div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Source Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ML Label</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ML Confidence</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Submission Time</th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {data.length > 0 ? (
              data.map((report) => (
                <tr key={report._id} className="hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 max-w-sm truncate" title={report.source}>{report.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.label === 'Misinformation' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                      {report.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{report.score.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{new Date(report.createdAt).toLocaleString()}</td>
                </tr>
              ))
            ) : ( <tr><td colSpan="4" className="text-center py-10 text-slate-400">No reports found.</td></tr> )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Main Reports Component ---
export default function Reports() {
  const [error, setError] = useState(null);
  const { account, connectWallet } = useContext(WalletContext);
  const { reports, setReports, isAnalyzing, setIsAnalyzing } = useContext(ReportsContext);

  const API_BASE_URL = 'http://localhost:8000/api/v1';

  // --- Fetch reports from backend and merge with localStorage/context ---
  useEffect(() => {
    const fetchReports = async () => {
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/reports`);
        if (!res.ok) throw new Error('Could not fetch reports from server.');
        const data = await res.json();
        const fetchedReports = (data.items || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setReports(current => {
          // Merge backend + current context, remove duplicates
          const combined = [...fetchedReports, ...current];
          const unique = Array.from(new Map(combined.map(r => [r._id, r])).values());
          return unique.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        });
      } catch (err) {
        setError(err.message);
      }
    };

    if (account) fetchReports();
  }, [account, setReports]);

  // --- Handle new report submission ---
  const handleAnalysisSubmit = async (payload) => {
    if (!account) {
      alert("Please connect your wallet before submitting.");
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, submittedBy: account }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Verification failed.');
      }
      const newReport = await res.json();
      setReports(current => [newReport, ...current]); // Add immediately to context
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- Prepare chart data ---
  const chartData = useMemo(() => {
    if (!reports.length) return [];
    const countsPerDay = reports.reduce((acc, report) => {
      const day = new Date(report.createdAt).toISOString().split('T')[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(countsPerDay)
      .map(([day, count]) => ({ day, reports: count }))
      .sort((a, b) => new Date(a.day) - new Date(b.day));
  }, [reports]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-white mb-6">ML Model Analysis & Reports</h1>
      
      <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Analyze New Input</h2>
        <ReportsForm onSubmit={handleAnalysisSubmit} isAnalyzing={isAnalyzing} />
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>

      {!account ? (
        <div className="bg-slate-800 border-2 border-dashed border-blue-500 rounded-lg text-center p-12">
          <ShieldAlert className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-slate-400 mb-6">Please connect your wallet to view and manage verification history.</p>
          <button onClick={connectWallet} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
            Connect Wallet
          </button>
        </div>
      ) : (
        <>
          <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Reports Submitted Over Time</h2>
            {reports.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}/>
                  <Line type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-400 py-10"><p>No report data to display.</p></div>
            )}
          </div>
          <ReportsTable data={reports} />
        </>
      )}
    </div>
  );
}
