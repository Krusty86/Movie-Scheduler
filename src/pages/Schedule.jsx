import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Film, Tv, Eye, Sparkles } from 'lucide-react';

export default function Schedule() {
  const mediaItems = useSelector((state) => state.media?.items || state.releases?.items || []);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [slideIndices, setSlideIndices] = useState({});
  const [selectedDayDetails, setSelectedDayDetails] = useState(null);

  const scheduleByDay = daysOfWeek.reduce((acc, day) => {
    acc[day] = mediaItems.filter(
      (item) => item.releaseDay && item.releaseDay.toLowerCase() === day.toLowerCase()
    );
    return acc;
  }, {});

  const handlePrevSlide = (day, maxIndex) => {
    setSlideIndices((prev) => ({
      ...prev,
      [day]: prev[day] > 0 ? prev[day] - 1 : maxIndex,
    }));
  };

  const handleNextSlide = (day, maxIndex) => {
    setSlideIndices((prev) => ({
      ...prev,
      [day]: prev[day] < maxIndex ? prev[day] + 1 : 0,
    }));
  };

  const todayName = new Date().toLocaleString('en-US', { weekday: 'long' });
  const otherDays = daysOfWeek.filter((day) => day.toLowerCase() !== todayName.toLowerCase());
  const activeToday = daysOfWeek.find((day) => day.toLowerCase() === todayName.toLowerCase()) || 'Monday';

  const renderDayCard = (day, isFeatured = false) => {
    const shows = scheduleByDay[day] || [];
    const currentIndex = slideIndices[day] || 0;
    const isToday = day.toLowerCase() === todayName.toLowerCase();
    const maxIndex = shows.length - 1;

    return (
      <div
        key={day}
        className={`bg-slate-900 border ${
          isToday 
            ? 'border-indigo-500/80 bg-slate-900/95 ring-2 ring-indigo-500/30 shadow-xl shadow-indigo-500/10' 
            : 'border-slate-800'
        } rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 ${
          isFeatured ? 'h-full min-h-[460px]' : 'h-[360px]'
        }`}
      >
        {/* Day Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${isFeatured ? 'text-lg' : 'text-sm'} ${isToday ? 'text-indigo-400' : 'text-slate-200'}`}>
              {day}
            </span>
            {isToday && (
              <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> TODAY
              </span>
            )}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {shows.length} {shows.length === 1 ? 'Show' : 'Shows'}
          </span>
        </div>

        {/* Day Content */}
        <div className="flex-1 my-3 relative overflow-hidden flex items-center justify-center">
          {shows.length === 0 ? (
            <div className="text-slate-600 text-xs text-center">No releases scheduled</div>
          ) : (
            <div className="w-full h-full flex flex-col">
              {shows[currentIndex] && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex-1 flex flex-col justify-between overflow-hidden group">
                  <div className={`relative w-full rounded-xl overflow-hidden bg-slate-800 mb-3 ${isFeatured ? 'h-52' : 'h-28'}`}>
                    {shows[currentIndex].poster ? (
                      <img
                        src={shows[currentIndex].poster}
                        alt={shows[currentIndex].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        {shows[currentIndex].type === 'MOVIE' ? <Film className="w-8 h-8" /> : <Tv className="w-8 h-8" />}
                      </div>
                    )}
                    <span className="absolute top-2.5 right-2.5 text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-indigo-400 px-2.5 py-1 rounded-lg border border-slate-700">
                      Ep {shows[currentIndex].currentEpisode + 1 || 1}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className={`text-white font-semibold truncate ${isFeatured ? 'text-sm' : 'text-xs'}`} title={shows[currentIndex].title}>
                      {shows[currentIndex].title}
                    </h4>
                    {shows[currentIndex].releaseTime && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{shows[currentIndex].releaseTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Slider Navigation Controls */}
              {shows.length > 1 && (
                <div className="flex items-center justify-between mt-2 px-1">
                  <button
                    onClick={() => handlePrevSlide(day, maxIndex)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                    title="Previous Show"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-400 font-medium">
                    {currentIndex + 1} / {shows.length}
                  </span>
                  <button
                    onClick={() => handleNextSlide(day, maxIndex)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                    title="Next Show"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* View Details Button */}
        <button
          disabled={shows.length === 0}
          onClick={() => setSelectedDayDetails({ day, shows })}
          className={`w-full py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition ${
            shows.length > 0
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              : 'bg-slate-950 text-slate-600 cursor-not-allowed'
          }`}
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-xl">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-500" />
            Weekly Schedule
          </h2>
          <p className="text-slate-400 text-sm">
            Featured daily lineup with quick access to the full weekly schedule.
          </p>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 flex flex-col">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Featured Today
          </div>
          {renderDayCard(activeToday, true)}
        </div>

        <div className="lg:col-span-8 flex flex-col">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Other Days of the Week
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {otherDays.map((day) => renderDayCard(day, false))}
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedDayDetails && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {selectedDayDetails.day} Schedule
                </h3>
                <p className="text-slate-400 text-xs">
                  All {selectedDayDetails.shows.length} show(s) airing on this day
                </p>
              </div>
              <button
                onClick={() => setSelectedDayDetails(null)}
                className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 pr-1 flex-1">
              {selectedDayDetails.shows.map((show) => (
                <div
                  key={show.id}
                  className="flex items-center gap-4 bg-slate-950 border border-slate-800 rounded-2xl p-3"
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
                    <h4 className="text-white text-sm font-semibold truncate">{show.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="bg-slate-800 text-indigo-400 px-2 py-0.5 rounded-md font-medium">
                        {show.type}
                      </span>
                      {show.releaseTime && (
                        <span className="flex items-center gap-1 text-slate-300">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          {show.releaseTime}
                        </span>
                      )}
                    </div>
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