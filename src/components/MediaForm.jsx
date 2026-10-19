import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addMedia, updateMedia } from '../features/media/mediaSlice';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

export default function MediaForm({ mediaToEdit, onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    title: '',
    type: 'ANIME',
    status: 'WATCHING',
    totalEpisodes: 12,
    currentEpisode: 0,
    description: '',
    releaseRegion: 'Japan',
    releaseDay: 'Monday',       // Added for schedule/calendar mapping
    releaseTime: '18:00',       // Added for release notifications
    poster: '',                 // Added for custom poster storage
  });

  useEffect(() => {
    if (mediaToEdit) {
      setForm({
        releaseDay: 'Monday',
        releaseTime: '18:00',
        poster: '',
        ...mediaToEdit
      });
    }
  }, [mediaToEdit]);

  // Handle local image file upload and convert to Base64 string
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, poster: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (mediaToEdit) {
      dispatch(updateMedia({ ...form, id: mediaToEdit.id }));
    } else {
      dispatch(addMedia({
        ...form,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {mediaToEdit ? 'Edit Title' : 'Add New Title'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Solo Leveling"
            />
          </div>

          {/* Poster Upload / URL Section */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Poster Image</label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-20 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                {form.poster ? (
                  <img src={form.poster} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-600" />
                )}
              </div>
              <div className="flex-grow space-y-2">
                <input
                  type="text"
                  value={form.poster.startsWith('data:') ? '' : form.poster}
                  onChange={(e) => setForm({ ...form, poster: e.target.value })}
                  placeholder="Paste image URL or upload file..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image File</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Type & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ANIME">Anime Series</option>
                <option value="MOVIE">Movie</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="WATCHING">Watching</option>
                <option value="PLANNING">Planning</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="DROPPED">Dropped</option>
              </select>
            </div>
          </div>

          {/* Release Schedule (For Calendar & Notifications) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Release Day</label>
              <select
                value={form.releaseDay}
                onChange={(e) => setForm({ ...form, releaseDay: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Release Time</label>
              <input
                type="time"
                value={form.releaseTime}
                onChange={(e) => setForm({ ...form, releaseTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Episodes Tracker */}
          {form.type === 'ANIME' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Episodes</label>
                <input
                  type="number"
                  value={form.totalEpisodes}
                  onChange={(e) => setForm({ ...form, totalEpisodes: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Current Episode</label>
                <input
                  type="number"
                  value={form.currentEpisode}
                  onChange={(e) => setForm({ ...form, currentEpisode: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Optional summary..."
            />
          </div>

          {/* Action Buttons */}
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
              {mediaToEdit ? 'Save Changes' : 'Add Title'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}