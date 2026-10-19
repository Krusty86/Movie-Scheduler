import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRelease, toggleReleaseNotification } from '../features/releases/releasesSlice';
import { Bell, BellOff, Trash2, Calendar as CalendarIcon } from 'lucide-react';

export default function ReleaseCard({ release }) {
  const dispatch = useDispatch();
  const mediaItems = useSelector((state) => state.media.items);
  const media = mediaItems.find((m) => m.id === release.mediaId);

  const releaseDate = new Date(release.releaseDateTime);
  const formattedDate = releaseDate.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-slate-700 transition-all">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl">
          <CalendarIcon className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-white font-bold text-base">{media?.title || 'Unknown Title'}</h4>
          <p className="text-xs text-indigo-400 font-medium">{release.label}</p>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span>{formattedDate}</span>
            <span>({release.timezone})</span>
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => dispatch(toggleReleaseNotification(release.id))}
          className={`p-2 rounded-xl transition-colors ${
            release.notificationEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
          title={release.notificationEnabled ? 'Disable Notification' : 'Enable Notification'}
        >
          {release.notificationEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
        </button>
        <button
          onClick={() => dispatch(deleteRelease(release.id))}
          className="p-2 bg-slate-800 text-slate-400 hover:text-rose-400 rounded-xl transition-colors"
          title="Delete Release"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}