import Navigation from '../components/Navigation';

export default function About() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          <h1 className="text-3xl font-bold text-slate-200 mb-6">About HN Dark</h1>
          
          <div className="space-y-6 text-slate-300">
            <p>
              HN Dark is a dark mode interface for reading Hacker News. 
              It provides a more comfortable viewing experience during extended reading sessions.
            </p>
            
            <div>
              <h2 className="text-xl font-semibold text-slate-200 mb-3">Features</h2>
              <ul className="list-disc list-inside space-y-1 text-slate-400 ml-2">
                <li>Dark theme with optimized contrast</li>
                <li>All HN content sections</li>
                <li>Threaded comments</li>
                <li>Pagination</li>
                <li>Mobile responsive</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-slate-200 mb-3">Technical</h2>
              <ul className="list-disc list-inside space-y-1 text-slate-400 ml-2">
                <li>React and Vite</li>
                <li>TailwindCSS for styling</li>
                <li>React Router for navigation</li>
                <li>Hacker News API for data</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-slate-200 mb-3">Privacy</h2>
              <p className="text-slate-400">
                HN Dark is a read-only interface. No data is collected or stored. 
                Content is fetched directly from the Hacker News API.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-slate-200 mb-3">Disclaimer</h2>
              <p className="text-slate-400">
                This is an unofficial interface. Not affiliated with Y Combinator or Hacker News. 
                For the official site, visit{' '}
                <a
                  href="https://news.ycombinator.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:underline"
                >
                  news.ycombinator.com
                </a>
                .
              </p>
            </div>
          </div>
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
