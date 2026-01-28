import React, { useContext, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Shield, 
  BarChart3, 
  FileText, 
  CheckSquare, 
  Heart, 
  User, 
  Menu, 
  X, // Added X icon for closing
  Map as MapIcon 
} from 'lucide-react';
import { WalletContext } from '../context/WalletContext.jsx';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { account, connectWallet } = useContext(WalletContext);
  const [isOpen, setIsOpen] = useState(false); // Restored state
  
  const navItems = [
    { to: '/', label: 'Dashboard', icon: BarChart3 },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/verify', label: 'Verify', icon: CheckSquare },
    { to: '/donate', label: 'Donate', icon: Heart },
    // { to: '/map', label: 'Live Map', icon: MapIcon },
    { to: '/login', label: 'Login', icon: User },
  ];

  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* --- LOGO --- */}
          <div className="flex-shrink-0 flex items-center gap-3 group cursor-pointer">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 group-hover:opacity-50 transition-opacity duration-500"></div>
              <Shield className="h-9 w-9 text-blue-400 relative z-10 transform group-hover:scale-105 transition-transform duration-500 fill-blue-500/10" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-400">
                <Link to='/'>NewsForge</Link>
              </span>
            </div>
          </div>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `relative flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group ${
                        isActive
                          ? 'text-white bg-white/10 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`h-4 w-4 mr-2 transition-colors duration-300 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'}`} />
                        <span className="relative z-10 tracking-wide">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
          
          {/* --- DESKTOP WALLET --- */}
          <div className="hidden md:block flex-shrink-0">
            {account ? (
              <div className="group relative px-4 py-2 rounded-xl bg-slate-900 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)] flex items-center gap-3 transition-all hover:border-emerald-500/50">
                 <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                 </div>
                 <span className="font-mono text-sm text-emerald-400 tracking-wider">
                   {`${account.substring(0, 5)}..${account.substring(39)}`}
                 </span>
              </div>
            ) : (
              <button 
                onClick={connectWallet}
                className="relative group overflow-hidden bg-white text-slate-950 font-bold py-2 px-5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2 text-sm">
                  Connect Wallet
                </span>
              </button>
            )}
          </div>
        
          {/* --- MOBILE MENU BUTTON --- */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-slate-950/95 backdrop-blur-xl border-b border-white/5 animate-in slide-in-from-top-5 shadow-2xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600/10 text-white border border-blue-500/20'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </NavLink>
              );
            })}
            
            {/* Mobile Wallet Button */}
            <div className="pt-4 mt-2 border-t border-white/10">
              {account ? (
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 rounded-xl border border-emerald-500/30">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                  <span className="font-mono text-emerald-400">{`${account.substring(0, 6)}...${account.substring(38)}`}</span>
                </div>
              ) : (
                <button 
                  onClick={() => { connectWallet(); setIsOpen(false); }}
                  className="w-full bg-white text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;