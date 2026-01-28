import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Heart, 
  Activity, 
  Shield, 
  Globe, 
  Zap,
  Terminal,
  RefreshCw,
  Search,
  Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [reportCounts, setReportCounts] = useState({ 
    approved: 0, 
    rejected: 0, 
    pending: 0,
    total: 0
  });

  const [threatLevel, setThreatLevel] = useState('LOW'); 
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Trigger entrance animations on mount
  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsRefreshing(true);
    try {
      // Simulate a small delay for the animation effect if data loads too fast
      const [res] = await Promise.all([
        fetch('http://localhost:8000/api/v1/reports'),
        new Promise(resolve => setTimeout(resolve, 800)) 
      ]);

      if (res.ok) {
        const data = await res.json();
        const items = data.items || [];
        
        let approved = 0;
        let rejected = 0;
        let pending = 0;

        items.forEach(item => {
          const approveVotes = item.approveVotes || 0;
          const rejectVotes = item.rejectVotes || 0;

          if (item.status === 'approved') {
            approved++;
          } else if (item.status === 'rejected') {
            rejected++;
          } else if (item.status === 'pending') {
            if (approveVotes > rejectVotes) approved++;
            else if (rejectVotes > approveVotes) rejected++;
            else pending++;
          }
        });

        setReportCounts({ approved, rejected, pending, total: items.length });

        // Logic for Threat Level
        const rejectedRatio = items.length > 0 ? (rejected / items.length) : 0;
        if (rejectedRatio > 0.5) setThreatLevel('CRITICAL');
        else if (rejectedRatio > 0.2) setThreatLevel('HIGH');
        else if (pending > 5) setThreatLevel('ELEVATED'); 
        else setThreatLevel('LOW');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Helper for dynamic colors
  const getThreatColor = () => {
    switch (threatLevel) {
      case 'CRITICAL': return 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]';
      case 'HIGH': return 'text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]';
      case 'ELEVATED': return 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]';
      default: return 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]';
    }
  };

  const getThreatBg = () => {
    switch (threatLevel) {
      case 'CRITICAL': return 'bg-red-500/10 border-red-500/50';
      case 'HIGH': return 'bg-orange-500/10 border-orange-500/50';
      case 'ELEVATED': return 'bg-yellow-500/10 border-yellow-500/50';
      default: return 'bg-emerald-500/10 border-emerald-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 relative overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* --- PREMIUM AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Moving Grid */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
               backgroundSize: '40px 40px',
               maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
             }}>
        </div>
        {/* Glowing Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] animate-pulse delay-1000"></div>
      </div>

      <div className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 pb-6 border-b border-white/5">
          <div className="relative">
            <h1 className="text-5xl font-extrabold tracking-tight text-white flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                {/* <Shield className="relative h-12 w-12 text-white fill-blue-500/20" /> */}
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                News Command Center
              </span>
              <span className="text-xs px-2 py-1 rounded border border-blue-500/30 text-blue-400 bg-blue-500/10 tracking-widest font-mono">
                OPS
              </span>
            </h1>
            <p className="text-slate-400 mt-2 pl-16 flex items-center gap-2 font-mono text-sm">
              <Terminal className="h-3 w-3 text-blue-400" />
              SYSTEM_STATUS: <span className="text-emerald-400">ONLINE</span>
            </p>
          </div>
          
          {/* Action Area */}
          <div className="flex items-center gap-6 mt-6 md:mt-0">
             {/* Refresh Button */}
             <button 
                onClick={fetchStats}
                disabled={isRefreshing}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
             >
                <RefreshCw className={`h-4 w-4 text-slate-400 group-hover:text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium text-slate-400 group-hover:text-white">
                  {isRefreshing ? 'Scanning...' : 'Refresh Intel'}
                </span>
             </button>

            {/* Threat Level Badge with Radar Effect */}
            <div className={`relative overflow-hidden bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-xl p-4 flex items-center gap-5 shadow-2xl transition-colors duration-500 ${threatLevel === 'CRITICAL' ? 'border-red-500/30' : ''}`}>
              {/* Scanning Line Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
              
              <div className="text-right z-10">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Threat Level</p>
                <p className={`text-3xl font-black ${getThreatColor()} leading-none`}>{threatLevel}</p>
              </div>
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center border ${getThreatBg()} relative overflow-hidden`}>
                 <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.4)_100%)]"></div>
                 {/* Radar Sweep */}
                 <div className="absolute w-full h-full bg-gradient-to-t from-transparent via-current to-transparent opacity-20 animate-[spin_4s_linear_infinite] origin-bottom-right"></div>
                 <Activity className={`h-6 w-6 relative z-10 ${getThreatColor()}`} />
              </div>
            </div>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Card 1: Verified */}
          <div className="group relative bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-white/5 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-emerald-400/80 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Verified Intel
                </p>
                <h3 className="text-4xl font-black text-white tracking-tight">{reportCounts.approved}</h3>
              </div>
              <div className="p-3 bg-slate-800 rounded-xl border border-white/5 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-colors">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
            <div className="w-full bg-slate-800/50 rounded-full h-1 mt-6 overflow-hidden">
               <div className="h-full bg-emerald-500 w-full shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-1000" style={{ width: mounted ? '100%' : '0%' }}></div>
            </div>
          </div>

          {/* Card 2: Threats */}
          <div className="group relative bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-white/5 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-red-400/80 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span> Active Threats
                </p>
                <h3 className="text-4xl font-black text-white tracking-tight">{reportCounts.rejected}</h3>
              </div>
              <div className="p-3 bg-slate-800 rounded-xl border border-white/5 group-hover:bg-red-500/20 group-hover:border-red-500/30 transition-colors">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <div className="w-full bg-slate-800/50 rounded-full h-1 mt-6 overflow-hidden">
               <div className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-all duration-1000 ease-out" 
                    style={{ width: mounted ? `${Math.min((reportCounts.rejected / (reportCounts.total || 1)) * 100, 100)}%` : '0%' }}>
               </div>
            </div>
          </div>

           {/* Card 3: Pending */}
           <div className="group relative bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-white/5 hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_rgba(234,179,8,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-yellow-400/80 font-bold text-xs uppercase tracking-wider mb-2">Pending Review</p>
                <h3 className="text-4xl font-black text-white tracking-tight">{reportCounts.pending}</h3>
              </div>
              <div className="p-3 bg-slate-800 rounded-xl border border-white/5 group-hover:bg-yellow-500/20 group-hover:border-yellow-500/30 transition-colors">
                <Zap className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <div className="flex gap-1 mt-6">
               <span className="h-1 w-8 rounded-full bg-yellow-500/80 animate-[pulse_1.5s_infinite]"></span>
               <span className="h-1 w-2 rounded-full bg-yellow-500/40 animate-[pulse_1.5s_infinite_200ms]"></span>
               <span className="h-1 w-1 rounded-full bg-yellow-500/20 animate-[pulse_1.5s_infinite_400ms]"></span>
            </div>
          </div>

          {/* Card 4: Aid */}
          <div className="group relative bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-white/5 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-blue-400/80 font-bold text-xs uppercase tracking-wider mb-2">Aid Deployed</p>
                <h3 className="text-4xl font-black text-white tracking-tight">$127k</h3>
              </div>
              <div className="p-3 bg-slate-800 rounded-xl border border-white/5 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-colors">
                <Heart className="h-6 w-6 text-blue-500" />
              </div>
            </div>
             <div className="mt-6 flex items-center gap-2 text-[10px] font-mono text-slate-500">
               <span className="w-2 h-2 rounded-full bg-blue-500/50"></span>
               LATEST BLOCK: #18293402
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Live System Log */}
          <div className="lg:col-span-2 relative bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/5 p-1 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/80 pointer-events-none z-10"></div>
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                  <Globe className="h-5 w-5 text-indigo-400" /> 
                  Live Intelligence Feed
                </h3>
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-full border border-white/5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs text-emerald-400 font-mono tracking-wider">LIVE STREAM</span>
                </div>
              </div>
              
              <div className="space-y-2 font-mono text-sm relative z-0">
                 {/* Decorative Line */}
                 <div className="absolute left-[29px] top-4 bottom-4 w-px bg-slate-800 z-[-1]"></div>

                 {/* Log 1 */}
                 <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-default group/item">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                    <div>
                       <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">SYSTEM</span>
                          <span className="text-xs text-slate-500">10:42:05</span>
                       </div>
                       <p className="text-slate-300">ML Model Confidence Re-evaluated. <span className="text-white">Accuracy: 94.2%</span></p>
                    </div>
                 </div>
                 
                 {/* Log 2 */}
                 <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-default group/item">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></div>
                    <div>
                       <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs text-yellow-400 font-bold bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20">QUEUE</span>
                          <span className="text-xs text-slate-500">10:41:12</span>
                       </div>
                       <p className="text-slate-300">
                         <span className="text-white font-bold">{reportCounts.pending} reports</span> queued for immediate community verification.
                       </p>
                    </div>
                 </div>

                 {/* Log 3 */}
                 <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-default group/item">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                    <div>
                       <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">BLOCKCHAIN</span>
                          <span className="text-xs text-slate-500">10:38:55</span>
                       </div>
                       <p className="text-slate-300">New donation confirmed via Smart Contract (0x3f...e1a).</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Operations Panel */}
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/5 p-6 flex flex-col justify-between relative overflow-hidden">
             {/* Gradient Shine */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[64px]"></div>

            <div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Cpu className="h-5 w-5 text-slate-400" /> Operations
              </h3>
              
              <div className="space-y-3">
                <Link to="/verify" className="group relative flex items-center justify-between w-full p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:border-blue-500/40 hover:bg-blue-600/10 transition-all cursor-pointer overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                   <div className="flex items-center gap-4 relative z-10">
                     <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-blue-500/20 transition-colors">
                        <Shield className="h-5 w-5 text-slate-400 group-hover:text-blue-400" />
                     </div>
                     <span className="text-sm font-medium text-slate-300 group-hover:text-white">Verify Queue</span>
                   </div>
                   {reportCounts.pending > 0 && (
                     <span className="relative z-10 text-xs font-bold bg-blue-500 text-white px-2 py-0.5 rounded shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                       {reportCounts.pending}
                     </span>
                   )}
                </Link>

                <Link to="/reports" className="group relative flex items-center justify-between w-full p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:border-indigo-500/40 hover:bg-indigo-600/10 transition-all cursor-pointer overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                   <div className="flex items-center gap-4 relative z-10">
                     <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-indigo-500/20 transition-colors">
                        <Search className="h-5 w-5 text-slate-400 group-hover:text-indigo-400" />
                     </div>
                     <span className="text-sm font-medium text-slate-300 group-hover:text-white">Search Reports</span>
                   </div>
                </Link>

                <Link to="/donate" className="group relative flex items-center justify-between w-full p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-600/10 transition-all cursor-pointer overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                   <div className="flex items-center gap-4 relative z-10">
                     <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-emerald-500/20 transition-colors">
                        <DollarSign className="h-5 w-5 text-slate-400 group-hover:text-emerald-400" />
                     </div>
                     <span className="text-sm font-medium text-slate-300 group-hover:text-white">Fund Missions</span>
                   </div>
                </Link>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5">
               <div className="flex items-center justify-between text-[10px] uppercase text-slate-500 font-mono tracking-wider">
                  <span>Server Uptime</span>
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 99.98%
                  </span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;