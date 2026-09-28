/*
  SETUP:
  1) Get a YouTube Data API v3 key (instructions in README.md).
  2) Paste it into apiKey below.
  3) Optional: add a supportUrl for each channel after a parent/guardian helps set up a suitable donation page.
  Note: a browser-based API key is visible to visitors. Restrict it to YouTube Data API v3
  and your GitHub Pages website's HTTP referrers in Google Cloud Console.
*/
window.CREATOR_HUB_CONFIG = {
  apiKey: "PASTE_YOUR_YOUTUBE_DATA_API_KEY_HERE",
  channels: {
    mason: {
      name: "Maybe Mason",
      handle: "@maybe_mason",
      handleForApi: "maybe_mason",
      url: "https://www.youtube.com/@maybe_mason",
      description: "Videos, gaming, and more.",
      supportUrl: ""
    },
    brother: {
      name: "HashMC",
      handle: "@hashmc",
      handleForApi: "hashmc",
      url: "https://www.youtube.com/@hashmc",
      description: "Gaming, Minecraft, and more.",
      supportUrl: ""
    }
  }
};
