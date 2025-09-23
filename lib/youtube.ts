export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  views: string;
  duration: string;
}

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string;

const isoDurationToHMS = (iso: string): string => {
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso);
  if (!match) return '';
  const h = parseInt(match[1] || '0', 10);
  const m = parseInt(match[2] || '0', 10);
  const s = parseInt(match[3] || '0', 10);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};

const formatViews = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K views`;
  return `${n} views`;
};

export const fetchYouTubeVideos = async (query: string, lang: string = 'en'): Promise<YouTubeVideo[]> => {
  if (!API_KEY) return [];
  const relevanceLanguage = ['en', 'hi', 'ta', 'ml'].includes(lang) ? lang : 'en';
  const regionCode = 'IN';

  const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
  searchUrl.searchParams.set('key', API_KEY);
  searchUrl.searchParams.set('part', 'snippet');
  searchUrl.searchParams.set('q', query);
  searchUrl.searchParams.set('maxResults', '8');
  searchUrl.searchParams.set('type', 'video');
  searchUrl.searchParams.set('videoEmbeddable', 'true');
  searchUrl.searchParams.set('safeSearch', 'moderate');
  searchUrl.searchParams.set('relevanceLanguage', relevanceLanguage);
  searchUrl.searchParams.set('regionCode', regionCode);

  const searchRes = await fetch(searchUrl.toString());
  const searchJson = await searchRes.json();
  const ids: string[] = (searchJson.items || []).map((i: any) => i.id.videoId).filter(Boolean);
  if (ids.length === 0) return [];

  const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
  videosUrl.searchParams.set('key', API_KEY);
  videosUrl.searchParams.set('part', 'contentDetails,statistics,snippet');
  videosUrl.searchParams.set('id', ids.join(','));

  const videosRes = await fetch(videosUrl.toString());
  const videosJson = await videosRes.json();

  return (videosJson.items || []).map((v: any) => {
    const duration = isoDurationToHMS(v.contentDetails?.duration || '');
    const views = formatViews(parseInt(v.statistics?.viewCount || '0', 10));
    return {
      id: v.id,
      title: v.snippet?.title || '',
      thumbnail: v.snippet?.thumbnails?.high?.url || '',
      channel: v.snippet?.channelTitle || '',
      views,
      duration,
    } as YouTubeVideo;
  });
};
