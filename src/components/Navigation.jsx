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
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="align-middle" style={{ width: '1%' }}>
                <Link to="/" className="font-bold text-orange-500 text-sm">
                  HN Dark
                </Link>
              </td>
              <td className="align-middle pl-1">
                <nav className="flex items-center flex-wrap">
                  {navItems.map((item, index) => (
                    <span key={item.path} className="flex items-center">
                      {index > 0 && <span className="text-xs text-orange-500 px-1">|</span>}
                      <Link
                        to={item.path}
                        className={`text-xs px-1 ${
                          isActive(item.path)
                            ? 'text-orange-400 font-bold'
                            : 'text-orange-500 hover:text-orange-400 hover:underline'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </span>
                  ))}
                  <span className="text-xs text-orange-500 px-1">|</span>
                  <Link
                    to="/about"
                    className={`text-xs px-1 ${
                      isActive('/about')
                        ? 'text-orange-400 font-bold'
                        : 'text-orange-500 hover:text-orange-400 hover:underline'
                    }`}
                  >
                    about
                  </Link>
                </nav>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </header>
  );
}

