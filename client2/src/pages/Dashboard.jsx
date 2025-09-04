import React from 'react';
import { AlertTriangle, CheckCircle, DollarSign, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
function Dashboard() {
  const stats = [
    { title: 'Total Verified Reports', value: '18', icon: CheckCircle, color: 'text-green-400' },
    { title: 'Active Threats Detected', value: '7', icon: AlertTriangle, color: 'text-red-400' },
    { title: 'Total Donations', value: '$127,892', icon: DollarSign, color: 'text-blue-400' },
    { title: 'Aid Missions Funded', value: '45', icon: Heart, color: 'text-pink-400' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">News Command Center</h1>
        <p className="text-slate-400 mt-2">Real-time monitoring and threat assessment dashboard</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all duration-200">
              <div className="flex items-center">
                <Icon className={`h-8 w-8 ${stat.color}`} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all duration-200">
          <h3 className="text-lg font-semibold text-white mb-2">Recent Activity</h3>
          <p className="text-slate-400 text-sm mb-4">Latest system updates and alerts</p>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              <Link to="/reports" className="text-slate-300 hover:underline">
  ML model updated successfully
</Link>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              <span className="text-slate-300">5 reports pending verification</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <span className="text-slate-300">New donation received</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all duration-200">
          <h3 className="text-lg font-semibold text-white mb-2">System Health</h3>
          <p className="text-slate-400 text-sm mb-4">Current system performance metrics</p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">ML Model Accuracy</span>
                <span className="text-green-400">94.2%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">System Uptime</span>
                <span className="text-blue-400">99.8%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '99.8%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all duration-200">
          <h3 className="text-lg font-semibold text-white mb-2">Quick Actions</h3>
          <p className="text-slate-400 text-sm mb-4">Common tasks and shortcuts</p>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-md transition-colors duration-200">
              View ML Reports
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-md transition-colors duration-200">
              Check Verification Queue
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-md transition-colors duration-200">
              Manage Donations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;