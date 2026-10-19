import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSettings } from '../features/settings/settingsSlice';
import { requestNotificationPermission } from '../services/notifications';
import { Bell, ShieldCheck } from 'lucide-react';

export default function Settings() {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const [permissionStatus, setPermissionStatus] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setPermissionStatus(granted ? 'granted' : 'denied');
    if (granted) {
      dispatch(updateSettings({ notificationsEnabled: true }));
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-slate-400 text-sm">Configure your app preferences and notification permissions.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold">Browser Notifications</h4>
              <p className="text-xs text-slate-400">Current status: <span className="capitalize text-indigo-400 font-semibold">{permissionStatus}</span></p>
            </div>
          </div>
          {permissionStatus !== 'granted' && (
            <button
              onClick={handleEnableNotifications}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-600/30"
            >
              Enable Notifications
            </button>
          )}
        </div>

        <div className="border-t border-slate-800 pt-6">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Timezone</label>
          <input
            type="text"
            value={settings.timezone}
            onChange={(e) => dispatch(updateSettings({ timezone: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>
      </div>
    </div>
  );
}