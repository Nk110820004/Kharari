export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  views: string;
  duration: string;
}

// This is a mock function. In a real application, this would
// make an API call to the YouTube Data API.
export const fetchYouTubeVideos = async (query: string): Promise<YouTubeVideo[]> => {
  console.log(`Simulating YouTube search for: "${query}"`);

  // Return a static list of mock videos. The number of videos is randomized between 2 and 7.
  const mockVideos: YouTubeVideo[] = [
    {
      id: 'dQw4w9WgXcQ',
      title: 'Introduction to ' + query,
      thumbnail: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
      channel: 'Code Academy',
      views: '2.1M views',
      duration: '12:45',
    },
    {
      id: 'placeholder2',
      title: 'Deep Dive into ' + query,
      thumbnail: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
      channel: 'Tech Tutorials',
      views: '890K views',
      duration: '25:10',
    },
    {
      id: 'placeholder3',
      title: 'Mastering ' + query + ' in 30 minutes',
      thumbnail: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
      channel: 'LearnFast',
      views: '1.5M views',
      duration: '30:02',
    },
     {
      id: 'placeholder4',
      title: 'Practical Examples of ' + query,
      thumbnail: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
      channel: 'DevSimplified',
      views: '450K views',
      duration: '18:22',
    },
     {
      id: 'placeholder5',
      title: query + ' Complete Course',
      thumbnail: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
      channel: 'FreeCodeCamp',
      views: '5.2M views',
      duration: '1:45:30',
    },
     {
      id: 'placeholder6',
      title: 'Common Mistakes in ' + query,
      thumbnail: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
      channel: 'ProGrammer',
      views: '312K views',
      duration: '09:15',
    },
     {
      id: 'placeholder7',
      title: 'Advanced ' + query + ' Techniques',
      thumbnail: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
      channel: 'Expert Coder',
      views: '650K views',
      duration: '45:00',
    }
  ];

  const count = Math.floor(Math.random() * 6) + 2; // Random number between 2 and 7
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return mockVideos.slice(0, count);
};