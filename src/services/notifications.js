export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return false;
  }
  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function sendReleaseNotification(release, media) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return false;
  }

  const notification = new Notification(`${media?.title || "Release"} is releasing!`, {
    body: release.label || "A new release is due.",
    icon: media?.posterUrl || undefined,
    tag: `release-${release.id}`,
  });

  return notification;
}