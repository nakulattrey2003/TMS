import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Sidebar({ isOpen, setIsOpen }) {
  const [openSubmenu, setOpenSubmenu] = useState('');
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { username: 'Guest', role: 'Guest' };

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  }

  function toggleSubmenu(menu) {
    setOpenSubmenu(openSubmenu === menu ? '' : menu);
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={function() { setIsOpen(false); }}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gray-900 text-white w-64 transform transition-transform duration-300 z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold">TMS</h2>
          <p className="text-sm text-gray-400">Transport Management</p>
        </div>

        <nav className="p-4">
          <Link to="/dashboard" className="block py-2 px-4 hover:bg-gray-800 rounded mb-2">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </span>
          </Link>

          {/* Shipments with Submenu */}
          <div className="mb-2">
            <button
              onClick={function() { toggleSubmenu('shipments'); }}
              className="w-full text-left py-2 px-4 hover:bg-gray-800 rounded flex items-center justify-between"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Shipments
              </span>
              <svg className={`w-4 h-4 transition-transform ${openSubmenu === 'shipments' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openSubmenu === 'shipments' && (
              <div className="ml-4 mt-1">
                <Link to="/dashboard" className="block py-2 px-4 hover:bg-gray-800 rounded text-sm">
                  All Shipments
                </Link>
                <Link to="/dashboard?filter=InTransit" className="block py-2 px-4 hover:bg-gray-800 rounded text-sm">
                  In Transit
                </Link>
                <Link to="/dashboard?filter=Delivered" className="block py-2 px-4 hover:bg-gray-800 rounded text-sm">
                  Delivered
                </Link>
              </div>
            )}
          </div>

          <Link to="/analytics" className="block py-2 px-4 hover:bg-gray-800 rounded mb-2">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </span>
          </Link>

          <Link to="/settings" className="block py-2 px-4 hover:bg-gray-800 rounded mb-2">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </span>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <div className="mb-2 text-sm">
            <p className="font-semibold">{user.username}</p>
            <p className="text-gray-400 text-xs">{user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
