export type Video = {
  id: string;
  title: string;
  published?: string;
};

/**
 * Try to fetch videos for a channel using public RSS feeds.
 * Accepts either a channel handle like @thenulledge or a full YouTube channel/user URL.
 * This implementation uses simple text parsing so we don't need extra dependencies.
 */
export async function fetchChannelVideos(channelHandleOrUrl: string, max = 12): Promise<Video[]> {
  // Normalize input: if it looks like a handle (@thenulledge) use the legacy feed via user? not supported
  // We'll attempt two strategies:
  // 1) If input contains "@" (handle), try to fetch the channel page and extract the channelId
  // 2) If input is a full URL containing /channel/CHANNEL_ID, use that ID directly

  async function fetchChannelIdFromPage(url: string): Promise<string | null> {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'nulledge-site/1.0' } });
      console.log(`Fetching channel ID from page: ${url}`);
      if (!res.ok) return null;
      const text = await res.text();
      // channelId appears in "channelId":"UC..."
      const match = text.match(/"channelId"\s*:\s*"(UC[0-9A-Za-z_-]{20,})"/);
      return match ? match[1] : null;
    } catch (e) {
      return null;
    }
  }

  // Resolve channel ID
  let channelId: string | null = null;

  // Directly handle the known @thenulledge handle to use the explicit URL
  if (channelHandleOrUrl === '@thenulledge' || channelHandleOrUrl === 'thenulledge') {
    const handleUrl = 'https://www.youtube.com/@thenulledge';
    channelId = await fetchChannelIdFromPage(handleUrl);
  } else if (channelHandleOrUrl.startsWith('http')) {
    // try to extract /channel/ID
    const m = channelHandleOrUrl.match(/\/channel\/(UC[0-9A-Za-z_-]{20,})/);
    if (m) channelId = m[1];
    else {
      // try to extract from the page
      channelId = await fetchChannelIdFromPage(channelHandleOrUrl);
    }
  } else if (channelHandleOrUrl.startsWith('@')) {
    // construct the handle URL and fetch
    const handleUrl = `https://www.youtube.com/${channelHandleOrUrl}`;
    channelId = await fetchChannelIdFromPage(handleUrl);
  } else {
    // unknown form, try to treat as handle
    const handleUrl = `https://www.youtube.com/${channelHandleOrUrl}`;
    channelId = await fetchChannelIdFromPage(handleUrl);
  }

  if (!channelId) return [];

  // YouTube provides an RSS feed at https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  try {
    const res = await fetch(feedUrl, { headers: { 'User-Agent': 'nulledge-site/1.0' } });
    if (!res.ok) return [];
    const xml = await res.text();

    // Very small and forgiving XML parsing to avoid bringing in a dependency.
    // Split entries by <entry>...</entry>
    const entryMatches = Array.from(xml.matchAll(/<entry[\s\S]*?<\/entry>/g));
    const items = entryMatches.slice(0, max).map((m) => m[0]);

    const videos: Video[] = items.map((entry) => {
      const idMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
      const pubMatch = entry.match(/<published>(.*?)<\/published>/);
      const id = idMatch ? idMatch[1] : '';
      const title = titleMatch ? titleMatch[1].replace(/\n+/g, ' ').trim() : 'Video';
      const published = pubMatch ? pubMatch[1] : undefined;
      return { id, title, published };
    }).filter((v) => v.id);

    return videos;
  } catch (e) {
    return [];
  }
}

export default fetchChannelVideos;
