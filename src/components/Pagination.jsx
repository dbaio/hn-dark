import { useLocation } from 'react-router-dom';

export default function Pagination({ currentPage = 1, hasNext = true }) {
  const location = useLocation();
  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = currentPage + 1;

  const buildUrl = (pageNum) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('page', pageNum.toString());
    const [base] = location.pathname.split('?');
    return `${base}?${searchParams.toString()}`;
  };
  
  return (
    <div className="bg-slate-800 border-t border-slate-700">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentPage > 1 ? (
              <a
                href={buildUrl(prevPage)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors text-sm"
              >
                ← Previous
              </a>
            ) : (
              <span className="px-4 py-2 bg-slate-800 text-slate-600 rounded text-sm cursor-not-allowed">
                ← Previous
              </span>
            )}
          </div>
          
          <span className="text-sm text-slate-500">
            Page {currentPage}
          </span>
          
          <div className="flex items-center gap-2">
            {hasNext ? (
              <a
                href={buildUrl(nextPage)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors text-sm"
              >
                More →
              </a>
            ) : (
              <span className="px-4 py-2 bg-slate-800 text-slate-600 rounded text-sm cursor-not-allowed">
                More →
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

