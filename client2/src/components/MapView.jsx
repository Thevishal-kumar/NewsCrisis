import React, { useState, useEffect, useMemo, useContext } from 'react';
import { 
  MapPin, 
  Search, 
  Filter, 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Navigation,
  Globe,
  Shield,
  Plus,
  Crosshair,
  TrendingUp
} from 'lucide-react';
import { What3wordsAutosuggest, What3wordsMap } from "@what3words/react-components";
import { WalletContext } from '../context/WalletContext.jsx';

// Load API keys
const API_KEY = import.meta.env.VITE_WHAT3WORDS_API_KEY;
const MAP_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const MapView = () => {
  const { account } = useContext(WalletContext);
  
  // State
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showPendingOnly, setShowPendingOnly] = useState(false); // NEW: Focus mode
  const [selectedNews, setSelectedNews] = useState(null);
  const [mapCenterWords, setMapCenterWords] = useState('filled.count.soap'); 
  const [isSubmitting, setIsSubmitting] = useState(false); // NEW: Submission mode
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock Data
  const newsReports = [
    {
      id: 1,
      title: 'Major Traffic Accident on Highway 101',
      description: 'Multiple vehicles involved. Emergency services on scene.',
      location: 'San Francisco, CA',
      w3w: 'filled.count.soap',
      timestamp: '2h ago',
      category: 'emergency',
      verificationStatus: 'pending',
      verifications: { true: 12, false: 2, total: 14 },
      regionVotes: { 'Downtown': 5, 'SoMa': 8, 'Mission': 1 }
    },
    {
      id: 2,
      title: 'Flash Flood Warning: Downtown Zone',
      description: 'Heavy rainfall causing flooding. Avoid travel.',
      location: 'Austin, TX',
      w3w: 'index.home.raft',
      timestamp: '1h ago',
      category: 'emergency',
      verificationStatus: 'verified',
      verifications: { true: 45, false: 1, total: 46 },
      regionVotes: { 'Central': 30, 'East Austin': 10 }
    },
    // ... add more mock data as needed
  ];

  // Logic: Filter news based on controls
  const filteredNews = useMemo(() => {
    return newsReports.filter(news => {
      const matchesSearch = news.title.toLowerCase().includes(searchLocation.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || news.category === selectedFilter;
      const matchesPending = showPendingOnly ? news.verificationStatus === 'pending' : true;
      return matchesSearch && matchesFilter && matchesPending;
    });
  }, [searchLocation, selectedFilter, showPendingOnly]);

  // Logic: Calculate Regional Trust Score based on visible reports
  const regionalTrustScore = useMemo(() => {
    if (filteredNews.length === 0) return 0;
    const totalVerified = filteredNews.filter(n => n.verificationStatus === 'verified').length;
    return Math.round((totalVerified / filteredNews.length) * 100);
  }, [filteredNews]);

  // Handler: Simulate submitting a report from map
  const handleSubmitFromMap = () => {
    if (!account) return alert("Please connect wallet to submit reports.");
    setIsSubmitting(true);
    // In a real app, this would open a modal with lat/long pre-filled
    setTimeout(() => {
        alert("Opening submission form for coordinates: ///" + mapCenterWords);
        setIsSubmitting(false);
    }, 1000);
  };

  // UI Helpers
  const getCategoryColor = (category) => {
    switch (category) {
      case 'emergency': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'politics': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 pt-24 relative overflow-hidden font-sans selection:bg-blue-500/30">
      
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* --- Header & Controls --- */}
        <div className="flex flex-col xl:flex-row justify-between items-end mb-6 border-b border-white/5 pb-6 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
              <Globe className="h-10 w-10 text-blue-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Global Intel Map
              </span>
            </h1>
            <p className="text-slate-400 mt-2 pl-14 font-mono text-sm flex items-center gap-2">
              <Navigation className="h-3 w-3 text-emerald-400" />
              GEOSPATIAL VERIFICATION GRID • <span className="text-emerald-400">LIVE</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            {/* Regional Trust Score Widget */}
            <div className="bg-slate-900/50 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Region Trust</p>
                    <p className={`text-xl font-bold ${regionalTrustScore > 70 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                        {regionalTrustScore}%
                    </p>
                </div>
                <div className="h-8 w-8 rounded-full border-2 border-white/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-slate-400" />
                </div>
            </div>

            {/* Pending Only Toggle */}
            <button 
                onClick={() => setShowPendingOnly(!showPendingOnly)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    showPendingOnly 
                    ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                    : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
            >
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-bold">Needs Verification</span>
            </button>

            {/* Submit Button */}
            <button 
                onClick={handleSubmitFromMap}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-blue-500/25 transition-all active:scale-95"
            >
                {isSubmitting ? (
                    <Clock className="h-4 w-4 animate-spin" />
                ) : (
                    <Plus className="h-4 w-4" />
                )}
                <span className="text-sm">Submit Intel Here</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[75vh]">
          
          {/* --- LEFT: MAP CONTAINER --- */}
          <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col">
            
            {/* Search Overlay */}
            <div className="absolute top-4 left-4 z-10 w-full max-w-sm">
               <div className="shadow-2xl rounded-xl overflow-hidden border border-white/10">
                 <What3wordsAutosuggest api_key={API_KEY}>
                   <input 
                     type="text" 
                     placeholder="/// Search 3-word address..." 
                     className="w-full bg-slate-950/90 text-white p-3 text-sm focus:outline-none placeholder:text-slate-500"
                   />
                 </What3wordsAutosuggest>
               </div>
            </div>

            {/* Crosshair Overlay (For submission targeting) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
                <Crosshair className="h-8 w-8 text-blue-500/50 opacity-50" />
            </div>

            {/* THE MAP */}
            <div className="flex-1 w-full h-full bg-slate-800 relative">
              <What3wordsMap
                id="w3w-map"
                api_key={API_KEY}
                map_api_key={MAP_API_KEY}
                words={mapCenterWords}
                zoom={13}
                disable_default_ui={true}
                zoom_control={true}
              >
                 <div slot="map" style={{ width: '100%', height: '100%' }}></div>
              </What3wordsMap>
            </div>

            {/* Status Bar */}
            <div className="bg-slate-950/90 backdrop-blur border-t border-white/5 p-3 flex justify-between items-center px-6">
               <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-mono text-emerald-400">LIVE FEED</span>
               </div>
               <span className="text-xs text-slate-500 font-mono">
                  {filteredNews.length} Active Nodes in View
               </span>
            </div>
          </div>

          {/* --- RIGHT: INTELLIGENCE FEED --- */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col h-full overflow-hidden">
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-400" />
                {showPendingOnly ? 'Pending Verification' : 'Active Intel'}
              </h3>
              <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">
                QUEUE: {filteredNews.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {filteredNews.map((news) => (
                <div 
                  key={news.id}
                  onClick={() => { setSelectedNews(news); setMapCenterWords(news.w3w); }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group hover:shadow-lg ${
                    selectedNews?.id === news.id 
                      ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                      : 'bg-slate-800/50 border-white/5 hover:border-blue-500/30 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getCategoryColor(news.category)}`}>
                      {news.category}
                    </span>
                    {news.verificationStatus === 'pending' && (
                        <span className="flex items-center gap-1 text-[10px] text-yellow-400 animate-pulse">
                            <Clock className="h-3 w-3" /> Voting Open
                        </span>
                    )}
                  </div>
                  
                  <h4 className="text-sm font-bold text-slate-200 mb-1 line-clamp-2 group-hover:text-white transition-colors">
                    {news.title}
                  </h4>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-mono">
                    <MapPin className="h-3 w-3 text-blue-400" />
                    <span>/// {news.w3w}</span>
                  </div>

                  {/* Voting Progress Mini-Bar */}
                  <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mb-2">
                     <div 
                        className="h-full bg-emerald-500" 
                        style={{ width: `${(news.verifications.true / (news.verifications.total || 1)) * 100}%` }}
                     ></div>
                  </div>
                  
                  <div className="flex justify-between text-[10px] text-slate-500">
                     <span>{news.verifications.true} Verified</span>
                     <span>{news.verifications.false} Reported</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* --- DETAILS OVERLAY MODAL --- */}
      {selectedNews && (
        <div className="absolute top-28 left-6 z-20 w-80 lg:w-96 animate-in slide-in-from-left-4 fade-in duration-300">
          <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-6 relative">
            <button 
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <XCircle className="h-5 w-5" />
            </button>

            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border mb-4 inline-block ${getCategoryColor(selectedNews.category)}`}>
              {selectedNews.category}
            </span>

            <h3 className="text-xl font-bold text-white mb-2">{selectedNews.title}</h3>
            
            <p className="text-sm text-slate-400 leading-relaxed mb-6 border-l-2 border-slate-700 pl-3">
              {selectedNews.description}
            </p>

            {/* Regional Data Visualization */}
            <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5 mb-6">
               <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-slate-400 font-mono uppercase">Votes by District</span>
                  <BarChart3 className="h-3 w-3 text-slate-500" />
               </div>
               <div className="space-y-2">
                  {selectedNews.regionVotes && Object.entries(selectedNews.regionVotes).map(([region, count]) => (
                      <div key={region} className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 w-20 truncate">{region}</span>
                          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500" style={{ width: `${(count / 20) * 100}%` }}></div>
                          </div>
                          <span className="text-[10px] text-white font-mono">{count}</span>
                      </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-wider shadow-lg">
                <ThumbsUp className="h-4 w-4" /> Verify Intel
              </button>
              <button className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-wider shadow-lg">
                <ThumbsDown className="h-4 w-4" /> Report Fake
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MapView;