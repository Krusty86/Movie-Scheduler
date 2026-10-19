import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Film, 
  Tv, 
  Clock, 
  Eye, 
  X,
  Sparkles 
} from 'lucide-react';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  // Tracks active carousel slide index for each calendar day: { "YYYY-MM-DD": index }
  const [carouselIndices, setCarouselIndices] = useState({});
  // Tracks selected day for modal popup
  const [selectedDayModal, setSelectedDayModal] = useState(null);

  // Load state from Redux store (Media items & Releases)
  const mediaItems = useSelector((state) => state.media?.items || []);
  const releases = useSelector((state) => state.releases?.items || []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper date navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Grid calculation helpers
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Find media and releases for a given day
  const getItemsForDay = (dayNum) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(dayNum).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    const dayName = new Date(year, month, dayNum).toLocaleString('en-US', { weekday: 'long' });

    // Collect releases scheduled for this exact date
    const matchedReleases = releases.filter((r) => {
      if (!r.releaseDateTime) return false;
      return r.releaseDateTime.slice(0, 10) === dateStr;
    });

    // Match parent media objects
    const itemsFromReleases = matchedReleases.map((rel) => {
      const parentMedia = mediaItems.find((m) => m.id === rel.mediaId);
      return {
        id: rel.id,
        title: parentMedia?.title || 'Unknown Title',
        poster: parentMedia?.posterUrl || '',
        type: parentMedia?.type || 'ANIME',
        label: rel.label || `Episode ${parentMedia?.currentEpisode || 1}`,
        time: new Date(rel.releaseDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: parentMedia?.description || '',
      };
    });

    // Also fallback to any watchlist items matching releaseDay (e.g., "Monday") or releaseDate
    const directWatchlistMatches = mediaItems
      .filter((m) => m.releaseDate === dateStr || (m.releaseDay && m.releaseDay.toLowerCase() === dayName.toLowerCase()))
      .map((m) => ({
        id: m.id,
        title: m.title,
        poster: m.posterUrl || '',
        type: m.type,
        label: `Ep ${m.currentEpisode || 1}`,
        time: m.releaseTime || 'Scheduled',
        description: m.description || '',
      }));

    // Deduplicate items
    const combined = [...itemsFromReleases];
    directWatchlistMatches.forEach((item) => {
      if (!combined.some((c) => c.title === item.title)) {
        combined.push(item);
      }
    });

    return combined;
  };

  // Handle intra-day carousel navigation
  const handleCarouselPrev = (dateKey, totalItems, e) => {
    e.stopPropagation();
    setCarouselIndices((prev) => {
      const currentIndex = prev[dateKey] || 0;
      return {
        ...prev,
        [dateKey]: currentIndex > 0 ? currentIndex - 1 : totalItems - 1,
      };
    });
  };

  const handleCarouselNext = (dateKey, totalItems, e) => {
    e.stopPropagation();
    setCarouselIndices((prev) => {
      const currentIndex = prev[dateKey] || 0;
      return {
        ...prev,
        [dateKey]: currentIndex < totalItems - 1 ? currentIndex + 1 : 0,
      };
    });
  };

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-2xl">
            <CalendarIcon className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-wide">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-400">Monthly Anime & Movie Release Schedule</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleToday}
            className="px-3.5 py-2 text-xs font-semibold bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white rounded-xl transition-all"
          >
            Today
          </button>
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Names Header */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="py-2 bg-slate-900/60 border border-slate-800/80 rounded-xl">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Previous Month Padding Cells */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="h-44 bg-slate-900/30 border border-slate-900 rounded-2xl opacity-40 pointer-events-none"
          />
        ))}

        {/* Current Month Days */}
        {Array.from({ length: totalDays }).map((_, i) => {
          const dayNum = i + 1;
          const dayItems = getItemsForDay(dayNum);
          const dateKey = `${year}-${month}-${dayNum}`;
          const activeIndex = carouselIndices[dateKey] || 0;
          const currentShow = dayItems[activeIndex];

          const isTodayCell = isCurrentMonth && today.getDate() === dayNum;

          return (
            <div
              key={dayNum}
              onClick={() => dayItems.length > 0 && setSelectedDayModal({ dayNum, items: dayItems })}
              className={`h-44 bg-slate-900 border ${
                isTodayCell
                  ? 'border-indigo-500/80 ring-2 ring-indigo-500/30 bg-slate-900/90'
                  : 'border-slate-800/90 hover:border-slate-700'
              } rounded-2xl p-2.5 flex flex-col justify-between transition-all duration-200 group relative overflow-hidden ${
                dayItems.length > 0 ? 'cursor-pointer' : ''
              }`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between z-10">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                    isTodayCell
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
                      : 'text-slate-300 group-hover:text-white'
                  }`}
                >
                  {dayNum}
                </span>

                {dayItems.length > 0 && (
                  <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-md border border-indigo-500/20">
                    {dayItems.length} {dayItems.length === 1 ? 'show' : 'shows'}
                  </span>
                )}
              </div>

              {/* Day Cell Body / Carousel */}
              <div className="flex-1 my-1.5 relative flex items-center justify-center overflow-hidden">
                {dayItems.length === 0 ? (
                  <span className="text-[11px] text-slate-700 font-medium">No releases</span>
                ) : (
                  currentShow && (
                    <div className="w-full h-full relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 group-hover:border-slate-700 transition-all flex flex-col justify-between p-1.5">
                      {/* Image Preview / Poster */}
                      <div className="relative w-full h-20 rounded-lg overflow-hidden bg-slate-800">
                        {currentShow.poster ? (
                          <img
                            src={currentShow.poster}
                            alt={currentShow.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            {currentShow.type === 'MOVIE' ? <Film className="w-6 h-6" /> : <Tv className="w-6 h-6" />}
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 text-[9px] font-bold bg-slate-950/80 backdrop-blur-md text-indigo-300 px-1.5 py-0.5 rounded border border-slate-700">
                          {currentShow.label}
                        </span>
                      </div>

                      {/* Title & Time */}
                      <div className="mt-1">
                        <p className="text-[11px] font-bold text-white truncate" title={currentShow.title}>
                          {currentShow.title}
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5 text-indigo-400" />
                          <span>{currentShow.time}</span>
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Multi-show Carousel Navigation Controls */}
              {dayItems.length > 1 && (
                <div
                  className="flex items-center justify-between pt-1 border-t border-slate-800/80 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => handleCarouselPrev(dateKey, dayItems.length, e)}
                    className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-md transition"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <span className="text-[9px] font-bold text-slate-500">
                    {activeIndex + 1}/{dayItems.length}
                  </span>
                  <button
                    onClick={(e) => handleCarouselNext(dateKey, dayItems.length, e)}
                    className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-md transition"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Day Details Modal */}
      {selectedDayModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">
                  Releases for {monthNames[month]} {selectedDayModal.dayNum}, {year}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDayModal(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Shows */}
            <div className="overflow-y-auto space-y-3 pr-1 flex-1">
              {selectedDayModal.items.map((show, idx) => (
                <div
                  key={`${show.id}-${idx}`}
                  className="flex items-center gap-4 bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5 hover:border-slate-700 transition"
                >
                  <div className="w-16 h-20 bg-slate-800 rounded-xl overflow-hidden flex-shrink-0">
                    {show.poster ? (
                      <img src={show.poster} alt={show.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        {show.type === 'MOVIE' ? <Film className="w-6 h-6" /> : <Tv className="w-6 h-6" />}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0 space-y-1">
                    <h4 className="text-white text-sm font-bold truncate">{show.title}</h4>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md font-semibold">
                        {show.label}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        {show.time}
                      </span>
                    </div>
                    {show.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 pt-0.5">{show.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}