import React from 'react';
import { Film, Tv, Edit3, Calendar, Plus } from 'lucide-react';

export default function MediaCard({ media, onEdit, onAddRelease }) {
  const getStatusBadge = (status) => {
    const statusStyles = {
      WATCHING: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      PLANNING: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      COMPLETED: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      ON_HOLD: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      DROPPED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    };
    return statusStyles[status] || 'bg-slate-800 text-slate-400 border-slate-700';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between group hover:border-slate-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/5">
      <div>
        {/* Poster Image Header */}
        <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 mb-4">
          {media.poster ? (
            <img
              src={media.poster}
              alt={media.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600">
              {media.type === 'MOVIE' ? <Film className="w-10 h-10" /> : <Tv className="w-10 h-10" />}
            </div>
          )}

          {/* Type Badge */}
          <span className="absolute top-3 left-3 text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-indigo-400 px-2.5 py-1 rounded-lg border border-slate-700/80">
            {media.type}
          </span>

          {/* Episode / Progress Badge */}
          <span className="absolute top-3 right-3 text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/80">
            Ep {media.currentEpisode || 0}
          </span>
        </div>

        {/* Title & Status */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-white font-semibold text-base truncate flex-1" title={media.title}>
              {media.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(media.status)}`}>
              {media.status?.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-800/80">
        <button
          onClick={() => onEdit(media)}
          className="flex-1 py-2 bg-slate-800/60 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
          Edit
        </button>
        <button
          onClick={() => onAddRelease(media)}
          className="flex-1 py-2 bg-slate-800/60 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          Schedule
        </button>
      </div>
    </div>
  );
}