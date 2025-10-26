import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getStoryIds, getItem } from '../services/hnApi';
import Navigation from '../components/Navigation';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';
import { timeAgo } from '../services/hnApi';

export default function Comments() {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const storiesPerPage = 30;

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        // Get the top stories and find the ones with most comments
        const ids = await getStoryIds('top');
        const storyPromises = ids.slice(0, 200).map((id) => getItem(id));
        const fetchedStories = await Promise.all(storyPromises);
        
        // Filter items that are likely comment threads (no URL) and sort by number of kids
        const commentThreads = fetchedStories
          .filter((story) => story && story.kids && story.kids.length > 0)
          .sort((a, b) => (b.descendants || 0) - (a.descendants || 0));
        
        const startIndex = (page - 1) * storiesPerPage;
        const endIndex = startIndex + storiesPerPage;
        const pageStories = commentThreads.slice(startIndex, endIndex);
        
        setStories(pageStories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
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
            return (
            <div
              key={story.id}
              className="border-b border-slate-700 py-3 px-4 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-start gap-2">
                <span className="text-sm text-slate-500 min-w-[2rem]">
                  {startIndex + index + 1}.
                </span>
                <div className="flex-1">
                  <Link
                    to={`/item/${story.id}`}
                    className="text-sm text-slate-300 hover:text-white leading-tight block"
                  >
                    {story.title}
                  </Link>
                  <div className="text-xs text-slate-500 mt-1">
                    {story.score !== undefined && `${story.score} points by `}
                    <Link
                      to={`/user/${story.by}`}
                      className="hover:underline text-slate-400 hover:text-slate-300"
                    >
                      {story.by}
                    </Link>
                    {story.time && ` ${timeAgo(story.time)}`}
                    <span className="ml-2">
                      | {story.descendants || 0} comments
                    </span>
                  </div>
                </div>
              </div>
            </div>
            );
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

