const API_BASE = 'https://hacker-news.firebaseio.com/v0';

// Fetch story IDs by type
export const getStoryIds = async (type = 'top') => {
  const types = {
    top: 'topstories',
    new: 'newstories',
    best: 'beststories',
    ask: 'askstories',
    show: 'showstories',
    jobs: 'jobstories',
  };
  
  try {
    const response = await fetch(`${API_BASE}/${types[type] || types.top}.json`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching story IDs:', error);
    return [];
  }
};

// Fetch item details
export const getItem = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/item/${id}.json`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching item:', error);
    return null;
  }
};

// Fetch user details
export const getUser = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/user/${id}.json`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Helper to get domain from URL
export const getDomain = (url) => {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return '';
  }
};

// Fetch stories from a specific domain using Algolia Search API
export const getStoriesFromDomain = async (domain, page = 0) => {
  const hitsPerPage = 50; // Fetch more to account for filtering
  try {
    const query = encodeURIComponent(domain);
    const response = await fetch(
      `https://hn.algolia.com/api/v1/search_by_date?query=${query}&restrictSearchableAttributes=url&hitsPerPage=${hitsPerPage}&page=${page}&numericFilters=story_id>0`
    );
    const data = await response.json();
    
    if (!data.hits || data.hits.length === 0) {
      return { stories: [], totalHits: 0, hasMore: false };
    }
    
    const filtered = data.hits
      .filter(hit => {
        if (!hit.url || !hit.title) return false;
        if (hit.title === '[deleted]' || hit.author === null || hit._tags?.includes('dead')) return false;
        const hitDomain = getDomain(hit.url);
        return hitDomain === domain;
      })
      .map(hit => ({
        id: parseInt(hit.objectID) || hit.story_id,
        title: hit.title,
        url: hit.url,
        by: hit.author,
        score: hit.points || 0,
        time: hit.created_at_i,
        descendants: hit.num_comments || 0,
        kids: hit.children || [],
      }));
    
    const hasMore = data.hits.length === hitsPerPage && 
                    (page + 1) * hitsPerPage < 1000 &&
                    filtered.length > 0;
    
    return {
      stories: filtered,
      totalHits: data.nbHits || filtered.length,
      hasMore: hasMore,
    };
  } catch (error) {
    console.error('Error fetching stories from domain:', error);
    return { stories: [], totalHits: 0, hasMore: false };
  }
};

// Helper to format time
export const timeAgo = (timestamp) => {
  if (!timestamp) return '';
  
  const seconds = Math.floor((Date.now() - timestamp * 1000) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
};

