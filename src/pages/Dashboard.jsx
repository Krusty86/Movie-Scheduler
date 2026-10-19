import React from 'react';
import { useSelector } from 'react-redux';
import { selectMediaStats } from '../features/media/mediaSelectors';
import { selectUpcomingReleases, selectTodayReleases } from '../features/releases/releaseSelectors';
import ReleaseCard from '../components/ReleaseCard';
import { Film, Calendar, CheckCircle2, Clock, Plus } from 'lucide-react';

export default function Dashboard({ onOpenMediaForm, onOpenReleaseForm }) {
  const stats = useSelector(selectMediaStats);
  const upcomingReleases = useSelector(selectUpcomingReleases);
  const todayReleases = useSelector(selectTodayReleases);

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900/50 via-slate-900 to-slate-900 p-8 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-2">Welcome to AniTrack</h2>
          <p className="text-slate-400 text-sm">Keep track of your favorite anime and movie release schedules effortlessly.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenMediaForm}
            className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Plus className="w-5 h-5" /> Add Title
          </button>
          <button
            onClick={onOpenReleaseForm}
            className="px-5 py-3 rounded-xl bg-slate-800 text-slate-200 font-semibold hover:bg-slate-700 border border-slate-700 transition-all"
          >
            Schedule Release
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
          <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl"><Clock className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Watching</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.watching}</h3>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
          <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl"><Film className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Planning</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.upcoming}</h3>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
          <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl"><CheckCircle2 className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.completed}</h3>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
          <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl"><Calendar className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Recorded</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.total}</h3>
          </div>
        </div>
      </div>

      {/* Releases Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Today's Schedule
          </h3>
          {todayReleases.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
              No releases scheduled for today.
            </div>
          ) : (
            <div className="space-y-3">
              {todayReleases.map(release => <ReleaseCard key={release.id} release={release} />)}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Upcoming Releases
          </h3>
          {upcomingReleases.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
              No upcoming releases found.
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingReleases.slice(0, 4).map(release => <ReleaseCard key={release.id} release={release} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}