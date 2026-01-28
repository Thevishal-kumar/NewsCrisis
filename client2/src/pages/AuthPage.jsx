import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Fingerprint,
  Key
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000/api/v1/';

function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user types
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const endpoint = isLogin ? 'users/login' : 'users/register';
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      let response;
      if (isLogin) {
        response = await axios.post(url, {
          email: formData.email,
          password: formData.password
        });
      } else {
        response = await axios.post(url, formData);
      }
      
      // Small delay for UX transition
      await new Promise(r => setTimeout(r, 800));
      console.log('Success:', response.data);
      navigate('/');
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
               backgroundSize: '40px 40px',
               maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
             }}>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <div className={`max-w-md w-full relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Card Container */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
          
          {/* Decorative Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-[50px] group-hover:bg-blue-500/20 transition-all duration-700"></div>

          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="mx-auto h-16 w-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-blue-500/20 transform group-hover:scale-105 transition-transform duration-300">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {isLogin ? 'Access Command' : 'Initialize Identity'}
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              {isLogin ? "Enter your credentials to access the secure terminal." : "Establish a new secure operator account."}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Username Field (Register Only) */}
            <div className={`space-y-1 overflow-hidden transition-all duration-300 ${isLogin ? 'h-0 opacity-0' : 'h-20 opacity-100'}`}>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required={!isLogin}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-950/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  placeholder="Operator ID (Username)"
                  value={formData.username}
                  onChange={handleInputChange}
                  tabIndex={isLogin ? -1 : 0}
                />
              </div>
            </div>
            
            {/* Email Field */}
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-950/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                placeholder="Secure Email Link"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Password Field */}
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-950/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                placeholder="Access Key (Password)"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-800 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-slate-400 cursor-pointer hover:text-slate-300">
                  Keep Session Active
                </label>
              </div>

              {isLogin && (
                <a href="#" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Lost Key?
                </a>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white transition-all duration-300 shadow-lg 
                ${isLoading 
                  ? 'bg-slate-800 cursor-wait' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5'
                }`}
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                {isLoading ? (
                  <Fingerprint className="h-5 w-5 text-blue-300 animate-pulse" />
                ) : (
                  <Lock className="h-5 w-5 text-blue-300 group-hover:text-white transition-colors" />
                )}
              </span>
              {isLoading ? 'Authenticating...' : (isLogin ? 'Authenticate Access' : 'Create Operator Identity')}
            </button>
          </form>

          {/* Switch Mode Toggle */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-slate-400">
              {isLogin ? "New to the network? " : "Already verified? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  setFormData({ username: '', email: '', password: '' });
                }}
                className="font-bold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 group/link"
              >
                {isLogin ? 'Initialize Account' : 'Log In'}
                <ArrowRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
              </button>
            </p>
          </div>

        </div>
        
        {/* Footer Info */}
        <p className="text-center text-xs text-slate-500 mt-8 font-mono">
          SECURE CONNECTION • 256-BIT ENCRYPTION • VERIFIED
        </p>

      </div>
    </div>
  );
}

export default AuthPage;