(() => {
  const cfg = window.CREATOR_HUB_CONFIG;
  const key = cfg && cfg.apiKey;
  const kind = document.body.dataset.channel;
  const channel = cfg && cfg.channels[kind];
  const $ = (id) => document.getElementById(id);
  if (!channel) return;

  document.title = `${channel.name} — Creator Hub`;
  $("channel-name").textContent = channel.name;
  $("channel-handle").textContent = channel.handle;
  $("channel-description").textContent = channel.description;
  $("subscribe-button").href = channel.url;
  $("all-videos-link").href = `${channel.url}/videos`;
  if (channel.supportUrl) {
    $("donate-button").href = channel.supportUrl;
    $("donate-button").hidden = false;
  }

  const grid = $("video-grid");
  const status = $("video-status");
  function showSetupMessage(message) {
    grid.innerHTML = "";
    const card = document.createElement("div");
    card.className = "loading-card";
    card.textContent = message;
    grid.appendChild(card);
  }
  if (!key || key.includes("PASTE_")) {
    showSetupMessage("Add your YouTube Data API key in channel-config.js to automatically load videos.");
    status.textContent = "Until setup is complete, use the Subscribe or View on YouTube buttons above.";
    return;
  }

  function thumbFor(video) {
    const t = video.snippet.thumbnails || {};
    return (t.maxres || t.standard || t.high || t.medium || t.default || {}).url || "";
  }
  function niceDate(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
  }
  async function load() {
    try {
      const params = new URLSearchParams({ part: "snippet,contentDetails", forHandle: channel.handleForApi, maxResults: "1", key });
      const channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?${params}`);
      const channelData = await channelRes.json();
      if (!channelRes.ok) throw new Error(channelData.error?.message || "Could not load channel.");
      const info = channelData.items && channelData.items[0];
      if (!info) throw new Error("Channel not found. Check the handle in channel-config.js.");
      const thumbs = info.snippet.thumbnails || {};
      const avatar = thumbs.high || thumbs.medium || thumbs.default;
      if (avatar && avatar.url) $("channel-avatar").src = avatar.url;

      const uploadsId = info.contentDetails.relatedPlaylists.uploads;
      const videoParams = new URLSearchParams({ part: "snippet,contentDetails", playlistId: uploadsId, maxResults: "12", key });
      const videoRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${videoParams}`);
      const videoData = await videoRes.json();
      if (!videoRes.ok) throw new Error(videoData.error?.message || "Could not load videos.");
      const items = (videoData.items || []).filter(item => item.snippet && item.snippet.resourceId && item.snippet.resourceId.videoId);
      grid.innerHTML = "";
      if (!items.length) {
        showSetupMessage("No public uploads were found for this channel yet.");
        return;
      }
      items.forEach(item => {
        const sn = item.snippet;
        const videoId = sn.resourceId.videoId;
        const link = document.createElement("a");
        link.className = "video-card";
        link.href = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
        link.target = "_blank";
        link.rel = "noopener";
        const image = document.createElement("img");
        image.className = "video-thumb";
        image.src = thumbFor(item);
        image.alt = "";
        image.loading = "lazy";
        const body = document.createElement("div");
        body.className = "video-info";
        const title = document.createElement("h3");
        title.textContent = sn.title || "Untitled video";
        const date = document.createElement("p");
        date.className = "video-date";
        date.textContent = niceDate(sn.publishedAt);
        const action = document.createElement("span");
        action.className = "video-open";
        action.textContent = "Watch on YouTube ↗";
        body.append(title, date, action);
        link.append(image, body);
        grid.appendChild(link);
      });
      status.textContent = "Showing the latest public uploads. New uploads appear when the page reloads and YouTube's API updates.";
    } catch (error) {
      showSetupMessage("Videos could not be loaded right now.");
      status.textContent = `${error.message} Check your API key, quota, and channel handle in channel-config.js.`;
    }
  }
  load();
})();
