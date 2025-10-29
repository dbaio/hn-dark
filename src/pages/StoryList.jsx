import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getStoryIds, getItem } from '../services/hnApi';
import Post from '../components/Post';
import Navigation from '../components/Navigation';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';

export default function StoryList({ type = 'top' }) {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const [stories, setStories] = useState([]);
  const [allIds, setAllIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storiesPerPage = 30;

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      setError(null);
      try {
        const ids = await getStoryIds(type);
        setAllIds(ids);
        
        const startIndex = (page - 1) * storiesPerPage;
        const endIndex = startIndex + storiesPerPage;
        const pageIds = ids.slice(startIndex, endIndex);
        
        const storyPromises = pageIds.map((id) => getItem(id));
        const fetchedStories = await Promise.all(storyPromises);
        setStories(fetchedStories.filter(story => story && !story.dead && !story.deleted));
      } catch (err) {
        setError('Failed to fetch stories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [type, page]);

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

  if (error) {
    return (
      <div>
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto">
        <div>
          {stories.map((story, index) => {
            const startIndex = (page - 1) * storiesPerPage;
            return <Post key={story.id} post={story} index={startIndex + index} />;
          })}
        </div>
        <Pagination currentPage={page} hasNext={(page * storiesPerPage) < allIds.length} />
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

