import { Link } from 'react-router-dom';

function Header({ setSidebarOpen }) {
  return (
    <header className="bg-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={function() { setSidebarOpen(function(prev) { return !prev; }); }}
          className="lg:hidden text-gray-700 hover:text-gray-900"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <nav className="flex space-x-6 ml-4">
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
            Home
          </Link>
          <Link to="/tracking" className="text-gray-700 hover:text-blue-600 font-medium">
            Tracking
          </Link>
          <Link to="/reports" className="text-gray-700 hover:text-blue-600 font-medium">
            Reports
          </Link>
          <Link to="/help" className="text-gray-700 hover:text-blue-600 font-medium">
            Help
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <button className="text-gray-700 hover:text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button className="text-gray-700 hover:text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
