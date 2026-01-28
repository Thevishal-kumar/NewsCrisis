import React, { useState, useEffect, useMemo, useContext } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart 
} from 'recharts';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { WalletContext } from '../context/WalletContext.jsx'; 
import { ReportsContext } from '../context/ReportsContext.jsx';
import { 
  ShieldAlert, 
  Loader, 
  Search, 
  FileText, 
  Link as LinkIcon, 
  Activity, 
  Terminal, 
  CheckCircle,
  AlertTriangle,
  History
} from 'lucide-react';

// --- Reports Form (Premium) ---
function ReportsForm({ onSubmit, isAnalyzing }) {
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [activeTab, setActiveTab] = useState('url'); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!urlInput.trim() && !textInput.trim()) {
      return;
    }
    onSubmit({ url: urlInput.trim(), text: textInput.trim() });
    setUrlInput('');
    setTextInput('');
  };
  
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-[50px] group-hover:bg-blue-500/20 transition-all duration-700"></div>

      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
        <button 
          onClick={() => setActiveTab('url')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'url' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <LinkIcon className="h-4 w-4" /> Analyze URL
        </button>
        <button 
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'text' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <FileText className="h-4 w-4" /> Analyze Text
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="relative group/input">
          {activeTab === 'url' ? (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Paste suspicious URL here..."
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl text-white pl-10 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 placeholder:text-slate-600"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={isAnalyzing} 
              />   
            </div>
          ) : (
            <div className="relative">
               <div className="absolute top-4 left-3 pointer-events-none">
                <Terminal className="h-5 w-5 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" />
              </div>
              <textarea
                placeholder="Paste news content or social media text here..."
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl text-white pl-10 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 placeholder:text-slate-600 min-h-[120px]"
                rows="3"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`w-full relative overflow-hidden font-bold py-4 px-6 rounded-xl transition-all duration-300 transform active:scale-[0.98] 
            ${isAnalyzing 
              ? 'bg-slate-800 cursor-not-allowed text-slate-400 border border-slate-700' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] border border-blue-500/30'
            }`}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-3">
              <Loader className="animate-spin h-5 w-5" />
              <span className="animate-pulse">Running Neural Analysis...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Activity className="h-5 w-5" /> Initialize Scan
            </span>
          )}
        </button>
      </form>
    </div>
  );
}

// --- Reports Table (Premium) ---
function ReportsTable({ data }) {
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <History className="h-5 w-5 text-blue-400" /> Verification Log
        </h3>
        <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">
          TOTAL ENTRIES: {data.length}
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-slate-950/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Source Content</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Analysis Result</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Confidence</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.length > 0 ? (
              data.map((report, index) => {
                const isSafe = report.label !== 'Misinformation';
                return (
                  <tr 
                    key={report._id} 
                    className="group hover:bg-white/[0.02] transition-colors duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 max-w-md">
                        <div className={`p-2 rounded-lg ${isSafe ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                           {isSafe ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                        </div>
                        <p className="text-sm text-slate-300 truncate font-mono" title={report.source}>
                          {report.source}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        isSafe 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                          : 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isSafe ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></span>
                        {report.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isSafe ? 'bg-emerald-500' : 'bg-red-500'}`} 
                            style={{ width: `${report.score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-slate-300 font-mono">{report.score.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                      {new Date(report.createdAt).toLocaleString()}
                    </td>
                  </tr>
                )
              })
            ) : ( 
              <tr>
                <td colSpan="4" className="text-center py-12 text-slate-500">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No reports found in the database.
                </td>
              </tr> 
            )}
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
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate(); // 2. Initialize Hook

  const API_BASE_URL = 'http://localhost:8000/api/v1';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/reports`);
        if (!res.ok) throw new Error('Could not fetch reports from server.');
        const data = await res.json();
        const fetchedReports = (data.items || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setReports(current => {
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
      setReports(current => [newReport, ...current]); 
      
      // 3. NAVIGATE TO VERIFICATION PAGE ON SUCCESS
      navigate('/verify'); 

    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const chartData = useMemo(() => {
    if (!reports.length) return [];
    const countsPerDay = reports.reduce((acc, report) => {
      const day = new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(countsPerDay)
      .map(([day, count]) => ({ day, reports: count }))
      .reverse(); 
  }, [reports]);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-400 text-xs font-mono mb-1">{label}</p>
          <p className="text-blue-400 font-bold text-sm">
            {payload[0].value} Submissions
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 relative overflow-hidden font-sans selection:bg-blue-500/30">
      
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
        
        <div className="mb-10 border-b border-white/5 pb-6">
          <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
            <Activity className="h-10 w-10 text-blue-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Intelligence Reports
            </span>
          </h1>
          <p className="text-slate-400 mt-2 pl-14 font-mono text-sm">
             Submit content for ML verification and review audit logs.
          </p>
        </div>
        
        <div className="mb-10">
          <ReportsForm onSubmit={handleAnalysisSubmit} isAnalyzing={isAnalyzing} />
          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 animate-pulse">
              <AlertTriangle className="h-5 w-5" />
              {error}
            </div>
          )}
        </div>

        {!account ? (
          <div className="bg-slate-900/40 backdrop-blur-xl border border-blue-500/30 rounded-2xl text-center p-16 relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <ShieldAlert className="h-10 w-10 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Secure Archives Locked</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Access to historical verification data and ML analytics requires cryptographic authentication.
              </p>
              <button 
                onClick={connectWallet} 
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
              >
                Connect Wallet to Unlock
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-backwards delay-200">
            
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 relative overflow-hidden">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-lg font-bold text-white flex items-center gap-2">
                   <Activity className="h-5 w-5 text-indigo-400" /> Submission Volume
                 </h2>
                 <div className="flex gap-2">
                   <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                   <span className="text-xs text-slate-500 font-mono">LIVE METRICS</span>
                 </div>
               </div>

              <div className="h-[300px] w-full">
                {reports.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis 
                        dataKey="day" 
                        stroke="#64748b" 
                        fontSize={12} 
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={12} 
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="reports" 
                        stroke="#3b82f6" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorReports)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <Activity className="h-10 w-10 mb-2 opacity-20" />
                    <p>No analytics data available yet.</p>
                  </div>
                )}
              </div>
            </div>

            <ReportsTable data={reports} />
          </div>
        )}
      </div>
    </div>
  );
}