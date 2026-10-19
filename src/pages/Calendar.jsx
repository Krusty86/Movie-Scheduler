import React from 'react';
import { useSelector } from 'react-redux';
import CalendarView from '../components/CalendarView'; // Adjust path if located elsewhere

export default function Calendar() {
  // Pull media items from your Redux store (adjust selector path if your slice name differs, e.g., state.media.items)
  const mediaItems = useSelector((state) => state.media?.items || state.releases?.items || []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Release Calendar</h2>
        <p className="text-slate-400 text-sm">Interactive monthly schedule of your watchlist items.</p>
      </div>

      {/* Render the CalendarView component passing your Redux watchlist items */}
      <CalendarView watchlistItems={mediaItems} />
    </div>
  );
}