import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getItem, timeAgo, getDomain } from '../services/hnApi';
import Comment from '../components/Comment';
import Navigation from '../components/Navigation';
import Loading from '../components/Loading';

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const fetchedItem = await getItem(id);
        setItem(fetchedItem);

        if (fetchedItem && fetchedItem.kids) {
          const commentPromises = fetchedItem.kids.map((kidId) => getItem(kidId));
          const fetchedComments = await Promise.all(commentPromises);
          setComments(fetchedComments.filter(Boolean));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

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

  if (!item) {
    return (
      <div>
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-red-400">Item not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl text-slate-200 hover:text-white leading-tight block mb-2"
            >
              {item.title}
            </a>
          ) : (
            <h1 className="text-xl text-slate-200 mb-2">{item.title}</h1>
          )}
          <div className="text-xs text-slate-500">
            {item.score !== undefined && `${item.score} points by `}
            <Link
              to={`/user/${item.by}`}
              className="hover:underline text-slate-400 hover:text-slate-300"
            >
              {item.by}
            </Link>
            {item.time && ` ${timeAgo(item.time)}`}
            {item.url && (
              <span className="ml-2">({getDomain(item.url)})</span>
            )}
            {item.kids && item.kids.length > 0 && (
              <span className="ml-2">
                | {item.kids.length} {item.kids.length === 1 ? 'comment' : 'comments'}
              </span>
            )}
            {item.id && (
              <span className="ml-2">
                | <a
                  href={`https://news.ycombinator.com/item?id=${item.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-slate-400 hover:text-slate-300"
                >
                  view on HN
                </a>
              </span>
            )}
          </div>
        </div>

        {item.text && (
          <div
            className="mb-6 text-slate-300 leading-relaxed [&_pre]:whitespace-pre-wrap [&_p]:mb-2 [&_code]:bg-slate-800 [&_code]:px-1 [&_code]:rounded"
            dangerouslySetInnerHTML={{ __html: item.text }}
          />
        )}

        {comments.length > 0 && (
          <div className="border-t border-slate-700 pt-6">
            <h2 className="text-lg text-slate-300 mb-4">Comments</h2>
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} depth={0} />
            ))}
          </div>
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

