import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getItem } from '../services/hnApi';
import Post from '../components/Post';
import Navigation from '../components/Navigation';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';

export default function Past() {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const storiesPerPage = 30;

  useEffect(() => {
    const fetchPastStories = async () => {
      setLoading(true);
      try {
        // Fetch stories from IDs 1 to 500 (past items)
        const maxId = 500;
        const step = 10;
        const ids = [];
        
        for (let i = 1; i <= maxId; i += step) {
          ids.push(...Array.from({ length: step }, (_, idx) => i + idx));
        }
        
        // Fetch in batches to avoid overwhelming the API
        const batches = [];
        for (let i = 0; i < ids.length; i += 30) {
          batches.push(ids.slice(i, i + 30));
        }
        
        const fetchedStories = [];
        for (const batch of batches.slice(0, 10)) {
          const storyPromises = batch.map((id) => getItem(id));
          const results = await Promise.all(storyPromises);
          fetchedStories.push(...results.filter(Boolean));
        }
        
        // Filter for story items and sort by score
        const storyItems = fetchedStories
          .filter((item) => item.type === 'story' && item.title)
          .sort((a, b) => (b.score || 0) - (a.score || 0));
        
        const startIndex = (page - 1) * storiesPerPage;
        const endIndex = startIndex + storiesPerPage;
        const pageStories = storyItems.slice(startIndex, endIndex);
        
        setStories(pageStories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPastStories();
  }, [page]);

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto">
        <div className="bg-slate-800 border-t border-slate-700">
          {stories.map((story, index) => {
            const startIndex = (page - 1) * storiesPerPage;
            return <Post key={story.id} post={story} index={startIndex + index} />;
          })}
        </div>
        <Pagination currentPage={page} hasNext={stories.length === storiesPerPage} />
      </main>
      <footer className="max-w-4xl mx-auto px-4 py-4 text-center text-xs text-slate-600">
        <p>
          <a
            href="https://github.com/dbaio/hn-dark"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-slate-500 hover:text-slate-400"
          >
            View source on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

