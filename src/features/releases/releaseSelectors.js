export const selectUpcomingReleases = (state) => {
  const now = Date.now();
  return state.releases.items
    .filter(release => new Date(release.releaseDateTime).getTime() >= now && release.status === "UPCOMING")
    .slice()
    .sort((a, b) => new Date(a.releaseDateTime).getTime() - new Date(b.releaseDateTime).getTime());
};

export const selectTodayReleases = (state) => {
  const todayStr = new Date().toDateString();
  return state.releases.items.filter(release => {
    const releaseDate = new Date(release.releaseDateTime);
    return releaseDate.toDateString() === todayStr;
  });
};

export const selectReleasesByMediaId = (state, mediaId) => {
  return state.releases.items.filter(r => r.mediaId === mediaId);
};