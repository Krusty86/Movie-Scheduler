import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRelease } from '../features/releases/releasesSlice';
import { X } from 'lucide-react';

export default function ReleaseForm({ preselectedMediaId, onClose }) {
  const dispatch = useDispatch();
  const mediaItems = useSelector((state) => state.media.items);

  const [form, setForm] = useState({
    mediaId: preselectedMediaId || (mediaItems[0]?.id ?? ''),
    label: 'Episode 1',
    releaseDateTime: new Date().toISOString().slice(0, 16),
    timezone: 'UTC',
    notificationEnabled: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.mediaId) return;

    dispatch(addRelease({
      id: crypto.randomUUID(),
      mediaId: form.mediaId,
      label: form.label,
      releaseDateTime: new Date(form.releaseDateTime).toISOString(),
      timezone: form.timezone,
      notificationEnabled: form.notificationEnabled,
      notifiedAt: null,
      status: 'UPCOMING',
    }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Schedule Release</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Select Title</label>
            <select
              value={form.mediaId}
              onChange={(e) => setForm({ ...form, mediaId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
            >
              {mediaItems.map((m) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Release Label</label>
            <input
              type="text"
              required
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Episode 13 or Blu-ray Release"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Release Date & Time</label>
            <input
              type="datetime-local"
              required
              value={form.releaseDateTime}
              onChange={(e) => setForm({ ...form, releaseDateTime: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              id="notif"
              checked={form.notificationEnabled}
              onChange={(e) => setForm({ ...form, notificationEnabled: e.target.checked })}
              className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="notif" className="text-sm font-medium text-slate-300">Enable Notification Reminder</label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 font-medium shadow-lg shadow-indigo-600/30"
            >
              Schedule Release
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}