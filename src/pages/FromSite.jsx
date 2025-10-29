import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getStoriesFromDomain } from '../services/hnApi';
import Post from '../components/Post';
import Navigation from '../components/Navigation';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';

export default function FromSite() {
  const [searchParams] = useSearchParams();
  const site = searchParams.get('site');
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const [stories, setStories] = useState([]);
  const [totalHits, setTotalHits] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoriesFromSite = async () => {
      if (!site) {
        setError('No site specified');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Algolia API uses 0-based pagination
        const result = await getStoriesFromDomain(site, page - 1);
        setStories(result.stories);
        setTotalHits(result.totalHits);
        setHasMore(result.hasMore || false);
      } catch (err) {
        setError('Failed to fetch stories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoriesFromSite();
  }, [site, page]);

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
      <main className="max-w-4xl mx-auto px-4 py-4">
        <div className="mb-4 text-sm text-slate-400">
          <a
            href={`https://news.ycombinator.com/from?site=${site}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Stories from {site}
          </a>
        </div>
        <div>
          {stories.length > 0 ? (
              stories.map((story, index) => {
              const startIndex = (page - 1) * 30;
              return <Post key={`${story.id}-${index}`} post={story} index={startIndex + index} />;
            })
          ) : (
            <div className="text-center text-slate-500 py-8">
              No stories found from {site}
            </div>
          )}
        </div>
        {(stories.length > 0 || page > 1) && (
          <Pagination
            currentPage={page}
            hasNext={hasMore}
          />
        )}
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

