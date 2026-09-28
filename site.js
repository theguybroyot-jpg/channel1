(() => {
  const cfg = window.CREATOR_HUB_CONFIG;
  if (!cfg) return;
  const key = cfg.apiKey;
  const status = document.getElementById("chooser-status");
  if (!key || key.includes("PASTE_")) {
    if (status) status.textContent = "Setup needed: add your YouTube Data API key in channel-config.js to load profile pictures automatically.";
    return;
  }
  async function loadAvatar(id, channel) {
    try {
      const params = new URLSearchParams({ part: "snippet", forHandle: channel.handleForApi, key });
      const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?${params}`);
      if (!res.ok) throw new Error("YouTube API request failed");
      const data = await res.json();
      const item = data.items && data.items[0];
      if (item && item.snippet && item.snippet.thumbnails) {
        const thumbs = item.snippet.thumbnails;
        const image = thumbs.high || thumbs.medium || thumbs.default;
        if (image && image.url) document.getElementById(id).src = image.url;
      }
    } catch (_) {
      if (status) status.textContent = "Could not load channel pictures. Check the API key and channel handles in channel-config.js.";
    }
  }
  loadAvatar("mason-avatar", cfg.channels.mason);
  loadAvatar("brother-avatar", cfg.channels.brother);
})();
