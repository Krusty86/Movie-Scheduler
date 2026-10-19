import React from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentEpisode, deleteMedia } from '../features/media/mediaSlice';
import { deleteReleasesByMediaId } from '../features/releases/releasesSlice';
import { Film, Tv, Trash2, Plus, Minus } from 'lucide-react';

export default function MediaCard({ media, onEdit, onAddRelease }) {
  const dispatch = useDispatch();

  const handleEpisodeChange = (newEpisode) => {
    if (newEpisode < 0) return;
    dispatch(setCurrentEpisode({ id: media.id, episode: newEpisode }));
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${media.title}" and its releases?`)) {
      dispatch(deleteMedia(media.id));
      dispatch(deleteReleasesByMediaId(media.id));
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl">
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${
            media.type === 'ANIME' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
          }`}>
            {media.type === 'ANIME' ? <Tv className="w-3.5 h-3.5" /> : <Film className="w-3.5 h-3.5" />}
            {media.type}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 capitalize">
            {media.status.toLowerCase().replace('_', ' ')}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-1 truncate">{media.title}</h3>
        <p className="text-xs text-slate-400 line-clamp-2 mb-4">{media.description || 'No description provided.'}</p>

        {media.type === 'ANIME' && (
          <div className="bg-slate-950/60 p-3 rounded-xl mb-4 border border-slate-800/80">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Progress</span>
              <span className="font-semibold text-white">
                Ep. {media.currentEpisode || 0} / {media.totalEpisodes || '?'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEpisodeChange((media.currentEpisode || 0) - 1)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full transition-all duration-300"
                  style={{
                    width: media.totalEpisodes ? `${Math.min(100, ((media.currentEpisode || 0) / media.totalEpisodes) * 100)}%` : '0%'
                  }}
                />
              </div>
              <button
                onClick={() => handleEpisodeChange((media.currentEpisode || 0) + 1)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
        <button
          onClick={() => onAddRelease(media.id)}
          className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
        >
          + Add Release
        </button>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(media)}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-rose-400 hover:text-rose-300 transition-colors p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}