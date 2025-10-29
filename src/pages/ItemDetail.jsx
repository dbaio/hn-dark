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
          setComments(fetchedComments.filter(comment => comment && !comment.dead && !comment.deleted));
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

  const upvoteUrl = `https://news.ycombinator.com/item?id=${item.id}`;

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-2">
        <div className="mb-4">
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="align-top" style={{ width: '1%', paddingRight: '4px' }}>
                  <a
                    href={upvoteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-1"
                    title="Upvote on Hacker News"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      className="fill-slate-600 hover:fill-orange-500 transition-colors"
                      style={{ display: 'block' }}
                    >
                      <path d="M0 7l5-7 5 7z" />
                    </svg>
                  </a>
                </td>
                <td className="align-top">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-slate-400 hover:underline leading-tight block mb-1"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <h1 className="text-base text-slate-400 mb-1">{item.title}</h1>
                  )}
                  <div className="text-xs text-slate-500">
                    {item.score !== undefined && `${item.score} points `}
                    <span>by </span>
                    <Link
                      to={`/user/${item.by}`}
                      className="hover:underline text-slate-400 hover:text-slate-300"
                    >
                      {item.by}
                    </Link>
                    {item.time && ` ${timeAgo(item.time)}`}
                    {item.url && (
                      <Link
                        to={`/from?site=${getDomain(item.url)}`}
                        className="ml-1 hover:underline text-slate-400 hover:text-slate-300"
                      >
                        ({getDomain(item.url)})
                      </Link>
                    )}
                    {item.kids && item.kids.length > 0 && (
                      <span className="ml-1">
                        | {item.kids.length} {item.kids.length === 1 ? 'comment' : 'comments'}
                      </span>
                    )}
                    {item.id && (
                      <span className="ml-1">
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {item.text && (
          <div
            className="mb-4 text-xs text-slate-300 leading-normal [&_pre]:whitespace-pre-wrap [&_p]:mb-1.5 [&_code]:bg-slate-800 [&_code]:px-1 [&_code]:rounded [&_a]:text-slate-400 [&_a]:hover:underline"
            dangerouslySetInnerHTML={{ __html: item.text }}
          />
        )}

        {comments.length > 0 && (
          <div className="border-t border-slate-700 pt-3 mt-4">
            <h2 className="text-lg text-slate-300 mb-4">Comments</h2>
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} depth={0} parentItemId={item.id} />
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

