import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, BarChart3, FileText, CheckSquare, Heart, User } from 'lucide-react';
import { WalletContext } from '../context/WalletContext.jsx';
import { useNavigate } from 'react-router-dom';
// import { Map } from 'lucide-react';

function Navbar() {
  const { account, connectWallet } = useContext(WalletContext);
  
  const navItems = [
    { to: '/', label: 'Dashboard', icon: BarChart3 },
    { to: '/reports', label: 'ML Reports', icon: FileText },
    { to: '/verify', label: 'Verification Queue', icon: CheckSquare },
    { to: '/donate', label: 'Donations', icon: Heart },
    { to: '/login', label: 'Login', icon: User },
    // { to: '/map', label: 'MapView', icon: Map },
  ];

  const navigate = useNavigate();
  const goToMap = () => navigate('/map'); 
  return (
    <nav className="bg-slate-800 border-b border-slate-700 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold text-white">NewsForge</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
           <div>
          {account ? (
            <div className="bg-green-500/20 text-green-300 border border-green-500/30 text-sm font-mono px-4 py-2 rounded-lg">
              Connected: {`${account.substring(0, 6)}...${account.substring(38)}`}
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white  py-2 px-4 rounded-lg transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
        
          {/* Mobile menu button - placeholder for future implementation */}
          <div className="md:hidden">
            <button className="text-slate-400 hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;