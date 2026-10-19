import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Watchlist from './pages/Watchlist';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import MediaForm from './components/MediaForm';
import ReleaseForm from './components/ReleaseForm';
import Schedule from './pages/Schedule';
import { sendReleaseNotification } from './services/notifications';
import { markReleaseNotified } from './features/releases/releasesSlice';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMediaFormOpen, setIsMediaFormOpen] = useState(false);
  const [isReleaseFormOpen, setIsReleaseFormOpen] = useState(false);
  const [mediaToEdit, setMediaToEdit] = useState(null);
  const [preselectedMediaId, setPreselectedMediaId] = useState(null);

  const dispatch = useDispatch();
  const releases = useSelector((state) => state.releases.items);
  const mediaItems = useSelector((state) => state.media.items);
  const settings = useSelector((state) => state.settings);

  // Background notification checker interval (runs while app is open)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      releases.forEach((release) => {
        const isDue =
          release.status === 'UPCOMING' &&
          release.notificationEnabled &&
          !release.notifiedAt &&
          new Date(release.releaseDateTime).getTime() <= now;

        if (isDue) {
          const media = mediaItems.find((m) => m.id === release.mediaId);
          sendReleaseNotification(release, media);
          dispatch(markReleaseNotified(release.id));
        }
      });
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [releases, mediaItems, dispatch]);

  const handleOpenMediaForm = (media = null) => {
    setMediaToEdit(media);
    setIsMediaFormOpen(true);
  };

  const handleOpenReleaseForm = (mediaId = null) => {
    setPreselectedMediaId(mediaId);
    setIsReleaseFormOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1 overflow-y-auto p-8">
        {currentTab === 'dashboard' && (
          <Dashboard
            onOpenMediaForm={() => handleOpenMediaForm(null)}
            onOpenReleaseForm={() => handleOpenReleaseForm(null)}
          />
        )}
        {currentTab === 'watchlist' && (
          <Watchlist
            onOpenMediaForm={() => handleOpenMediaForm(null)}
            onEditMedia={handleOpenMediaForm}
            onAddRelease={handleOpenReleaseForm}
          />
        )}
        {currentTab === 'schedule' && <Schedule />}
        {currentTab === 'calendar' && <Calendar />}
        {currentTab === 'settings' && <Settings />}
      </main>

      {isMediaFormOpen && (
        <MediaForm
          mediaToEdit={mediaToEdit}
          onClose={() => {
            setIsMediaFormOpen(false);
            setMediaToEdit(null);
          }}
        />
      )}

      {isReleaseFormOpen && (
        <ReleaseForm
          preselectedMediaId={preselectedMediaId}
          onClose={() => {
            setIsReleaseFormOpen(false);
            setPreselectedMediaId(null);
          }}
        />
      )}
    </div>
  );
}