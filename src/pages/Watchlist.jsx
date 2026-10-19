import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilteredMedia } from '../features/media/mediaSelectors';
import { setSearchQuery, setFilterStatus, setFilterType } from '../features/media/mediaSlice';
import MediaCard from '../components/MediaCard';
import { Search, Film, Sparkles } from 'lucide-react';

export default function Watchlist({ onOpenMediaForm, onEditMedia, onAddRelease }) {
  const dispatch = useDispatch();
  const mediaItems = useSelector(selectFilteredMedia);
  const { searchQuery, filterStatus, filterType } = useSelector((state) => state.media);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-xl">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Film className="w-6 h-6 text-indigo-500" />
            My Watchlist
          </h2>
          <p className="text-slate-400 text-sm">
            Manage your anime series, movies, and track your progress.
          </p>
        </div>
        <button
          onClick={onOpenMediaForm}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Add Title
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search titles..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => dispatch(setFilterType(e.target.value))}
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="ALL">All Types</option>
          <option value="ANIME">Anime</option>
          <option value="MOVIE">Movie</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => dispatch(setFilterStatus(e.target.value))}
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="ALL">All Statuses</option>
          <option value="WATCHING">Watching</option>
          <option value="PLANNING">Planning</option>
          <option value="COMPLETED">Completed</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="DROPPED">Dropped</option>
        </select>
      </div>

      {/* Grid */}
      {mediaItems.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-16 text-center text-slate-500 space-y-3">
          <Film className="w-10 h-10 mx-auto text-slate-600 opacity-50" />
          <p className="text-sm font-medium">No titles found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((media) => (
            <MediaCard
              key={media.id}
              media={media}
              onEdit={onEditMedia}
              onAddRelease={onAddRelease}
            />
          ))}
        </div>
      )}
    </div>
  );
}