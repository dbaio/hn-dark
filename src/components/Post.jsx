import { timeAgo, getDomain } from '../services/hnApi';
import { Link } from 'react-router-dom';

export default function Post({ post, index, showIndex = true }) {
  if (!post) return null;

  const upvoteUrl = `https://news.ycombinator.com/item?id=${post.id}`;

  return (
    <div className="border-b border-slate-700 py-2 px-3 hover:bg-slate-800/50 transition-colors">
      <table className="w-full border-collapse">
        <tbody>
          <tr>
            <td className="align-top pr-1" style={{ width: '1%' }}>
              {showIndex && (
                <span className="text-xs text-slate-500 pr-1">
                  {index + 1}.
                </span>
              )}
            </td>
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
              <div className="flex items-center gap-1 mb-0.5">
                {post.url ? (
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 hover:underline leading-tight"
                  >
                    {post.title}
                  </a>
                ) : (
                  <Link
                    to={`/item/${post.id}`}
                    className="text-sm text-slate-400 hover:underline leading-tight"
                  >
                    {post.title}
                  </Link>
                )}
                {post.url && (
                  <span className="text-xs text-slate-500">
                    ({getDomain(post.url)})
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500">
                {post.score !== undefined && `${post.score} points `}
                <span>by </span>
                <Link
                  to={`/user/${post.by}`}
                  className="hover:underline text-slate-400 hover:text-slate-300"
                >
                  {post.by}
                </Link>
                {post.time && ` ${timeAgo(post.time)}`}
                {post.descendants !== undefined && (
                  <Link
                    to={`/item/${post.id}`}
                    className="ml-1 hover:underline text-slate-400 hover:text-slate-300"
                  >
                    | {post.descendants || 0} comments
                  </Link>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

