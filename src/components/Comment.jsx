import { useState, useEffect } from 'react';
import { timeAgo, getItem } from '../services/hnApi';
import { Link } from 'react-router-dom';

export default function Comment({ comment, depth = 0 }) {
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

  if (!comment || !comment.text || comment.deleted) return null;

  const maxDepth = 5;
  const indentWidth = Math.min(depth, maxDepth) * 1.5;

  return (
    <div className="py-2">
      <div style={{ marginLeft: `${indentWidth}rem` }}>
        <div className="border-l border-slate-700 pl-4">
          <div className="text-xs text-slate-500 mb-1">
            <Link
              to={`/user/${comment.by}`}
              className="hover:underline font-semibold text-slate-400 hover:text-slate-300"
            >
              {comment.by}
            </Link>
            {comment.time && ` ${timeAgo(comment.time)}`}
          </div>
          <div
            className="text-sm text-slate-400 leading-relaxed [&_pre]:whitespace-pre-wrap [&_p]:mb-2 [&_code]:bg-slate-800 [&_code]:px-1 [&_code]:rounded"
            dangerouslySetInnerHTML={{ __html: comment.text }}
          />
          {replies.length > 0 && (
            <div className="mt-2">
              {replies.map((reply) => (
                <Comment key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

