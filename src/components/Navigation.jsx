import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'top' },
    { path: '/new', label: 'new' },
    { path: '/best', label: 'best' },
    { path: '/ask', label: 'ask' },
    { path: '/show', label: 'show' },
    { path: '/jobs', label: 'jobs' },
    { path: '/comments', label: 'comments' },
    { path: '/past', label: 'past' },
  ];

  return (
    <header className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 flex-wrap">
            <Link to="/" className="font-bold text-orange-500 text-lg mr-4">
              HN Dark
            </Link>
            <nav className="flex items-center gap-1 flex-wrap">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xs px-2 py-1 rounded hover:bg-slate-700 transition-colors ${
                    isActive(item.path)
                      ? 'text-orange-500 bg-slate-700'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-1">
            <Link
              to="/about"
              className={`text-xs px-2 py-1 rounded hover:bg-slate-700 transition-colors ${
                isActive('/about')
                  ? 'text-orange-500 bg-slate-700'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              about
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

