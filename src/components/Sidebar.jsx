import React from 'react';
import { LayoutDashboard, Film, Calendar, Clock, Settings, Bell } from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'watchlist', label: 'Watchlist', icon: Film },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'schedule', label: 'Schedule', icon: Clock }, // Added Schedule navigation tab
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
        <Bell className="w-8 h-8 text-indigo-500" />
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">AniTrack</h1>
          <p className="text-xs text-slate-500">Watch Scheduler</p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}