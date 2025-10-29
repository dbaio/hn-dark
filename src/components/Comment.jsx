import { useState, useEffect } from 'react';
import { timeAgo, getItem } from '../services/hnApi';
import { Link } from 'react-router-dom';

export default function Comment({ comment, depth = 0, parentItemId = null }) {
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    if (comment && comment.kids && comment.kids.length > 0) {
      const fetchReplies = async () => {
        const replyPromises = comment.kids.map((kidId) => getItem(kidId));
        const fetchedReplies = await Promise.all(replyPromises);
        setReplies(fetchedReplies.filter(Boolean));
      };
      fetchReplies();
    }
  }, [comment]);

  if (!comment || !comment.text || comment.deleted || comment.dead) return null;

  const maxDepth = 5;
  // Use smaller indentation multiplier for better mobile experience
  const indentPixels = Math.min(depth, maxDepth) * 0.25;

  // Link to the item page where this comment appears (use parent item ID if available, otherwise fallback to comment ID)
  const upvoteUrl = `https://news.ycombinator.com/item?id=${parentItemId || comment.id}`;
  // Link to reply to this comment on HN - use reply endpoint with comment ID
  const replyUrl = `https://news.ycombinator.com/reply?id=${comment.id}`;

  return (
    <div className="py-1">
      <table className="w-full border-collapse">
        <tbody>
          <tr>
            <td className="align-top" style={{ width: depth > 0 ? `${indentPixels}px` : '0px' }}>
              {depth > 0 && <div className="border-l border-slate-700 h-full" style={{ marginLeft: '4px' }}></div>}
            </td>
            <td className="align-top">
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
                      <div className="text-xs text-slate-500 mb-0.5">
                        <Link
                          to={`/user/${comment.by}`}
                          className="hover:underline text-slate-400 hover:text-slate-300"
                        >
                          {comment.by}
                        </Link>
                        {comment.time && ` ${timeAgo(comment.time)}`}
                      </div>
                      <div
                        className="text-xs text-slate-300 leading-normal [&_pre]:whitespace-pre-wrap [&_p]:mb-1.5 [&_code]:bg-slate-800 [&_code]:px-1 [&_code]:rounded [&_a]:text-slate-400 [&_a]:hover:underline"
                        dangerouslySetInnerHTML={{ __html: comment.text }}
                      />
                      <div className="text-xs text-slate-500 mt-0.5">
                        <a
                          href={replyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-slate-400 hover:text-slate-300"
                        >
                          reply
                        </a>
                      </div>
                      {replies.length > 0 && (
                        <div className="mt-1.5">
                          {replies.map((reply) => (
                            <Comment key={reply.id} comment={reply} depth={depth + 1} parentItemId={parentItemId} />
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

