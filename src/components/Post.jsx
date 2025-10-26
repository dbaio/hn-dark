import { timeAgo, getDomain } from '../services/hnApi';
import { Link } from 'react-router-dom';

export default function Post({ post, index, showIndex = true }) {
  if (!post) return null;

  const isAsk = post.title && post.title.toLowerCase().startsWith('ask hn:');
  const isShow = post.title && post.title.toLowerCase().startsWith('show hn:');

  return (
    <div className="border-b border-slate-700 py-3 px-4 hover:bg-slate-800/50 transition-colors">
      <div className="flex items-start gap-2">
        {showIndex && (
          <span className="text-sm text-slate-500 min-w-[2rem]">
            {index + 1}.
          </span>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {post.url ? (
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-300 hover:text-white leading-tight"
              >
                {post.title}
              </a>
            ) : (
              <Link
                to={`/item/${post.id}`}
                className="text-sm text-slate-300 hover:text-white leading-tight"
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
            {post.score !== undefined && `${post.score} points by `}
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
                className="ml-2 hover:underline text-slate-400 hover:text-slate-300"
              >
                | {post.descendants || 0} comments
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

