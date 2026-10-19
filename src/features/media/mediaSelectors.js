export const selectFilteredMedia = (state) => {
  const { items, searchQuery, filterStatus, filterType } = state.media;

  return items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || item.status === filterStatus;
    const matchesType = filterType === "ALL" || item.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });
};

export const selectMediaStats = (state) => {
  const items = state.media.items;
  return {
    watching: items.filter(i => i.status === "WATCHING").length,
    upcoming: items.filter(i => i.status === "PLANNING").length,
    completed: items.filter(i => i.status === "COMPLETED").length,
    total: items.length,
  };
};