import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { getUser, getItem, timeAgo } from '../services/hnApi';
import Navigation from '../components/Navigation';
import Loading from '../components/Loading';
import Post from '../components/Post';
import Pagination from '../components/Pagination';

export default function User() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const activeTab = searchParams.get('tab') || 'submissions';
  
  const [user, setUser] = useState(null);
  const [submissionIds, setSubmissionIds] = useState([]);
  const [commentIds, setCommentIds] = useState([]);
  const [currentSubmissions, setCurrentSubmissions] = useState([]);
  const [currentComments, setCurrentComments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const itemsPerPage = 30;

  // Fetch user data and identify submission/comment IDs
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userData = await getUser(id);
        if (!userData) {
          setLoading(false);
          return;
        }
        
        setUser(userData);

        if (userData.submitted && userData.submitted.length > 0) {
          // Store all IDs - we'll filter on-demand per page
          // This avoids fetching hundreds of items upfront
          setSubmissionIds(userData.submitted);
          setCommentIds(userData.submitted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  // Fetch items for current page
  useEffect(() => {
    const fetchPageItems = async () => {
      if (!user || !submissionIds.length) return;

      if (activeTab === 'submissions') {
        // Fetch items in a wider range to account for dead/deleted items
        const fetchRange = itemsPerPage * 2; // Fetch more to account for filtering
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + fetchRange, submissionIds.length);
        const pageIds = submissionIds.slice(startIndex, endIndex);
        
        const itemPromises = pageIds.map((itemId) => getItem(itemId));
        const fetchedItems = await Promise.all(itemPromises);
        const validStories = fetchedItems.filter(
          item => item && !item.dead && !item.deleted && item.type === 'story' && item.title
        ).slice(0, itemsPerPage);
        
        setCurrentSubmissions(validStories);
      }

      if (activeTab === 'comments') {
        // Fetch items in a wider range to account for dead/deleted items
        const fetchRange = itemsPerPage * 2; // Fetch more to account for filtering
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + fetchRange, commentIds.length);
        const pageIds = commentIds.slice(startIndex, endIndex);
        
        const itemPromises = pageIds.map((itemId) => getItem(itemId));
        const fetchedItems = await Promise.all(itemPromises);
        const validComments = fetchedItems.filter(
          item => item && !item.dead && !item.deleted && item.type === 'comment' && item.text
        ).slice(0, itemsPerPage);
        
        setCurrentComments(validComments);
      }
    };

    fetchPageItems();
  }, [user, submissionIds, commentIds, activeTab, page, id]);

  const startIndex = (page - 1) * itemsPerPage;
  // Check if there might be more items based on what we fetched
  const hasMoreSubmissions = currentSubmissions.length === itemsPerPage && 
                             (startIndex + itemsPerPage * 2) < submissionIds.length;
  const hasMoreComments = currentComments.length === itemsPerPage && 
                          (startIndex + itemsPerPage * 2) < commentIds.length;

  const handleTabChange = (tab) => {
    setSearchParams({ tab, page: '1' });
  };

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

  if (!user) {
    return (
      <div>
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-red-400">User not found</div>
        </div>
      </div>
    );
  }

  const createdDate = user.created ? new Date(user.created * 1000).toLocaleDateString() : '';

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-4">
        <div className="mb-4">
          <div className="text-sm text-slate-400 mb-2">
            <a
              href={`https://news.ycombinator.com/user?id=${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              user: {id}
            </a>
          </div>
          <div className="text-xs text-slate-500">
            <span>karma: {user.karma || 0}</span>
            {createdDate && <span className="ml-4">created: {createdDate}</span>}
          </div>
          {user.about && (
            <div
              className="mt-3 text-xs text-slate-300 leading-normal [&_pre]:whitespace-pre-wrap [&_p]:mb-1.5 [&_code]:bg-slate-800 [&_code]:px-1 [&_code]:rounded [&_a]:text-slate-400 [&_a]:hover:underline"
              dangerouslySetInnerHTML={{ __html: user.about }}
            />
          )}
        </div>

        <div className="mt-4">
          <div className="flex gap-2 mb-3 border-b border-slate-700">
            <button
              onClick={() => handleTabChange('submissions')}
              className={`text-xs px-2 py-1 ${
                activeTab === 'submissions'
                  ? 'text-slate-300 border-b-2 border-slate-300'
                  : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              submissions
            </button>
            <button
              onClick={() => handleTabChange('comments')}
              className={`text-xs px-2 py-1 ${
                activeTab === 'comments'
                  ? 'text-slate-300 border-b-2 border-slate-300'
                  : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              comments
            </button>
          </div>

          {activeTab === 'submissions' && (
            <div>
              {currentSubmissions.length > 0 ? (
                <>
                  {currentSubmissions.map((story, index) => (
                    <Post key={story.id} post={story} index={startIndex + index} showIndex={false} />
                  ))}
                  {submissionIds.length > itemsPerPage && (
                    <Pagination currentPage={page} hasNext={hasMoreSubmissions} />
                  )}
                </>
              ) : submissionIds.length === 0 ? (
                <div className="text-center text-slate-500 py-8 text-xs">
                  No submissions
                </div>
              ) : (
                <div className="text-center text-slate-500 py-8 text-xs">
                  <Loading />
                </div>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div>
              {currentComments.length > 0 ? (
                <>
                  {currentComments.map((comment) => (
                    <div key={comment.id} className="border-b border-slate-700 py-2 px-3">
                      <div className="text-xs text-slate-500 mb-1">
                        <a
                          href={`https://news.ycombinator.com/item?id=${comment.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-slate-400 hover:text-slate-300"
                        >
                          on: item {comment.id}
                        </a>
                        {comment.time && ` ${timeAgo(comment.time)}`}
                      </div>
                      <div
                        className="text-xs text-slate-300 leading-normal [&_pre]:whitespace-pre-wrap [&_p]:mb-1.5 [&_code]:bg-slate-800 [&_code]:px-1 [&_code]:rounded [&_a]:text-slate-400 [&_a]:hover:underline"
                        dangerouslySetInnerHTML={{ __html: comment.text || '' }}
                      />
                    </div>
                  ))}
                  {commentIds.length > itemsPerPage && (
                    <Pagination currentPage={page} hasNext={hasMoreComments} />
                  )}
                </>
              ) : commentIds.length === 0 ? (
                <div className="text-center text-slate-500 py-8 text-xs">
                  No comments
                </div>
              ) : (
                <div className="text-center text-slate-500 py-8 text-xs">
                  <Loading />
                </div>
              )}
            </div>
          )}
        </div>
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

